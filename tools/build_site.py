#!/usr/bin/env python3
"""Generuje dane strony treningowej w site/data/ (oraz kopiuje PDF-y do site/pdf/).

Uruchom: python3 tools/build_site.py [kod ...]
Wymaga dzialajacej MariaDB (root bez hasla) i pymysql.

Dla kazdego arkusza z baza powstaje:
  site/data/<kod>/db.sqlite   - stan poczatkowy bazy (z MariaDB, nie z dumpu)
  site/data/<kod>/sheet.json  - tresc kwerend, wzorcowe SQL i oczekiwane wyniki z MariaDB
oraz wspolny site/data/index.json.
"""
import datetime
import decimal
import json
import os
import re
import shutil
import sqlite3
import sys

import pymysql

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from verify import ROOT, WORK, mysql, split_sql  # noqa: E402

SITE = os.path.join(ROOT, "site")
DATA = os.path.join(SITE, "data")
PDF_DIR = os.path.join(SITE, "pdf")

USER_SQL = re.compile(r"^\s*(create\s+user|grant|revoke|drop\s+user|set\s+password|alter\s+user)\b", re.I)
MODIFY_SQL = re.compile(r"^\s*(insert|update|delete|replace)\b", re.I)
VIEW_SQL = re.compile(r"^\s*create\s+(or\s+replace\s+)?(algorithm\s*=\s*\w+\s+)?view\b", re.I)
DDL_SQL = re.compile(r"^\s*(alter\s+table|create\s+table|drop\s+table|rename\s+table|create\s+(?:unique\s+)?index)\b", re.I)


# --- tresc arkusza -----------------------------------------------------------------

def clean_line(s):
    s = re.sub(r"^\W+", "", s)
    return re.sub(r"\s+", " ", s).strip()


def parse_prompts(task):
    """Wyciaga tresci 'Zapytanie N: ...' z sekcji operacji na bazie."""
    lines = task.splitlines()
    prompts = {}
    i = 0
    while i < len(lines):
        m = re.match(r"^\W*Zapytanie\s+(\d+)\s*:\s*(.*)$", lines[i])
        if m and int(m.group(1)) not in prompts:
            n = int(m.group(1))
            parts = [m.group(2).strip()]
            j = i + 1
            while j < len(lines):
                ln = lines[j]
                if not ln.strip() or re.match(r"^\W*Zapytanie\s+\d+\s*:", ln) or re.search(r"Strona \d+ z \d+", ln):
                    break
                parts.append(clean_line(ln))
                j += 1
            text = " ".join(p for p in parts if p)
            text = re.sub(r"([a-ząćęłńóśźż])- ([a-ząćęłńóśźż])", r"\1\2", text)  # dzielenie wyrazow na koncu linii
            text = re.sub(r"(\d)- (\d)", r"\1-\2", text)  # data przelamana po myslniku
            prompts[n] = text
            i = j
        else:
            i += 1
    return prompts


def group_queries(text):
    """Dzieli kwerendy.txt na zapytania wg naglowkow '-- Zapytanie N'; jedno zapytanie moze miec kilka instrukcji."""
    parts = re.split(r"^\s*(?:--|#|/\*)?\s*(?:zapytanie|kwerenda)\s*(\d+)\b.*$", text, flags=re.I | re.M)
    if len(parts) < 3:
        return [[q] for q in split_sql(text)]
    groups = []
    for i in range(1, len(parts), 2):
        stmts = split_sql(parts[i + 1])
        if stmts:
            groups.append(stmts)
    return groups


def sheet_title(wynik, files):
    """Tytul strony z wzorcowego rozwiazania (znacznik <title>)."""
    for f in sorted(files, key=lambda f: (not f.startswith("index"), f)):
        if f.endswith((".php", ".html")):
            m = re.search(r"<title>(.*?)</title>", open(os.path.join(wynik, f), encoding="utf-8", errors="replace").read(), re.S | re.I)
            if m and m.group(1).strip() and "<?" not in m.group(1):
                return re.sub(r"\s+", " ", m.group(1)).strip()
    return ""


def sheet_label(code):
    m = re.match(r"(inf0\d)_(\d{4})_(\d{2})_(\d{2})", code)
    if not m:
        return code
    kw, year, month, nr = m.groups()
    session = {"01": "styczeń", "06": "czerwiec"}.get(month, month)
    return f"{kw.upper().replace('INF0', 'INF.0')} {session} {year}, arkusz {int(nr)}"


# --- tagi wzorcow ---------------------------------------------------------------

