#!/usr/bin/env python3
"""Buduje STATUS.md z work/*/verify.json i work/*/review.json.

Uruchom: python3 tools/status.py   (wypisuje tez krotkie podsumowanie)
"""
import glob
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WORK = os.path.join(ROOT, "work")


def load(path):
    try:
        return json.load(open(path))
    except Exception:
        return None


def main():
    rows, counts = [], {"done": 0, "review_fail": 0, "verify_fail": 0, "todo": 0}
    for d in sorted(glob.glob(os.path.join(WORK, "*/meta.json"))):
        d = os.path.dirname(d)
        code = os.path.basename(d)
        v, r = load(os.path.join(d, "verify.json")), load(os.path.join(d, "review.json"))
        has_out = os.path.isdir(os.path.join(d, "wynik")) and os.listdir(os.path.join(d, "wynik"))
        attempts = open(os.path.join(d, ".attempts")).read().strip() if os.path.exists(os.path.join(d, ".attempts")) else "0"
        if not has_out or v is None:
            state = "todo"
        elif not v["pass"]:
            state = "verify_fail"
        elif r is None:
            state = "todo"
        elif r.get("pass"):
            state = "done"
        else:
            state = "review_fail"
        counts[state] += 1
        vtxt = "–" if v is None else ("PASS" if v["pass"] else f"FAIL ({len(v['fails'])})")
        rtxt = "–" if r is None else f"{'PASS' if r.get('pass') else 'FAIL'} {r.get('score', '')}"
        note = ""
        if r and r.get("fails"):
            note = "; ".join(f["item"][:50] for f in r["fails"][:2])
        elif v and v["fails"]:
            note = "; ".join(m[:60] for m in v["fails"][:2])
        if os.path.exists(os.path.join(d, "NOTES.md")):
            note = (note + " · NOTES.md").strip(" ·")
        rows.append(f"| {code} | {state} | {attempts} | {vtxt} | {rtxt} | {note.replace('|', '/')} |")
    with open(os.path.join(ROOT, "STATUS.md"), "w") as f:
        f.write("# Status arkuszy INF.03\n\n")
        f.write(" · ".join(f"**{k}**: {n}" for k, n in counts.items()) + f" · **razem**: {len(rows)}\n\n")
        f.write("| Arkusz | Stan | Próby | verify | review | Uwagi |\n|---|---|---|---|---|---|\n")
        f.write("\n".join(rows) + "\n")
    print(" ".join(f"{k}={n}" for k, n in counts.items()))


if __name__ == "__main__":
    main()
