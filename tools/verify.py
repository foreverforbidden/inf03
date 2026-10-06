#!/usr/bin/env python3
"""Deterministyczny tester rozwiazania jednego arkusza.

Uruchom: python3 tools/verify.py <kod> [--quiet]
Czyta work/<kod>/meta.json i work/<kod>/wynik/, zapisuje work/<kod>/verify.json
i wypisuje jedna linie podsumowania (plus liste bledow, chyba ze --quiet).
"""
import fcntl
import html.parser
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, "work")
IMG_EXT = (".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg")
PHP_ERR = re.compile(r"(Fatal error|Warning|Notice|Deprecated|Parse error|Uncaught)\b.*?(?:on line \d+|$)", re.I | re.M)
JS_CHECK = """
ObjC.import('Foundation');
function run(argv) {
  var out = [];
  argv.forEach(function (p) {
    var s = $.NSString.stringWithContentsOfFileEncodingError(p, $.NSUTF8StringEncoding, null);
    if (s.isNil()) { out.push(p + ': nie mozna odczytac'); return; }
    try { new Function(s.js); } catch (e) { out.push(p + ': ' + e); }
  });
  return out.join('\\n');
}
"""


class Report:
    def __init__(self):
        self.fails, self.warns, self.info = [], [], {}

    def fail(self, msg):
        self.fails.append(msg)

    def warn(self, msg):
        self.warns.append(msg)


