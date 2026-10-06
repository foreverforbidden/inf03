# Lista kryteriów strony: `site/data/<kod>/checks.json`

Lista kryteriów dla części „witryna” jednego arkusza (HTML, CSS, JS, grafika, pliki). Strona treningowa sprawdza nimi kod kursanta w przeglądarce (`site/js/webcheck.js`). Każde kryterium odpowiada jednemu punktowi z treści, jak na karcie oceny CKE.

Wzorcowe przykłady (sprawdzone, przejdź je w całości przed pisaniem):
- `site/data/inf03_2026_06_04/checks.json`: strona HTML + JavaScript, dwie podstrony, grafika, przyciski, zmiany stylu.
- `site/data/inf03_2025_06_06/checks.json`: strona PHP: część statyczna automatycznie, część PHP jako `php`.

## Źródła
- `site/data/<kod>/sheet.json` → pole `web`: `text` (treść części o witrynie), `files` (pliki do napisania), `entry` (strona główna), `graphics` (grafiki do obrobienia), `assets` (materiały), `illustrations` (strony PDF z ilustracjami: `site/data/<kod>/illustrations/*.jpg`; obejrzyj je, układ bloków jest na ilustracji).
- `work/<kod>/task.txt`: pełna treść arkusza.
- `site/data/<kod>/solution/`: rozwiązanie wzorcowe (to na nim walidator sprawdza, czy kryteria są spełnialne).

## Zasady
1. **Każdy punkt „−” z części o witrynie** (cechy grafiki, cechy witryny, zawartość bloków, style CSS, skrypt) ma co najmniej jedno kryterium. Punkty złożone rozbij („szerokość 45%, wysokość 640 px” = 2 kryteria). Pomijasz: operacje na bazie, zrzuty ekranu, `przeglądarka.txt`, nagrywanie płyty.
2. **`desc` cytuje treść** (krótko, polskie cudzysłowy „ ”). Nie wymyślasz wymagań, których nie ma w treści, i nie zaostrzasz ich.
3. **Selektory wynikają z treści, nie ze wzorca.** Używaj znaczników nazwanych w treści (header, nav, main, section, aside, footer, h1…h6, p, ul, ol, table, form, img, a) i kolejności (`section:nth-of-type(2)`). Identyfikatorów i klas używaj tylko, gdy treść je podaje. Jeśli treść nie mówi, jakim znacznikiem zrobić blok (np. „blok lewy”), a musisz go wskazać, użyj tego, co ma wzorzec, i dodaj pole `hint`, np. `"hint": "blok lewy jako section#lewy"`.
4. **Nie używaj selektorów atrybutów plików** (`img[src='x.png']`, `a[href='y']`). Plik obrazu lub odnośnika sprawdzasz typem `attr` z `"attr": "src"` / `"href"` i `"equals"`.
5. Teksty (`equals`) przepisuj dokładnie z treści. Gdy po tekście jest numer zdającego, użyj `startsWith`.
6. Treść generowana przez PHP (pętle, dane z bazy, obsługa formularza) to kryterium `{"type": "php"}` z opisem. Nie sprawdzasz jej automatycznie. **Style** elementów tworzonych przez PHP (np. bloki generowane skryptem) sprawdzaj jednak typem `cssRule` z selektorem z wzorca i polem `hint` (np. `"hint": "bloki tworzone skryptem: selektor main section"`), a nie `manual`; wartość jest porównywana po normalizacji przez przeglądarkę, więc kolejność zapisu nie ma znaczenia.
7. Coś, czego nie da się sprawdzić automatycznie (np. „znaczące nazewnictwo zmiennych”), to `{"type": "manual"}`. Używaj oszczędnie.
8. Wartości CSS jak w treści (kolory nazwami lub szesnastkowo, jednostki jak w treści).
9. **Nie zaostrzaj struktury.** Podział na bloki sprawdzaj jednym `exists` z polem `selectors` (lista, np. `["header", "nav", "main", "footer"]`; powtórzony selektor oznacza „co najmniej tyle”), a nie łańcuchem `header ~ nav ~ main`: kolejność i położenie pilnują kryteria `layout`. Nie zakładaj kontenera, którego treść nie podaje.
10. **Zdarzenia JS sprawdzaj działaniem, nie zapisem.** Nie sprawdzaj atrybutu `onclick` (dozwolone jest też `addEventListener`); wystarczą kryteria `js`. W krokach `js` nie używaj id ani klas, których treść nie podaje: użyj selektora ze struktury (`main form input:nth-of-type(2)`) albo dodaj `hint`.
11. **Przyciski**: treść „przycisk o treści X” dopuszcza `button` i `input[type=button|submit]`. Selektor: `button, input[type=button], input[type=submit]` (dla „czyść” także `input[type=reset]`); napis sprawdzaj typem `text` z tym selektorem i `equals` (dla `input` porównywane jest `value`).
12. **`cssRule` tylko gdy treść wymaga zapisu pod selektorem** („wyłącznie selektorem znacznika”, „dla selektora X”) albo dla elementów tworzonych przez PHP/JS. Gdy treść opisuje tylko efekt, a `css` nie daje się sprawdzić (np. `margin: auto`, właściwość na elemencie z wrapperem), użyj `cssRule` z `"matching": true`: przechodzi dowolna reguła, której selektor trafia w element. Wyśrodkowanie: `"prop": "margin-left", "value": "auto"` (przejdzie `margin: auto` i `margin: 0 auto`).
13. Kryterium `file` tylko dla plików nazwanych w treści. Nazwa pliku grafiki: gdy treść dopuszcza dowolny format, `attr` z `contains` (`"logo."`), nie `equals`.
14. Pierwsze kryterium `head` **każdej** strony (pole `page`) sprawdza DOCTYPE; `"doctype": false` tylko w kolejnych kryteriach `head` tej samej strony.
15. Cechy grafiki, której nie ma w `web.graphics` (np. animacja GIF, baner do narysowania): `manual` z opisem cech z treści.

