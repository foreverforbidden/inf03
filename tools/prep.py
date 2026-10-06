#!/usr/bin/env python3
"""Przygotowuje work/<kod>/ dla kazdego arkusza: task.txt, materialy/, meta.json.

Uruchom: python3 tools/prep.py [kod ...]
"""
import json
import os
import re
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "inf03_arkusze")
WORK = os.path.join(ROOT, "work")

SCREENSHOTS = re.compile(r"^(import|kw\d+)\.(jpe?g|png)$", re.I)
FILE_RE = re.compile(r"[\w\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]+\.(?:php|html|css|js|txt|sql|jpe?g|png|gif|webp|svg)\b", re.I)


def pdf_text(pdf):
    return subprocess.run(["pdftotext", "-layout", pdf, "-"], capture_output=True, text=True).stdout


def extract(archive, dest, password):
    if os.path.isdir(dest):
        shutil.rmtree(dest)
    os.makedirs(dest)
    args = ["7zz", "x", "-y", f"-o{dest}", archive]
    args.insert(2, f"-p{password or ''}")
    r = subprocess.run(args, capture_output=True, text=True)
    # Spłaszcz pojedynczy katalog-opakowanie
    shutil.rmtree(os.path.join(dest, "__MACOSX"), ignore_errors=True)
    while True:
        entries = [e for e in os.listdir(dest) if not e.startswith(".")]
        if len(entries) != 1 or not os.path.isdir(os.path.join(dest, entries[0])):
            break
        tmp = dest + ".__flat"
        shutil.move(os.path.join(dest, entries[0]), tmp)
        for e in os.listdir(tmp):
            shutil.move(os.path.join(tmp, e), os.path.join(dest, e))
        os.rmdir(tmp)
    return r.returncode == 0, (r.stderr or r.stdout)[-500:]


def parse_meta(text):
    flat = re.sub(r"\s+", " ", text)
    meta = {}
    m = re.search(r"hasłem:?\s*(\S+)", flat)
    meta["password"] = m.group(1) if m else None
    m = re.search(r"baz[eęy] danych (?:o nazwie|nazwie)\s+([\w]+)", flat)
    meta["db"] = m.group(1) if m else None
    # Lista plików do oddania: zdanie "powinno/powinny znajdować się ... pliki:"
    m = re.search(r"powinn[oy](?: się)? znajdować(?: się)?(.*?)(?:Po nagraniu|Opisz płytę|$)", flat)
    files = []
    if m:
        files = [f for f in dict.fromkeys(FILE_RE.findall(m.group(1))) if not SCREENSHOTS.match(f)]
    meta["required_files"] = files
    m = re.search(r"powinn[oy](?: się)? znajdować(?: się)?\s+(\d+)\s+plik", flat)
    meta["image_count"] = int(m.group(1)) if m else None
    meta["pages"] = [f for f in files if f.lower().endswith((".php", ".html"))]
    return meta


def prep(code):
    pdf = os.path.join(SRC, f"{code}_arkusz.pdf")
    archives = [f for f in os.listdir(SRC) if f.startswith(f"{code}_materialy.")]
    d = os.path.join(WORK, code)
    os.makedirs(os.path.join(d, "wynik"), exist_ok=True)
    text = pdf_text(pdf)
    with open(os.path.join(d, "task.txt"), "w") as f:
        f.write(text)
    meta = parse_meta(text)
    meta["code"] = code
    meta["pdf"] = os.path.relpath(pdf, ROOT)
    problems = []
    if archives:
        ok, err = extract(os.path.join(SRC, archives[0]), os.path.join(d, "materialy"), meta["password"])
        if not ok:
            problems.append(f"rozpakowanie: {err.strip()}")
    else:
        problems.append("brak archiwum z materialami")
    mat = os.path.join(d, "materialy")
    sqls = []
    for dirpath, _, names in os.walk(mat):
        sqls += [os.path.relpath(os.path.join(dirpath, n), d) for n in names if n.lower().endswith(".sql")]
    meta["sql_files"] = sorted(sqls)
    if meta["db"] and not sqls:
        problems.append("baza w tresci, ale brak pliku .sql")
    if not meta["required_files"]:
        problems.append("nie znaleziono listy wymaganych plikow")
    meta["problems"] = problems
    with open(os.path.join(d, "meta.json"), "w") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    return meta


def main():
    codes = sys.argv[1:] or sorted(f[: -len("_arkusz.pdf")] for f in os.listdir(SRC) if f.endswith("_arkusz.pdf"))
    for code in codes:
        meta = prep(code)
        flag = "MANUAL " + "; ".join(meta["problems"]) if meta["problems"] else "ok"
        print(f"{code}: db={meta['db']} pages={meta['pages']} sql={len(meta['sql_files'])} {flag}")


if __name__ == "__main__":
    main()