def sql_tags(sql):
    s = " " + re.sub(r"\s+", " ", sql.lower()) + " "
    tags = []
    if USER_SQL.match(sql):
        tags.append("sql:uzytkownicy")
    elif re.match(r"\s*insert", s):
        tags.append("sql:insert")
    elif re.match(r"\s*update", s):
        tags.append("sql:update")
    elif re.match(r"\s*delete", s):
        tags.append("sql:delete")
    elif DDL_SQL.match(sql) or VIEW_SQL.match(sql):
        tags.append("sql:ddl")
    else:
        tags.append("sql:select")
        if " join " in s or re.search(r"from \w+\s*,\s*\w+", s):
            tags.append("sql:join")
        if " group by " in s or re.search(r"\b(count|avg|sum|min|max)\s*\(", s):
            tags.append("sql:agregacja")
        if " order by " in s or " limit " in s:
            tags.append("sql:sortowanie")
        if re.search(r" like | between | in \(| is null| is not null", s):
            tags.append("sql:warunki")
        if re.search(r"\bas\b", s):
            tags.append("sql:aliasy")
        if re.search(r"\b(year|month|day|curdate|now|datediff|date_format)\s*\(", s):
            tags.append("sql:daty")
    return tags


def query_kind(sql):
    if USER_SQL.match(sql):
        return "user"
    if MODIFY_SQL.match(sql):
        return "modify"
    if VIEW_SQL.match(sql):
        return "view"
    if DDL_SQL.match(sql):
        return "ddl"
    return "select"


def target_table(sql):
    m = re.match(r"\s*(?:insert\s+(?:ignore\s+)?into|replace\s+into|update|delete\s+from|alter\s+table|create\s+table(?:\s+if\s+not\s+exists)?|drop\s+table(?:\s+if\s+exists)?)\s+`?(\w+)`?", sql, re.I)
    return m.group(1) if m else None


# --- MariaDB -> JSON / SQLite ---------------------------------------------------------

def jsonable(v):
    if v is None or isinstance(v, (int, float, str)):
        return v
    if isinstance(v, decimal.Decimal):
        return float(v) if v != v.to_integral_value() else int(v)
    if isinstance(v, (datetime.date, datetime.datetime)):
        return v.isoformat(sep=" ") if isinstance(v, datetime.datetime) else v.isoformat()
    if isinstance(v, datetime.timedelta):
        secs = int(v.total_seconds())
        return f"{secs // 3600:02d}:{secs % 3600 // 60:02d}:{secs % 60:02d}"
    if isinstance(v, (bytes, bytearray)):
        try:
            return v.decode("utf-8")
        except UnicodeDecodeError:
            return v.hex()
    return str(v)


def connect(db):
    return pymysql.connect(unix_socket="/run/mysqld/mysqld.sock", user="root", password="", database=db, charset="utf8mb4", autocommit=True)


def tables_of(conn, db):
    with conn.cursor() as c:
        c.execute("SELECT table_name FROM information_schema.tables WHERE table_schema=%s AND table_type='BASE TABLE' ORDER BY table_name", (db,))
        return [r[0] for r in c.fetchall()]


def table_columns(conn, db, table):
    with conn.cursor() as c:
        c.execute("""SELECT column_name, column_type, data_type, column_key, extra, is_nullable, column_default
                     FROM information_schema.columns WHERE table_schema=%s AND table_name=%s ORDER BY ordinal_position""", (db, table))
        return [dict(zip(["name", "type", "data_type", "key", "extra", "nullable", "default"], r)) for r in c.fetchall()]


def table_rows(conn, table):
    with conn.cursor() as c:
        c.execute(f"SELECT * FROM `{table}`")
        return [[jsonable(v) for v in r] for r in c.fetchall()]


def foreign_keys(conn, db):
    with conn.cursor() as c:
        c.execute("""SELECT table_name, column_name, referenced_table_name, referenced_column_name
                     FROM information_schema.key_column_usage
                     WHERE table_schema=%s AND referenced_table_name IS NOT NULL""", (db,))
        return [dict(zip(["table", "column", "ref_table", "ref_column"], r)) for r in c.fetchall()]


TEXT_TYPES = ("char", "varchar", "text", "tinytext", "mediumtext", "longtext", "enum", "set")


def sqlite_type(col):
    dt = col["data_type"].lower()
    if dt in ("int", "integer", "tinyint", "smallint", "mediumint", "bigint", "year", "bit"):
        return "INTEGER"
    if dt in ("decimal", "numeric", "float", "double", "real"):
        return "REAL"
    if dt in TEXT_TYPES:
        return "TEXT COLLATE NOCASE"
    return "TEXT"