class PageParser(html.parser.HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.tags, self.attrs, self.forms, self.title = set(), [], [], None
        self._in_title, self._form, self.inline_js = False, None, []
        self._in_script = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        self.tags.add(tag)
        self.attrs.append((tag, a))
        if tag == "title":
            self._in_title, self.title = True, ""
        if tag == "script" and not a.get("src"):
            self._in_script = True
            self.inline_js.append("")
        if tag == "form":
            self._form = {"action": a.get("action", ""), "method": (a.get("method") or "get").lower(), "fields": {}}
            self.forms.append(self._form)
        if self._form is not None and tag in ("input", "select", "textarea") and a.get("name"):
            t = (a.get("type") or "").lower()
            if t in ("checkbox", "radio") and a["name"] in self._form["fields"]:
                return
            val = a.get("value") or ("2" if t in ("number", "range") else "Test")
            if t == "email":
                val = "test@example.com"
            if t == "date":
                val = "2024-01-15"
            self._form["fields"][a["name"]] = val
        if self._form is not None and tag == "option" and self._form["fields"].get("_sel_pending"):
            pass

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        if tag == "script":
            self._in_script = False
        if tag == "form":
            self._form = None

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._in_script:
            self.inline_js[-1] += data


def free_port():
    s = socket.socket()
    s.bind(("127.0.0.1", 0))
    p = s.getsockname()[1]
    s.close()
    return p


def mysql(args, sql=None, db=None):
    cmd = ["mariadb", "-uroot", "--default-character-set=utf8mb4"] + args + ([db] if db else [])
    r = subprocess.run(cmd, input=sql, capture_output=True, text=True)
    return r.returncode, r.stdout, r.stderr.strip()


def split_sql(text):
    """Dzieli kwerendy.txt na zapytania (srednik poza cudzyslowami), pomija komentarze."""
    text = re.sub(r"^\s*(--|#).*$", "", text, flags=re.M)
    text = re.sub(r"/\*.*?\*/", "", text, flags=re.S)
    out, cur, q = [], "", None
    for ch in text:
        if q:
            cur += ch
            if ch == q:
                q = None
        elif ch in "'\"`":
            q = ch
            cur += ch
        elif ch == ";":
            if cur.strip():
                out.append(cur.strip())
            cur = ""
        else:
            cur += ch
    if cur.strip():
        out.append(cur.strip())
    # odfiltruj linie-opisy typu "Zapytanie 1:" sklejone z SQL
    clean = []
    for s in out:
        s = re.sub(r"^(zapytanie|kwerenda)\s*\d+\s*[:.)-]?\s*", "", s, flags=re.I)
        if s:
            clean.append(s)
    return clean


def reset_db(meta, rep, d):
    db = meta["db"]
    code, _, err = mysql(["-e", f"DROP DATABASE IF EXISTS `{db}`; CREATE DATABASE `{db}` CHARACTER SET utf8 COLLATE utf8_unicode_ci;"])
    if code:
        rep.fail(f"baza: nie mozna utworzyc {db}: {err}")
        return False
    for sql_file in meta.get("sql_files", []):
        with open(os.path.join(d, sql_file), encoding="utf-8", errors="replace") as f:
            code, _, err = mysql([], f.read(), db)
        if code:
            rep.fail(f"baza: import {sql_file} nieudany: {err[:300]}")
            return False
    return True


def check_queries(meta, rep, d, out):
    path = os.path.join(out, "kwerendy.txt")
    if not os.path.exists(path):
        return
    with open(path, encoding="utf-8", errors="replace") as f:
        queries = split_sql(f.read())
    if not queries:
        rep.fail("kwerendy.txt: brak zapytan")
        return
    if not meta.get("db"):
        rep.warn("kwerendy.txt istnieje, ale w tresci nie znaleziono nazwy bazy - pomijam wykonanie")
        return
    # Uzytkownicy tworzeni w kwerendach - usun przed testem, zeby test byl powtarzalny
    for m in re.finditer(r"create\s+user\s+(?:if\s+not\s+exists\s+)?([^\s;]+)", "\n".join(queries), re.I):
        mysql(["-e", f"DROP USER IF EXISTS {m.group(1)};"])
    if not reset_db(meta, rep, d):
        return
    results = []
    for i, sql in enumerate(queries, 1):
        code, stdout, err = mysql(["--table", "-e", sql], db=meta["db"])
        lines = stdout.strip().splitlines()
        rows = max(0, len(lines) - 4) if lines else 0
        res = {"n": i, "sql": sql, "ok": code == 0}
        if code:
            res["error"] = err[:300]
            rep.fail(f"kwerenda {i}: blad SQL: {err[:200]}")
        else:
            res["rows"] = rows
            res["preview"] = "\n".join(lines[:9])
            if re.match(r"\s*select", sql, re.I) and rows == 0:
                rep.warn(f"kwerenda {i}: SELECT zwraca 0 wierszy")
        results.append(res)
    rep.info["queries"] = results
    expected = len(re.findall(r"Zapytanie\s+\d+\s*:", meta.get("_task_flat", "")))
    if expected and len(queries) != expected:
        rep.warn(f"kwerendy.txt: {len(queries)} zapytan, w tresci {expected}")


def js_syntax(files, rep):
    if not files:
        return
    if shutil.which("node"):
        for f in files:
            r = subprocess.run(["node", "--check", f], capture_output=True, text=True)
            if r.returncode:
                err = next((l for l in r.stderr.splitlines() if "Error" in l), r.stderr.strip())
                rep.fail(f"JS skladnia: {f}: {err[:200]}")
        return
    if not shutil.which("osascript"):
        rep.warn("JS skladnia: brak node i osascript - pominieto")
        return
    r = subprocess.run(["osascript", "-l", "JavaScript", "-e", JS_CHECK] + files, capture_output=True, text=True)
    for line in (r.stdout + r.stderr).strip().splitlines():
        if line.strip():
            rep.fail(f"JS skladnia: {line.strip()[:200]}")


def fetch(url, data=None):
    try:
        req = urllib.request.Request(url, data=data)
        with urllib.request.urlopen(req, timeout=15) as r:
            return r.status, r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8", "replace")
    except Exception as e:
        return 0, str(e)


def check_static(out, pages, rep, tmpjs):
    for page in pages:
        p = os.path.join(out, page)
        src = open(p, encoding="utf-8", errors="replace").read()
        try:
            open(p, encoding="utf-8").read()
        except UnicodeDecodeError:
            rep.fail(f"{page}: plik nie jest w UTF-8")
        low = src.lower()
        # czysty skrypt PHP bez HTML (np. wylogowanie z przekierowaniem) nie jest strona
        script_only = page.endswith(".php") and "<html" not in low and re.search(r"header\s*\(\s*[\"']location", low)
        if not script_only and not re.search(r"<!doctype html>", low):
            rep.fail(f"{page}: brak <!DOCTYPE html>")
        if not script_only and not re.search(r"<html[^>]*\blang\s*=\s*[\"']?pl", low):
            rep.fail(f"{page}: brak lang=\"pl\"")
        if not script_only and not re.search(r"<meta[^>]*charset\s*=\s*[\"']?utf-8", low):
            rep.fail(f"{page}: brak <meta charset=\"UTF-8\">")
        if page.endswith(".php") and "mysqli_connect" in src and "mysqli_close" not in src:
            rep.fail(f"{page}: brak mysqli_close")
        if page.endswith(".php"):
            r = subprocess.run(["php", "-l", p], capture_output=True, text=True)
            if r.returncode:
                rep.fail(f"{page}: php -l: {r.stdout.strip() or r.stderr.strip()}"[:300])
        # skrypty inline (bez PHP w srodku)
        for i, js in enumerate(re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", src, re.S | re.I)):
            if "<?" in js or not js.strip():
                continue
            f = os.path.join(tmpjs, f"{page}.inline{i}.js")
            with open(f, "w") as fh:
                fh.write(js)


def check_rendered(page, body, out, rep, seen_links, submitted=()):
    for m in PHP_ERR.finditer(body):
        rep.fail(f"{page}: komunikat PHP w wyniku: {m.group(0)[:200]}")
    pp = PageParser()
    try:
        pp.feed(body)
    except Exception as e:
        rep.warn(f"{page}: blad parsowania HTML: {e}")
        return pp
    if not pp.title or not pp.title.strip():
        rep.fail(f"{page}: brak <title>")
    css_links = [a.get("href", "") for t, a in pp.attrs if t == "link" and "stylesheet" in (a.get("rel") or "").lower()]
    for href in css_links:
        if not href.startswith("http") and not os.path.exists(os.path.join(out, urllib.parse.unquote(href.split("?")[0]))):
            rep.fail(f"{page}: arkusz stylow {href} nie istnieje")
    for t, a in pp.attrs:
        for attr in ("src",):
            v = a.get(attr)
            if t in ("img", "script", "source", "video", "audio") and v and not re.match(r"(https?:|data:|//)", v):
                if not os.path.exists(os.path.join(out, urllib.parse.unquote(v.split("?")[0]))):
                    if v in submitted:
                        # nazwa pliku pochodzi z danych testowych wyslanych formularzem
                        rep.warn(f"{page}: brak pliku {v} (<{t} {attr}>) z danych formularza")
                    else:
                        rep.fail(f"{page}: brak pliku {v} (<{t} {attr}>)")
        if t == "a" and a.get("href"):
            h = a["href"]
            if re.match(r"(https?:|mailto:|tel:|#|javascript:)", h):
                continue
            target = urllib.parse.unquote(h.split("?")[0].split("#")[0])
            if target and not os.path.exists(os.path.join(out, target)):
                # zrzuty ekranu pomijamy celowo - link do nich to tylko ostrzezenie
                if re.fullmatch(r"(kw|kwerenda|zapytanie|zrzut|import|baza)\w*\.(png|jpe?g)", target, re.I):
                    rep.warn(f"{page}: odnosnik do pominietego zrzutu {h}")
                else:
                    rep.fail(f"{page}: odnosnik do nieistniejacego pliku {h}")
            elif "?" in h:
                seen_links.append(h)
    return pp


def check_server(meta, out, pages, rep, d):
    if meta.get("db") and meta.get("sql_files"):
        reset_db(meta, rep, d)  # swieza baza dla stron (kwerendy mogly ja zmienic)
    port = free_port()
    srv = subprocess.Popen(["php", "-S", f"127.0.0.1:{port}", "-t", out], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    base = f"http://127.0.0.1:{port}/"
    try:
        for _ in range(50):
            try:
                socket.create_connection(("127.0.0.1", port), timeout=0.2).close()
                break
            except OSError:
                time.sleep(0.1)
        links, forms, page_info = [], [], []
        for page in pages:
            status, body = fetch(base + urllib.parse.quote(page))
            page_info.append({"page": page, "status": status, "bytes": len(body)})
            if status != 200:
                rep.fail(f"{page}: HTTP {status}")
                continue
            pp = check_rendered(page, body, out, rep, links)
            for f in pp.forms:
                forms.append((page, f))
        for h in list(dict.fromkeys(links))[:4]:
            status, body = fetch(base + h)
            page_info.append({"page": h, "status": status, "bytes": len(body)})
            if status != 200:
                rep.fail(f"link {h}: HTTP {status}")
            else:
                check_rendered(h, body, out, rep, [])
        for page, f in forms[:4]:
            action = f["action"] or page
            if action.startswith(("http", "javascript")) or not action.endswith(".php") and not action.split("?")[0].endswith(".php"):
                continue
            fields = {k: v for k, v in f["fields"].items() if not k.startswith("_")}
            data = urllib.parse.urlencode(fields)
            if f["method"] == "post":
                status, body = fetch(base + action, data.encode())
            else:
                status, body = fetch(base + action + ("&" if "?" in action else "?") + data)
            label = f"formularz {page}->{action} [{f['method']}]"
            page_info.append({"page": label, "status": status, "bytes": len(body), "fields": fields})
            if status != 200:
                rep.fail(f"{label}: HTTP {status}")
            else:
                check_rendered(label, body, out, rep, [], set(fields.values()))
        rep.info["pages"] = page_info
    finally:
        srv.terminate()
        srv.wait()


def check_css(out, rep):
    for f in os.listdir(out):
        if f.endswith(".css"):
            src = open(os.path.join(out, f), encoding="utf-8", errors="replace").read()
            if src.count("{") != src.count("}"):
                rep.fail(f"{f}: niezbalansowane nawiasy klamrowe")


def main():
    code = sys.argv[1].rstrip("/").split("/")[-1]
    quiet = "--quiet" in sys.argv
    d = os.path.join(WORK, code)
    out = os.path.join(d, "wynik")
    meta = json.load(open(os.path.join(d, "meta.json")))
    meta["_task_flat"] = re.sub(r"\s+", " ", open(os.path.join(d, "task.txt")).read())
    rep = Report()

    if not os.path.isdir(out) or not os.listdir(out):
        rep.fail("brak plikow w wynik/")
    else:
        mat_files = set()
        for dp, _, names in os.walk(os.path.join(d, "materialy")):
            mat_files |= {os.path.splitext(n)[0].lower() for n in names}
        for f in meta.get("required_files", []):
            if os.path.exists(os.path.join(out, f)):
                continue
            stem, ext = os.path.splitext(f)
            if ext.lower() in IMG_EXT and stem.lower() not in mat_files:
                rep.warn(f"pominiety (prawdopodobnie zrzut ekranu): {f}")
            else:
                rep.fail(f"brak wymaganego pliku: {f}")
        if not any(f.lower().startswith(("przeglądarka", "przegladarka")) for f in os.listdir(out)):
            rep.fail("brak przeglądarka.txt")
        pages = sorted(set(meta.get("pages", [])) | {f for f in os.listdir(out) if f.endswith((".php", ".html"))})
        pages = [p for p in pages if os.path.exists(os.path.join(out, p))]
        if not pages:
            rep.fail("brak stron .php/.html")
        tmpjs = os.path.join(d, ".jscheck")
        os.makedirs(tmpjs, exist_ok=True)
        for f in os.listdir(tmpjs):
            os.remove(os.path.join(tmpjs, f))
        check_static(out, pages, rep, tmpjs)
        check_css(out, rep)
        js_files = [os.path.join(out, f) for f in os.listdir(out) if f.endswith(".js")]
        js_files += [os.path.join(tmpjs, f) for f in os.listdir(tmpjs)]
        js_syntax(js_files, rep)

        os.makedirs(WORK, exist_ok=True)
        with open(os.path.join(WORK, ".db.lock"), "w") as lock:
            fcntl.flock(lock, fcntl.LOCK_EX)
            check_queries(meta, rep, d, out)
            check_server(meta, out, pages, rep, d)

    result = {"code": code, "pass": not rep.fails, "fails": rep.fails, "warns": rep.warns, **rep.info,
              "checked_at": time.strftime("%Y-%m-%d %H:%M:%S")}
    with open(os.path.join(d, "verify.json"), "w") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"{code} {'PASS' if result['pass'] else 'FAIL'} fails={len(rep.fails)} warns={len(rep.warns)}")
    if not quiet:
        for m in rep.fails:
            print("  FAIL", m)
        for m in rep.warns:
            print("  warn", m)
    sys.exit(0 if result["pass"] else 1)


if __name__ == "__main__":
    main()
