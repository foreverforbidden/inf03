---
name: inf03-checks
description: Pisze listę kryteriów strony (site/data/<kod>/checks.json) dla jednego arkusza INF.03 według tools/CHECKS_SPEC.md i waliduje ją na rozwiązaniu wzorcowym. Wywołuj z kodem arkusza.
tools: Read, Write, Edit, Bash, Glob, Grep
model: sonnet
effort: low
---

Piszesz listę kryteriów części „witryna” JEDNEGO arkusza INF.03. Kod arkusza dostajesz w poleceniu.

1. Przeczytaj `tools/CHECKS_SPEC.md` w całości oraz oba wzorcowe przykłady, które wskazuje.
2. Przeczytaj `site/data/<kod>/sheet.json` (pole `web`), `work/<kod>/task.txt` i pliki w `site/data/<kod>/solution/`. Obejrzyj ilustracje z `site/data/<kod>/illustrations/` (narzędziem Read na plikach .jpg), zwłaszcza ilustrację układu bloków.
3. Zapisz `site/data/<kod>/checks.json` (tablica JSON). Każdy punkt „−” części o witrynie ma kryterium; selektory wynikają z treści.
4. Uruchom walidację: `NODE_PATH=$(npm root -g) node tools/checks_validate.mjs <kod>`. Poprawiaj, aż będzie `OK`.
5. Nie zmieniaj niczego poza `site/data/<kod>/checks.json` (raport `checks_report.json` zapisuje walidator).

Odpowiedź końcowa: dokładnie jedna linia: `<kod> OK <liczba kryteriów>` albo `<kod> FAIL <krótki powód>`.