def write_sqlite(conn, db, path):
    if os.path.exists(path):
        os.remove(path)
    lite = sqlite3.connect(path)
    schema = []
    for t in tables_of(conn, db):
        cols = table_columns(conn, db, t)
        pk = [c["name"] for c in cols if c["key"] == "PRI"]
        defs = []
        for c in cols:
            if len(pk) == 1 and c["name"] == pk[0] and "auto_increment" in (c["extra"] or "") and sqlite_type(c) == "INTEGER":
                defs.append(f'"{c["name"]}" INTEGER PRIMARY KEY AUTOINCREMENT')
                continue
            d = f'"{c["name"]}" {sqlite_type(c)}'
            if c["nullable"] == "NO":
                d += " NOT NULL"
            default = c["default"]
            # MariaDB podaje domyslne teksty juz w apostrofach, liczby bez nich
            if default is not None and default.upper() != "NULL" and re.fullmatch(r"-?[0-9.]+|'.*'", default):
                d += f" DEFAULT {default}"
            defs.append(d)
        if pk and not any("PRIMARY KEY" in d for d in defs):
            defs.append("PRIMARY KEY (" + ", ".join(f'"{p}"' for p in pk) + ")")
        lite.execute(f'CREATE TABLE "{t}" (' + ", ".join(defs) + ")")
        rows = table_rows(conn, t)
        if rows:
            lite.executemany(f'INSERT INTO "{t}" VALUES (' + ",".join("?" * len(cols)) + ")", rows)
        with conn.cursor() as c:
            c.execute("SELECT auto_increment FROM information_schema.tables WHERE table_schema=%s AND table_name=%s", (db, t))
            ai = c.fetchone()[0]
        if ai and any("AUTOINCREMENT" in d for d in defs):
            # ten sam nastepny identyfikator co w MariaDB (dump ustawia AUTO_INCREMENT=...)
            lite.execute("DELETE FROM sqlite_sequence WHERE name=?", (t,))
            lite.execute("INSERT INTO sqlite_sequence(name, seq) VALUES (?, ?)", (t, ai - 1))
        schema.append({
            "table": t,
            "columns": [{"name": c["name"], "type": c["type"], "key": c["key"], "extra": c["extra"]} for c in cols],
            "count": len(rows),
            "sample": rows[:5],
        })
    lite.commit()
    lite.execute("VACUUM")
    lite.close()
    return schema


def snapshot(conn, db, table):
    if not table or table not in tables_of(conn, db):
        return None
    cols = table_columns(conn, db, table)
    return {
        "table": table,
        "columns": [c["name"] for c in cols],
        "types": [c["type"] for c in cols],
        "nullable": [c["nullable"] == "YES" for c in cols],
        "defaults": [None if c["default"] in (None, "NULL") else c["default"].strip("'") for c in cols],
        "rows": table_rows(conn, table),
    }


def run_reference(conn, db, n, sql, kind):
    """Wykonuje wzorcowa kwerende na MariaDB i zwraca oczekiwany wynik."""
    exp = {}
    table = target_table(sql)
    with conn.cursor() as c:
        try:
            c.execute(sql)
        except Exception as e:  # noqa: BLE001
            return {"error": str(e)[:300]}
        if kind == "select":
            exp["columns"] = [d[0] for d in c.description] if c.description else []
            exp["rows"] = [[jsonable(v) for v in r] for r in c.fetchall()]
    if kind in ("modify", "ddl"):
        exp["table"] = table
        exp["after"] = snapshot(conn, db, table)
    if kind == "view":
        name = re.search(r"\bview\s+`?(\w+)`?", sql, re.I).group(1)
        with conn.cursor() as c:
            c.execute(f"SELECT * FROM `{name}`")
            exp["columns"] = [d[0] for d in c.description]
            exp["rows"] = [[jsonable(v) for v in r] for r in c.fetchall()]
    return exp


# --- glowna petla ----------------------------------------------------------------

