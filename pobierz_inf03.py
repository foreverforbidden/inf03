#!/usr/bin/env python3
"""Pobiera wszystkie arkusze INF.03 z kursinf.pl (PDF + materialy) i pakuje do ZIP-a.

Uruchom: python pobierz_inf03.py
Nie wymaga zadnych dodatkowych bibliotek.
"""
import os
import re
import time
import zipfile
import urllib.request

BASE = "https://www.kursinf.pl"
LIST_URL = BASE + "/arkusze/inf03"
OUT_DIR = "inf03_arkusze"
ZIP_NAME = "inf03_arkusze.zip"
HEADERS = {"User-Agent": "Mozilla/5.0"}


def get(url):
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def main():
    os.makedirs(OUT_DIR, exist_ok=True)

    html = get(LIST_URL).decode("utf-8", "replace")
    ids = sorted(set(re.findall(r"/arkusze/inf03/arkusz/(\d+)", html)), key=int)
    print(f"Znaleziono arkuszy: {len(ids)}")

    saved = []
    for n, sheet_id in enumerate(ids, 1):
        page_url = f"{BASE}/arkusze/inf03/arkusz/{sheet_id}"
        try:
            page = get(page_url).decode("utf-8", "replace")
        except Exception as e:
            print(f"[{n}/{len(ids)}] BLAD strony {sheet_id}: {e}")
            continue

        m = re.search(r"inf0[23]_\d{4}_\d{2}_\d{2}", page)
        code = m.group(0) if m else f"arkusz_{sheet_id}"

        urls = re.findall(
            r"https://[a-z0-9]+\.supabase\.co/storage/v1/object/public/"
            r"kursinf_main/exam_sheets/[^\"'\s)<>\\]+",
            page,
        )
        urls = list(dict.fromkeys(urls))
        if not urls:
            print(f"[{n}/{len(ids)}] {code}: brak linkow do plikow")
            continue

        for url in urls:
            tail = url.rsplit("/", 1)[-1]
            kind = "arkusz" if "_sheet." in tail else "materialy" if "_files." in tail else "plik"
            ext = os.path.splitext(tail)[1] or ""
            name = f"{code}_{kind}{ext}"
            path = os.path.join(OUT_DIR, name)
            if not os.path.exists(path):
                try:
                    with open(path, "wb") as f:
                        f.write(get(url))
                except Exception as e:
                    print(f"   BLAD pobierania {name}: {e}")
                    continue
            saved.append(path)
            print(f"[{n}/{len(ids)}] {name}")
        time.sleep(0.3)

    with zipfile.ZipFile(ZIP_NAME, "w", zipfile.ZIP_DEFLATED) as z:
        for p in saved:
            z.write(p, os.path.basename(p))
    print(f"Gotowe: {ZIP_NAME} ({len(saved)} plikow)")


if __name__ == "__main__":
    main()