## Pola wspólne
- `section`: `pliki` | `grafika` | `html` | `css` | `js` | `php`
- `desc`: cytat lub skrót punktu z treści
- `page` (opcjonalnie): plik strony, na której sprawdzać (domyślnie `web.entry`). Przy kilku stronach podawaj zawsze.
- `viewport` (opcjonalnie): szerokość okna w px, np. `600` dla reguł „do 800 px” (domyślnie 1280).
- `hint` (opcjonalnie): krótka wskazówka dla kursanta, gdy kryterium zakłada strukturę spoza treści.

## Typy
| typ | pola | znaczenie |
|---|---|---|
| `head` | `lang`, `charset: true`, `title`, `stylesheet`, `doctype: false` (pomija sprawdzenie DOCTYPE) | nagłówek dokumentu; pierwsze kryterium `head` zostaw z DOCTYPE, kolejne z `"doctype": false` |
| `exists` | `selector`, opcjonalnie `count` lub `min`; albo `selectors` (lista) | element istnieje / jest ich dokładnie N / co najmniej N; z `selectors`: każdy z bloków istnieje |
| `text` | `selector`, jedno z `equals`, `contains`, `startsWith`, `matches` (regex), opcjonalnie `index` | tekst elementu (białe znaki znormalizowane); bez `index` wystarczy dowolny pasujący element |
| `attr` | `selector`, `attr`, `equals` / `contains` / nic (sam atrybut) / `"absent": true`, opcjonalnie `index`, `all` | atrybut, np. `alt`, `src`, `href`, `method`, `disabled`, `checked`, `type` |
| `css` | `selector`, `prop`, `value`, opcjonalnie `index`, `all` | wartość obliczona; `%` przeliczane względem rodzica; kolory i długości normalizowane |
| `cssRule` | `selector`, `prop`, `value`, opcjonalnie `matching: true` | deklaracja zapisana dokładnie pod tym selektorem (dla „wyłącznie przy pomocy selektora znacznika”); z `matching` dowolna reguła trafiająca w element |
| `hover` | `selector`, `prop`, `value` | reguła `:hover` pasująca do elementu |
| `layout` | `a`, `b`, `relation`: `leftOf` / `rightOf` / `above` / `below` / `sameRow` / `fullWidth` (bez `b`) | położenie bloków jak na ilustracji układu |
| `js` | `steps`: lista `{"set": sel, "value": v}`, `{"click": sel}`, `{"hover": sel}`, `{"blur": sel}` (utrata fokusu), `{"wait": ms}`; `set` wywołuje też `input`, `change` i `keyup`; `expect`: lista oczekiwań | każde kryterium `js` uruchamia stronę od nowa |
| `file` | `name` | wymagany plik istnieje |
| `image` | `name`, `width` / `height` (px), `alpha: true` (przezroczystość) | grafika wgrana przez kursanta; tylko dla `web.graphics` |
| `php`, `manual` | tylko `desc` | wyświetlane, nie liczone automatycznie |

Oczekiwania w `js.expect`: `{"selector", "equals"|"contains"}` (tekst), `{"selector", "css": prop, "value"}`, `{"selector", "attr", "equals"|"contains"|"absent"}`, `{"selector", "count"}`, `{"alert": "tekst"}` (komunikat `alert`), `{"console": "tekst"}` (wypisane przez `console.log`).
Pole wyboru zaznaczasz krokiem `{"set": "#id", "value": true}`.

### CSS: praktyka
- Marginesy i dopełnienia: gdy treść podaje jedną wartość, `"prop": "margin", "value": "5px"`; gdy różne dla stron, sprawdzaj pojedyncze strony (`padding-top`, `margin-left`).
- Obramowanie: `"prop": "border-top", "value": "1px solid Gray"`; zaokrąglenie: `"prop": "border-top-left-radius"`.
- Krój czcionki sprawdzaj na elemencie tekstowym (np. `h2`), nie na `body`.
- „Dla wszystkich” bloków danego rodzaju: `"all": true`.
- Szerokości/wysokości w `%` i `px` jak w treści; walidator liczy je w kontekście rodzica.

### Układ bloków
Z ilustracji układu wypisz relacje, które go definiują: kto jest obok kogo (`leftOf`), co jest nad czym (`above`), że stopka jest pod blokami (`below`). 3 do 6 relacji zwykle wystarcza.

## Walidacja (obowiązkowa)
Serwer strony działa na `http://127.0.0.1:8765/` (gdyby nie działał: `cd site && python3 -m http.server 8765 &`).

```
NODE_PATH=$(npm root -g) node tools/checks_validate.mjs <kod>
```
Wymagania: rozwiązanie wzorcowe spełnia 100% kryteriów automatycznych, puste pliki najwyżej 15%, co najmniej 15 kryteriów automatycznych. Raport ląduje w `site/data/<kod>/checks_report.json`. Jeśli wzorzec nie spełnia kryterium, najpierw sprawdź, czy kryterium dobrze oddaje treść (selektor, wartość); kryterium zgodne z treścią, którego wzorzec nie spełnia, zgłoś w odpowiedzi zamiast je usuwać.