def build_sheet(code):
    d = os.path.join(WORK, code)
    meta = json.load(open(os.path.join(d, "meta.json"), encoding="utf-8"))
    task = open(os.path.join(d, "task.txt"), encoding="utf-8").read()
    out_dir = os.path.join(DATA, code)
    os.makedirs(out_dir, exist_ok=True)
    wynik = os.path.join(d, "wynik")
    files = sorted(os.listdir(wynik)) if os.path.isdir(wynik) else []
    kind = "php" if any(f.endswith(".php") for f in files) else "js"

    pdf_src = os.path.join(ROOT, meta["pdf"]) if meta.get("pdf") else None
    pdf_name = None
    if pdf_src and os.path.exists(pdf_src):
        os.makedirs(PDF_DIR, exist_ok=True)
        pdf_name = os.path.basename(pdf_src)
        shutil.copy2(pdf_src, os.path.join(PDF_DIR, pdf_name))

    sheet = {
        "code": code,
        "label": sheet_label(code),
        "title": sheet_title(wynik, files),
        "kind": kind,
        "db": meta.get("db"),
        "pdf": f"pdf/{pdf_name}" if pdf_name else None,
        "schema": [],
        "foreign_keys": [],
        "queries": [],
    }

    ref_path = os.path.join(wynik, "kwerendy.txt")
    groups = group_queries(open(ref_path, encoding="utf-8", errors="replace").read()) if os.path.exists(ref_path) else []
    queries = [s for g in groups for s in g]
    if meta.get("db") and meta.get("sql_files"):
        db = meta["db"]
        # import dumpu jak w verify.py, uzytkownicy z kwerend usuwani dla powtarzalnosci
        for m in re.finditer(r"create\s+user\s+(?:if\s+not\s+exists\s+)?([^\s;]+)", "\n".join(queries), re.I):
            mysql(["-e", f"DROP USER IF EXISTS {m.group(1)};"])
        code_, _, err = mysql(["-e", f"DROP DATABASE IF EXISTS `{db}`; CREATE DATABASE `{db}` CHARACTER SET utf8 COLLATE utf8_unicode_ci;"])
        if code_:
            raise RuntimeError(err)
        for sf in meta["sql_files"]:
            code_, _, err = mysql([], open(os.path.join(d, sf), encoding="utf-8", errors="replace").read(), db)
            if code_:
                raise RuntimeError(f"{code}: import {sf}: {err[:200]}")
        conn = connect(db)
        try:
            sheet["schema"] = write_sqlite(conn, db, os.path.join(out_dir, "db.sqlite"))
            sheet["foreign_keys"] = foreign_keys(conn, db)
            prompts = parse_prompts(task)
            for n, stmts in enumerate(groups, 1):
                last = stmts[-1]
                kind_q = query_kind(last)
                q = {
                    "n": n,
                    "prompt": prompts.get(n, ""),
                    "sql": ";\n".join(stmts) + ";",
                    "statements": stmts,
                    "kind": kind_q,
                    "tags": sorted({t for st in stmts for t in sql_tags(st)}),
                    "ordered": bool(re.search(r"\border\s+by\b", last, re.I)),
                }
                for st in stmts[:-1]:
                    with conn.cursor() as c:
                        c.execute(st)
                if kind_q == "user":
                    with conn.cursor() as c:
                        try:
                            c.execute(last)
                        except Exception as e:  # noqa: BLE001
                            q["error"] = str(e)[:300]
                else:
                    q["expected"] = run_reference(conn, db, n, last, kind_q)
                sheet["queries"].append(q)
        finally:
            conn.close()
            for m in re.finditer(r"create\s+user\s+(?:if\s+not\s+exists\s+)?([^\s;]+)", "\n".join(queries), re.I):
                mysql(["-e", f"DROP USER IF EXISTS {m.group(1)};"])

    with open(os.path.join(out_dir, "sheet.json"), "w", encoding="utf-8") as f:
        json.dump(sheet, f, ensure_ascii=False, separators=(",", ":"))

    tags = sorted({t for q in sheet["queries"] for t in q["tags"]} | {f"web:{kind}"})
    return {
        "code": code,
        "label": sheet["label"],
        "title": sheet["title"],
        "kind": kind,
        "db": sheet["db"],
        "queries": [{"n": q["n"], "tags": q["tags"], "kind": q["kind"], "prompt": q["prompt"], "len": len(q["sql"])} for q in sheet["queries"]],
        "tags": tags,
    }


def main():
    codes = sys.argv[1:] or sorted(c for c in os.listdir(WORK) if os.path.isdir(os.path.join(WORK, c)) and os.path.exists(os.path.join(WORK, c, "meta.json")))
    os.makedirs(DATA, exist_ok=True)
    index_path = os.path.join(DATA, "index.json")
    index = {}
    if sys.argv[1:] and os.path.exists(index_path):
        index = {s["code"]: s for s in json.load(open(index_path, encoding="utf-8"))["sheets"]}
    for code in codes:
        index[code] = build_sheet(code)
        print(code, len(index[code]["queries"]), "kwerend")
    sheets = [index[k] for k in sorted(index)]
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump({"sheets": sheets}, f, ensure_ascii=False, separators=(",", ":"))
    print(f"{len(sheets)} arkuszy -> {os.path.relpath(index_path, ROOT)}")


if __name__ == "__main__":
    main()
