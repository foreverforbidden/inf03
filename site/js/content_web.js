// Lekcje HTML, CSS i JS z mikrocwiczeniami. Kryteria w formacie site/js/webcheck.js.
// Kazde cwiczenie: pliki startowe, kryteria (cytaty z arkuszy) i wzorcowe rozwiazanie (test: musi przejsc 100%).

const DOC = (title, body, extra = '') => `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <link rel="stylesheet" href="styl.css">${extra}
</head>
<body>
${body}
</body>
</html>
`;

const BIBLIO = 'data/inf03_2025_06_06/assets/';

export const WEB_MODULES = [
  { id: 'html', title: 'HTML', lessons: ['html-szkielet', 'html-tresc'] },
  { id: 'css', title: 'CSS', lessons: ['css-selektory', 'css-pudelko', 'css-uklad'] },
  { id: 'js', title: 'JavaScript', lessons: ['js-dom', 'js-logika', 'js-style'] },
];

export const WEB_LESSON_ORDER = WEB_MODULES.flatMap((m) => m.lessons);

export const WEB_LESSONS = {
  // ======================================================================= HTML
  'html-szkielet': {
    module: 'html',
    title: 'Szkielet strony i bloki',
    short: 'DOCTYPE, lang, charset, title, link do CSS, bloki semantyczne, nagłówki.',
    body: `
<p class="lead">Każdy arkusz zaczyna listę „Cechy witryny” tymi samymi punktami. To pewne punkty, jeśli zapamiętasz szkielet.</p>
<h2>Szkielet do zapamiętania</h2>
<pre>&lt;!DOCTYPE html&gt;
&lt;html lang="pl"&gt;
&lt;head&gt;
  &lt;meta charset="UTF-8"&gt;
  &lt;title&gt;Biblioteka miejska&lt;/title&gt;
  &lt;link rel="stylesheet" href="styl.css"&gt;
&lt;/head&gt;
&lt;body&gt;
  &lt;header&gt;…&lt;/header&gt;
  &lt;main&gt;…&lt;/main&gt;
  &lt;footer&gt;…&lt;/footer&gt;
&lt;/body&gt;
&lt;/html&gt;</pre>
<table class="dict">
  <tr><th>W treści</th><th>W kodzie</th></tr>
  <tr><td>„Zapisana w języku HTML5”</td><td>&lt;!DOCTYPE html&gt;</td></tr>
  <tr><td>„Zadeklarowany polski język zawartości witryny”</td><td>&lt;html lang="pl"&gt;</td></tr>
  <tr><td>„Jawnie zastosowany właściwy standard kodowania polskich znaków”</td><td>&lt;meta charset="UTF-8"&gt;</td></tr>
  <tr><td>„Tytuł strony widoczny na karcie przeglądarki: …”</td><td>&lt;title&gt;…&lt;/title&gt;</td></tr>
  <tr><td>„Arkusz stylów w pliku styl.css prawidłowo połączony z kodem strony”</td><td>&lt;link rel="stylesheet" href="styl.css"&gt;</td></tr>
</table>
<h2>Bloki semantyczne</h2>
<p>„Podział strony na bloki zrealizowany za pomocą znaczników sekcji (semantycznych) HTML5” oznacza:</p>
<table class="dict">
  <tr><th>Blok w treści</th><th>Znacznik</th></tr>
  <tr><td>blok nagłówkowy, baner</td><td>&lt;header&gt;</td></tr>
  <tr><td>blok nawigacyjny, menu</td><td>&lt;nav&gt;</td></tr>
  <tr><td>blok główny</td><td>&lt;main&gt;</td></tr>
  <tr><td>blok lewy / prawy / boczny</td><td>&lt;aside&gt; albo &lt;section&gt;</td></tr>
  <tr><td>sekcja, blok sekcji</td><td>&lt;section&gt;</td></tr>
  <tr><td>stopka</td><td>&lt;footer&gt;</td></tr>
</table>
<p>Gdy bloków tego samego rodzaju jest kilka (np. „blok lewy” i „blok prawy”), nadaj im <code>id</code>, żeby móc je osobno ostylować.</p>
<h2>Tekst</h2>
<table class="dict">
  <tr><th>W treści</th><th>W kodzie</th></tr>
  <tr><td>nagłówek pierwszego (drugiego…) stopnia</td><td>&lt;h1&gt; (&lt;h2&gt;…)</td></tr>
  <tr><td>paragraf, akapit</td><td>&lt;p&gt;</td></tr>
  <tr><td>tekst ważny, formatowany domyślnie jako pogrubiony</td><td>&lt;strong&gt;</td></tr>
  <tr><td>tekst wyróżniony (akcent), domyślnie pochylony</td><td>&lt;em&gt;</td></tr>
  <tr><td>pogrubienie / pochylenie / podkreślenie (bez znaczenia)</td><td>&lt;b&gt; / &lt;i&gt; / &lt;u&gt;</td></tr>
</table>
<div class="box trap"><ul>
  <li>Teksty przepisuj co do znaku: „Autor: ” ze spacją na końcu, polskie znaki, wielkie litery.</li>
  <li>Nazwa pliku CSS dokładnie jak w treści (<code>styl.css</code>, nie <code>style.css</code>).</li>
  <li>Cudzysłowy „ ” w treści oznaczają tekst do wpisania, nie znaki do przepisania.</li>
</ul></div>`,
    exercises: [
      {
        title: 'Szkielet HTML5',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>Napisz szkielet strony: HTML5, język polski, kodowanie UTF-8, tytuł strony „Biblioteka miejska”, arkusz stylów <code>styl.css</code> połączony ze stroną.</p>',
        entry: 'index.html',
        files: { 'index.html': '', 'styl.css': 'body { background-color: MistyRose; }\n' },
        checks: [
          { section: 'html', desc: 'Zapisana w języku HTML5, polski język, kodowanie UTF-8', type: 'head', lang: 'pl', charset: true },
          { section: 'html', desc: 'Tytuł strony „Biblioteka miejska”', type: 'head', doctype: false, title: 'Biblioteka miejska' },
          { section: 'html', desc: 'Arkusz stylów w pliku styl.css prawidłowo połączony z kodem strony', type: 'head', doctype: false, stylesheet: 'styl.css' },
          { section: 'css', desc: 'Styl działa (tło MistyRose)', type: 'css', selector: 'body', prop: 'background-color', value: 'MistyRose' },
        ],
        hint: 'Zacznij od <!DOCTYPE html>. Tytuł i link do CSS są w <head>.',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <p>Treść</p>'), 'styl.css': 'body { background-color: MistyRose; }\n' },
      },
      {
        title: 'Trzy bloki: nagłówek, główny, stopka',
        source: 'układ z wielu arkuszy',
        task: '<p>W <code>&lt;body&gt;</code> utwórz trzy bloki semantyczne jeden pod drugim: blok nagłówkowy, blok główny i stopkę. W bloku nagłówkowym nagłówek pierwszego stopnia „Wędkujemy”, w bloku głównym paragraf „Zapraszamy nad jezioro”, w stopce paragraf „Stronę wykonał: 00000000000”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Wędkowanie', '  <!-- tutaj bloki -->'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Blok nagłówkowy (header)', type: 'exists', selector: 'header' },
          { section: 'html', desc: 'Blok główny (main)', type: 'exists', selector: 'main' },
          { section: 'html', desc: 'Stopka (footer)', type: 'exists', selector: 'footer' },
          { section: 'html', desc: 'Nagłówek pierwszego stopnia „Wędkujemy” w bloku nagłówkowym', type: 'text', selector: 'header h1', equals: 'Wędkujemy' },
          { section: 'html', desc: 'Paragraf „Zapraszamy nad jezioro” w bloku głównym', type: 'text', selector: 'main p', equals: 'Zapraszamy nad jezioro' },
          { section: 'html', desc: 'Paragraf w stopce „Stronę wykonał: 00000000000”', type: 'text', selector: 'footer p', equals: 'Stronę wykonał: 00000000000' },
          { section: 'html', desc: 'Kolejność: nagłówek, główny, stopka', type: 'layout', a: 'header', b: 'main', relation: 'above' },
          { section: 'html', desc: 'Stopka pod blokiem głównym', type: 'layout', a: 'footer', b: 'main', relation: 'below' },
        ],
        hint: '<header>, <main>, <footer> w tej kolejności. Nagłówek pierwszego stopnia to <h1>.',
        solution: {
          'index.html': DOC('Wędkowanie', '  <header>\n    <h1>Wędkujemy</h1>\n  </header>\n  <main>\n    <p>Zapraszamy nad jezioro</p>\n  </main>\n  <footer>\n    <p>Stronę wykonał: 00000000000</p>\n  </footer>'),
          'styl.css': '',
        },
      },
      {
        title: 'Cztery sekcje z nagłówkami',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>W bloku głównym umieść cztery bloki sekcji. Każdy zaczyna się nagłówkiem drugiego stopnia, kolejno: „Liryka”, „Epika”, „Dramat”, „Zaległe książki”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <main>\n    <!-- sekcje -->\n  </main>'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Cztery bloki sekcji', type: 'exists', selector: 'main section', count: 4 },
          { section: 'html', desc: 'Sekcja 1: nagłówek drugiego stopnia „Liryka”', type: 'text', selector: 'main section h2', index: 0, equals: 'Liryka' },
          { section: 'html', desc: 'Sekcja 2: „Epika”', type: 'text', selector: 'main section h2', index: 1, equals: 'Epika' },
          { section: 'html', desc: 'Sekcja 3: „Dramat”', type: 'text', selector: 'main section h2', index: 2, equals: 'Dramat' },
          { section: 'html', desc: 'Sekcja 4: „Zaległe książki”', type: 'text', selector: 'main section h2', index: 3, equals: 'Zaległe książki' },
        ],
        hint: 'Cztery razy <section><h2>…</h2></section> wewnątrz <main>.',
        solution: {
          'index.html': DOC('Biblioteka miejska', '  <main>\n    <section><h2>Liryka</h2></section>\n    <section><h2>Epika</h2></section>\n    <section><h2>Dramat</h2></section>\n    <section><h2>Zaległe książki</h2></section>\n  </main>'),
          'styl.css': '',
        },
      },
      {
        title: 'Stopka z tekstem ważnym',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>„Zawartość stopki: paragraf o treści „Autor: ”, dalej wstawiony numer zdającego. Tekst w paragrafie jest zapisany za pomocą znacznika semantycznego oznaczającego tekst ważny, formatowany domyślnie jako pogrubiony”. Jako numer wpisz 00000000000.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <footer>\n  </footer>'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Paragraf w stopce', type: 'exists', selector: 'footer p' },
          { section: 'html', desc: 'Tekst ważny: znacznik <strong> w paragrafie', type: 'exists', selector: 'footer p strong' },
          { section: 'html', desc: 'Treść „Autor: 00000000000”', type: 'text', selector: 'footer p', equals: 'Autor: 00000000000' },
        ],
        hint: '„Tekst ważny” to <strong>, nie <b>.',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <footer>\n    <p><strong>Autor: 00000000000</strong></p>\n  </footer>'), 'styl.css': '' },
      },
      {
        title: 'Blok lewy i prawy',
        source: 'układ z wielu arkuszy',
        task: '<p>Pod blokiem nagłówkowym utwórz dwa bloki: lewy z <code>id="lewy"</code> i prawy z <code>id="prawy"</code> (użyj znaczników <code>section</code>). W bloku lewym nagłówek trzeciego stopnia „Menu”, w prawym nagłówek trzeciego stopnia „Oferta”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Restauracja', '  <header><h1>Restauracja Wszystkie Smaki</h1></header>\n  <!-- bloki lewy i prawy -->'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Blok lewy section#lewy', type: 'exists', selector: 'section#lewy' },
          { section: 'html', desc: 'Blok prawy section#prawy', type: 'exists', selector: 'section#prawy' },
          { section: 'html', desc: 'W bloku lewym nagłówek trzeciego stopnia „Menu”', type: 'text', selector: '#lewy h3', equals: 'Menu' },
          { section: 'html', desc: 'W bloku prawym nagłówek trzeciego stopnia „Oferta”', type: 'text', selector: '#prawy h3', equals: 'Oferta' },
        ],
        hint: '<section id="lewy">…</section>',
        solution: {
          'index.html': DOC('Restauracja', '  <header><h1>Restauracja Wszystkie Smaki</h1></header>\n  <section id="lewy"><h3>Menu</h3></section>\n  <section id="prawy"><h3>Oferta</h3></section>'),
          'styl.css': '',
        },
      },
    ],
  },

  'html-tresc': {
    module: 'html',
    title: 'Listy, tabele, obrazy, odnośniki, formularze',
    short: 'Elementy, z których składa się zawartość bloków.',
    body: `
<h2>Listy</h2>
<pre>&lt;ul&gt;                       &lt;!-- punktowana (nieuporządkowana) --&gt;
  &lt;li&gt;Kwiaty&lt;/li&gt;
&lt;/ul&gt;
&lt;ol&gt;                       &lt;!-- numerowana (uporządkowana) --&gt;
  &lt;li&gt;Pierwszy&lt;/li&gt;
&lt;/ol&gt;</pre>
<h2>Obraz</h2>
<pre>&lt;img src="obraz.png" alt="książki" title="Biblioteka"&gt;</pre>
<p><code>alt</code> to „tekst alternatywny”, <code>title</code> to „dymek” po najechaniu kursorem („podpowiedź”).</p>
<h2>Odnośniki</h2>
<pre>&lt;a href="kw1.png"&gt;kwerenda1&lt;/a&gt;
&lt;a href="https://www.cke.gov.pl" target="_blank"&gt;CKE&lt;/a&gt;   &lt;!-- w nowej karcie --&gt;
&lt;a href="mailto:biuro@firma.pl"&gt;Napisz do nas&lt;/a&gt;</pre>
<h2>Tabela</h2>
<pre>&lt;table&gt;
  &lt;tr&gt;&lt;th&gt;Nazwa&lt;/th&gt;&lt;th&gt;Cena&lt;/th&gt;&lt;/tr&gt;    &lt;!-- komórki nagłówkowe --&gt;
  &lt;tr&gt;&lt;td&gt;Kawa&lt;/td&gt;&lt;td&gt;8 zł&lt;/td&gt;&lt;/tr&gt;
&lt;/table&gt;</pre>
<h2>Formularz</h2>
<pre>&lt;form method="post" action="biblioteka.php"&gt;
  &lt;label for="imie"&gt;Imię:&lt;/label&gt; &lt;input type="text" id="imie" name="imie"&gt;
  &lt;select name="liryka"&gt;&lt;option value="1"&gt;Treny&lt;/option&gt;&lt;/select&gt;
  &lt;input type="submit" value="Rezerwuj"&gt;
&lt;/form&gt;</pre>
<table class="dict">
  <tr><th>W treści</th><th>W kodzie</th></tr>
  <tr><td>metodą bezpieczną / niejawną</td><td>method="post"</td></tr>
  <tr><td>do tego samego pliku</td><td>action="nazwa.php" (albo action pominięte)</td></tr>
  <tr><td>pole edycyjne / numeryczne / daty</td><td>input type="text" / "number" / "date"</td></tr>
  <tr><td>pole wyboru (zaznaczenia) / przełącznik</td><td>input type="checkbox" / "radio" (ta sama nazwa)</td></tr>
  <tr><td>lista rozwijana</td><td>select z option</td></tr>
  <tr><td>obszar tekstowy</td><td>textarea</td></tr>
  <tr><td>przycisk</td><td>button albo input type="submit"</td></tr>
</table>
<div class="box trap"><ul>
  <li>Lista punktowana to <code>ul</code>, numerowana to <code>ol</code>. Pomyłka to stracony punkt.</li>
  <li>Teksty <code>alt</code> i treść odnośników co do znaku.</li>
  <li>Przy <code>input</code> podpisy w <code>label</code>; przycisk z tekstem „Sprawdź” to <code>&lt;button&gt;Sprawdź&lt;/button&gt;</code>.</li>
</ul></div>`,
    exercises: [
      {
        title: 'Lista punktowana',
        source: 'wzór z wielu arkuszy',
        task: '<p>W bloku nawigacyjnym utwórz listę punktowaną z trzema elementami: „Strona główna”, „Galeria”, „Kontakt”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Galeria', '  <nav>\n  </nav>'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Lista punktowana (ul) w bloku nawigacyjnym', type: 'exists', selector: 'nav ul' },
          { section: 'html', desc: 'Trzy elementy listy', type: 'exists', selector: 'nav ul li', count: 3 },
          { section: 'html', desc: 'Element 1: „Strona główna”', type: 'text', selector: 'nav ul li', index: 0, equals: 'Strona główna' },
          { section: 'html', desc: 'Element 2: „Galeria”', type: 'text', selector: 'nav ul li', index: 1, equals: 'Galeria' },
          { section: 'html', desc: 'Element 3: „Kontakt”', type: 'text', selector: 'nav ul li', index: 2, equals: 'Kontakt' },
        ],
        hint: '<ul> z trzema <li>.',
        solution: { 'index.html': DOC('Galeria', '  <nav>\n    <ul>\n      <li>Strona główna</li>\n      <li>Galeria</li>\n      <li>Kontakt</li>\n    </ul>\n  </nav>'), 'styl.css': '' },
      },
      {
        title: 'Odnośniki do zrzutów',
        source: 'styczeń 2025, Zdobywcy',
        task: '<p>W bloku nawigacyjnym cztery odnośniki do plików <code>kw1.png</code>, <code>kw2.png</code>, <code>kw3.png</code>, <code>kw4.png</code> z treścią: „kwerenda1”, „kwerenda2”, „kwerenda3”, „kwerenda4”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Zdobywcy', '  <nav>\n  </nav>'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Cztery odnośniki w bloku nawigacyjnym', type: 'exists', selector: 'nav a', count: 4 },
          { section: 'html', desc: 'Odnośnik 1 do kw1.png', type: 'attr', selector: 'nav a', index: 0, attr: 'href', equals: 'kw1.png' },
          { section: 'html', desc: 'Odnośnik 4 do kw4.png', type: 'attr', selector: 'nav a', index: 3, attr: 'href', equals: 'kw4.png' },
          { section: 'html', desc: 'Treść odnośnika 1: „kwerenda1”', type: 'text', selector: 'nav a', index: 0, equals: 'kwerenda1' },
          { section: 'html', desc: 'Treść odnośnika 4: „kwerenda4”', type: 'text', selector: 'nav a', index: 3, equals: 'kwerenda4' },
        ],
        hint: '<a href="kw1.png">kwerenda1</a> i tak dalej.',
        solution: { 'index.html': DOC('Zdobywcy', '  <nav>\n    <a href="kw1.png">kwerenda1</a>\n    <a href="kw2.png">kwerenda2</a>\n    <a href="kw3.png">kwerenda3</a>\n    <a href="kw4.png">kwerenda4</a>\n  </nav>'), 'styl.css': '' },
      },
      {
        title: 'Obraz z tekstem alternatywnym',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>W bloku nagłówkowym wstaw obraz <code>obraz.jpg</code> z tekstem alternatywnym „książki” i podpowiedzią (dymkiem) „Biblioteka”.</p>',
        entry: 'index.html',
        assetsBase: BIBLIO,
        assets: ['obraz.jpg'],
        files: { 'index.html': DOC('Biblioteka miejska', '  <header>\n  </header>'), 'styl.css': 'img { height: 120px; }\n' },
        checks: [
          { section: 'html', desc: 'Obraz w bloku nagłówkowym', type: 'exists', selector: 'header img' },
          { section: 'html', desc: 'Źródło obraz.jpg', type: 'attr', selector: 'header img', attr: 'src', equals: 'obraz.jpg' },
          { section: 'html', desc: 'Tekst alternatywny „książki”', type: 'attr', selector: 'header img', attr: 'alt', equals: 'książki' },
          { section: 'html', desc: 'Dymek „Biblioteka”', type: 'attr', selector: 'header img', attr: 'title', equals: 'Biblioteka' },
        ],
        hint: 'Dymek to atrybut title.',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <header>\n    <img src="obraz.jpg" alt="książki" title="Biblioteka">\n  </header>'), 'styl.css': 'img { height: 120px; }\n' },
      },
      {
        title: 'Tabela cennika',
        source: 'wzór z wielu arkuszy',
        task: '<p>Utwórz tabelę: pierwszy wiersz to komórki nagłówkowe „Usługa” i „Cena”, dalej dwa wiersze: „Strzyżenie” / „40 zł” oraz „Farbowanie” / „120 zł”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Fryzjer', '  <main>\n  </main>'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Tabela', type: 'exists', selector: 'table' },
          { section: 'html', desc: 'Dwie komórki nagłówkowe (th)', type: 'exists', selector: 'table th', count: 2 },
          { section: 'html', desc: 'Nagłówek „Usługa”', type: 'text', selector: 'table th', index: 0, equals: 'Usługa' },
          { section: 'html', desc: 'Trzy wiersze', type: 'exists', selector: 'table tr', count: 3 },
          { section: 'html', desc: 'Komórka „Farbowanie”', type: 'text', selector: 'table td', contains: 'Farbowanie' },
          { section: 'html', desc: 'Komórka „120 zł”', type: 'text', selector: 'table td', equals: '120 zł' },
        ],
        hint: 'Komórki nagłówkowe to <th>, zwykłe to <td>, każdy wiersz w <tr>.',
        solution: { 'index.html': DOC('Fryzjer', '  <main>\n    <table>\n      <tr><th>Usługa</th><th>Cena</th></tr>\n      <tr><td>Strzyżenie</td><td>40 zł</td></tr>\n      <tr><td>Farbowanie</td><td>120 zł</td></tr>\n    </table>\n  </main>'), 'styl.css': '' },
      },
      {
        title: 'Formularz rezerwacji',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>„Formularz wysyłający dane metodą bezpieczną do tego samego pliku (biblioteka.php), z elementami: lista rozwijana (nazwa <code>liryka</code>) z opcjami „Treny” (wartość 20) i „Bogurodzica” (wartość 5), przycisk „Rezerwuj”.”</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <section>\n    <h2>Liryka</h2>\n  </section>'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Formularz', type: 'exists', selector: 'form' },
          { section: 'html', desc: 'Metoda bezpieczna (post)', type: 'attr', selector: 'form', attr: 'method', equals: 'post' },
          { section: 'html', desc: 'Wysyła do biblioteka.php', type: 'attr', selector: 'form', attr: 'action', equals: 'biblioteka.php' },
          { section: 'html', desc: 'Lista rozwijana o nazwie liryka', type: 'attr', selector: 'form select', attr: 'name', equals: 'liryka' },
          { section: 'html', desc: 'Opcja „Treny” z wartością 20', type: 'attr', selector: 'form select option', index: 0, attr: 'value', equals: '20' },
          { section: 'html', desc: 'Dwie opcje', type: 'exists', selector: 'form select option', count: 2 },
          { section: 'html', desc: 'Przycisk „Rezerwuj”', type: 'exists', selector: 'form input[type=submit][value="Rezerwuj"], form button' },
        ],
        hint: 'method="post", action="biblioteka.php", <select name="liryka"> z <option value="20">Treny</option>.',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <section>\n    <h2>Liryka</h2>\n    <form method="post" action="biblioteka.php">\n      <select name="liryka">\n        <option value="20">Treny</option>\n        <option value="5">Bogurodzica</option>\n      </select>\n      <input type="submit" value="Rezerwuj">\n    </form>\n  </section>'), 'styl.css': '' },
      },
      {
        title: 'Pola z etykietami',
        source: 'wzór z wielu arkuszy',
        task: '<p>Formularz z polami podpisanymi etykietami: „Imię:” (pole tekstowe, id <code>imie</code>), „Liczba osób:” (pole numeryczne, id <code>osoby</code>), pole wyboru „Śniadanie” (id <code>sniadanie</code>) oraz przycisk „Zarezerwuj”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Hotel', '  <form>\n  </form>'), 'styl.css': '' },
        checks: [
          { section: 'html', desc: 'Pole tekstowe imie', type: 'exists', selector: 'input#imie[type=text]' },
          { section: 'html', desc: 'Etykieta „Imię:” dla pola imie', type: 'text', selector: 'label[for=imie]', equals: 'Imię:' },
          { section: 'html', desc: 'Pole numeryczne osoby', type: 'exists', selector: 'input#osoby[type=number]' },
          { section: 'html', desc: 'Pole wyboru sniadanie', type: 'exists', selector: 'input#sniadanie[type=checkbox]' },
          { section: 'html', desc: 'Etykieta „Śniadanie”', type: 'text', selector: 'label[for=sniadanie]', equals: 'Śniadanie' },
          { section: 'html', desc: 'Przycisk „Zarezerwuj”', type: 'text', selector: 'button', equals: 'Zarezerwuj' },
        ],
        hint: '<label for="imie">Imię:</label> <input type="text" id="imie">',
        solution: { 'index.html': DOC('Hotel', '  <form>\n    <label for="imie">Imię:</label> <input type="text" id="imie"><br>\n    <label for="osoby">Liczba osób:</label> <input type="number" id="osoby"><br>\n    <input type="checkbox" id="sniadanie"> <label for="sniadanie">Śniadanie</label><br>\n    <button type="button">Zarezerwuj</button>\n  </form>'), 'styl.css': '' },
      },
    ],
  },

  // ======================================================================= CSS
  'css-selektory': {
    module: 'css',
    title: 'Selektory, kolory i tekst',
    short: 'Do czego przypiąć styl i jak zmienić wygląd tekstu.',
    body: `
<h2>Selektory</h2>
<table class="dict">
  <tr><th>W treści</th><th>W CSS</th></tr>
  <tr><td>„Domyślnie dla wszystkich selektorów”</td><td>* { … }</td></tr>
  <tr><td>„Dla selektora ciała strony”</td><td>body { … }</td></tr>
  <tr><td>„Dla nagłówka drugiego stopnia”</td><td>h2 { … }</td></tr>
  <tr><td>„Dla klasy o nazwie kontrolki”</td><td>.kontrolki { … }</td></tr>
  <tr><td>„Dla bloku nagłówkowego i stopki” (wspólne)</td><td>header, footer { … }</td></tr>
  <tr><td>„Dla obrazu w bloku bocznym”</td><td>aside img { … }</td></tr>
  <tr><td>„Gdy kursor znajdzie się na przycisku”</td><td>button:hover { … }</td></tr>
</table>
<div class="box trap"><p><strong>„Styl CSS … należy zdefiniować wyłącznie przy pomocy selektora tego znacznika”</strong>: wtedy piszesz <code>h2 { … }</code>, a nie <code>.naglowek { … }</code> czy <code>#lewy h2 { … }</code>. Taki punkt sprawdza sam selektor.</p></div>
<h2>Kolory</h2>
<p>Treści podają nazwy (<code>MistyRose</code>, <code>Plum</code>, <code>DimGray</code>, <code>SteelBlue</code>) albo zapis szesnastkowy (<code>#505050</code>). Wpisuj dokładnie to, co w treści.</p>
<pre>background-color: Plum;   /* kolor tła */
color: white;             /* kolor czcionki */</pre>
<h2>Czcionka i tekst</h2>
<table class="dict">
  <tr><th>W treści</th><th>W CSS</th></tr>
  <tr><td>krój czcionki Cambria</td><td>font-family: Cambria;</td></tr>
  <tr><td>rozmiar czcionki 150% / 20 px</td><td>font-size: 150%; / font-size: 20px;</td></tr>
  <tr><td>pogrubienie / pochylenie</td><td>font-weight: bold; / font-style: italic;</td></tr>
  <tr><td>wyrównanie tekstu do środka</td><td>text-align: center;</td></tr>
  <tr><td>wielkie litery</td><td>text-transform: uppercase;</td></tr>
  <tr><td>podkreślenie / bez podkreślenia</td><td>text-decoration: underline; / none;</td></tr>
  <tr><td>odstęp między literami 3 px</td><td>letter-spacing: 3px;</td></tr>
  <tr><td>wysokość linii</td><td>line-height: 1.5;</td></tr>
</table>`,
    exercises: [
      {
        title: 'Tło strony i czcionka dla wszystkich',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>„Domyślnie dla wszystkich selektorów: krój czcionki Cambria. Dla selektora ciała strony: kolor tła MistyRose.” Uwaga: styl ciała strony wyłącznie selektorem znacznika.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <h1>Biblioteka</h1>\n  <p>Zapraszamy</p>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Dla wszystkich: krój Cambria', type: 'css', selector: 'p', prop: 'font-family', value: 'Cambria' },
          { section: 'css', desc: 'Nagłówek też w kroju Cambria', type: 'css', selector: 'h1', prop: 'font-family', value: 'Cambria' },
          { section: 'css', desc: 'Selektor ciała strony (body): tło MistyRose', type: 'cssRule', selector: 'body', prop: 'background-color', value: 'MistyRose' },
        ],
        hint: '* { font-family: Cambria; } body { background-color: MistyRose; }',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <h1>Biblioteka</h1>\n  <p>Zapraszamy</p>'), 'styl.css': '* {\n  font-family: Cambria;\n}\nbody {\n  background-color: MistyRose;\n}\n' },
      },
      {
        title: 'Nagłówek tylko selektorem znacznika',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>„Dla selektora nagłówka drugiego stopnia: wyrównanie tekstu do środka.” Styl nagłówka drugiego stopnia zdefiniuj wyłącznie selektorem tego znacznika.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <section>\n    <h2 class="tytul">Liryka</h2>\n  </section>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'h2: wyrównanie do środka', type: 'css', selector: 'h2', prop: 'text-align', value: 'center' },
          { section: 'css', desc: 'Zdefiniowane selektorem znacznika h2', type: 'cssRule', selector: 'h2', prop: 'text-align', value: 'center' },
        ],
        hint: 'h2 { text-align: center; } (nie .tytul)',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <section>\n    <h2 class="tytul">Liryka</h2>\n  </section>'), 'styl.css': 'h2 {\n  text-align: center;\n}\n' },
      },
      {
        title: 'Wspólne style nagłówka i stopki',
        source: 'styczeń 2025, Kalendarz',
        task: '<p>„Wspólne dla bloku nagłówkowego i stopki: kolor tła Indigo, biały kolor czcionki.” Dodatkowo stopka: rozmiar czcionki 80%.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Kalendarz', '  <header><h1>Kalendarz</h1></header>\n  <footer><p>Autor: 00000000000</p></footer>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Nagłówek: tło Indigo', type: 'css', selector: 'header', prop: 'background-color', value: 'Indigo' },
          { section: 'css', desc: 'Stopka: tło Indigo', type: 'css', selector: 'footer', prop: 'background-color', value: 'Indigo' },
          { section: 'css', desc: 'Nagłówek: biała czcionka', type: 'css', selector: 'header h1', prop: 'color', value: 'white' },
          { section: 'css', desc: 'Stopka: biała czcionka', type: 'css', selector: 'footer p', prop: 'color', value: 'white' },
          { section: 'css', desc: 'Stopka: czcionka 80%', type: 'cssRule', selector: 'footer', prop: 'font-size', value: '80%' },
        ],
        hint: 'header, footer { … } a potem osobno footer { font-size: 80%; }',
        solution: { 'index.html': DOC('Kalendarz', '  <header><h1>Kalendarz</h1></header>\n  <footer><p>Autor: 00000000000</p></footer>'), 'styl.css': 'header, footer {\n  background-color: Indigo;\n  color: white;\n}\nfooter {\n  font-size: 80%;\n}\n' },
      },
      {
        title: 'Klasa i identyfikator',
        source: 'wzór z wielu arkuszy',
        task: '<p>Dla klasy <code>cena</code>: kolor czcionki DarkRed, pogrubienie. Dla elementu o id <code>promocja</code>: pochylenie czcionki, wielkie litery, odstęp między literami 3 px.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Sklep', '  <p id="promocja">Promocja tygodnia</p>\n  <p>Kawa <span class="cena">8 zł</span></p>\n  <p>Herbata <span class="cena">6 zł</span></p>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: '.cena: kolor DarkRed', type: 'css', selector: '.cena', all: true, prop: 'color', value: 'DarkRed' },
          { section: 'css', desc: '.cena: pogrubienie', type: 'css', selector: '.cena', prop: 'font-weight', value: 'bold' },
          { section: 'css', desc: '#promocja: pochylenie', type: 'css', selector: '#promocja', prop: 'font-style', value: 'italic' },
          { section: 'css', desc: '#promocja: wielkie litery', type: 'css', selector: '#promocja', prop: 'text-transform', value: 'uppercase' },
          { section: 'css', desc: '#promocja: odstęp między literami 3 px', type: 'css', selector: '#promocja', prop: 'letter-spacing', value: '3px' },
        ],
        hint: 'Klasa: kropka (.cena), identyfikator: krzyżyk (#promocja).',
        solution: { 'index.html': DOC('Sklep', '  <p id="promocja">Promocja tygodnia</p>\n  <p>Kawa <span class="cena">8 zł</span></p>\n  <p>Herbata <span class="cena">6 zł</span></p>'), 'styl.css': '.cena {\n  color: DarkRed;\n  font-weight: bold;\n}\n#promocja {\n  font-style: italic;\n  text-transform: uppercase;\n  letter-spacing: 3px;\n}\n' },
      },
      {
        title: 'Przycisk po najechaniu kursorem',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>„Gdy kursor znajdzie się na dowolnym przycisku jego kolor tła zmienia się na #505050 a kolor czcionki na biały.”</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <button>Rezerwuj</button>\n  <input type="submit" value="Wyślij">'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Przycisk po najechaniu: tło #505050', type: 'hover', selector: 'button', prop: 'background-color', value: '#505050' },
          { section: 'css', desc: 'Przycisk po najechaniu: biała czcionka', type: 'hover', selector: 'button', prop: 'color', value: 'white' },
        ],
        hint: 'button:hover { background-color: #505050; color: white; }',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <button>Rezerwuj</button>\n  <input type="submit" value="Wyślij">'), 'styl.css': 'button:hover, input[type=submit]:hover {\n  background-color: #505050;\n  color: white;\n}\n' },
      },
    ],
  },

  'css-pudelko': {
    module: 'css',
    title: 'Model pudełkowy: rozmiar, marginesy, ramki',
    short: 'width, height, margin, padding, border, radius, shadow, overflow, display.',
    body: `
<h2>Model pudełkowy</h2>
<p>Każdy blok to pudełko: treść (<code>width</code>, <code>height</code>), wokół niej margines wewnętrzny (<code>padding</code>), ramka (<code>border</code>) i margines zewnętrzny (<code>margin</code>).</p>
<table class="dict">
  <tr><th>W treści</th><th>W CSS</th></tr>
  <tr><td>szerokość 22%, wysokość 400 px</td><td>width: 22%; height: 400px;</td></tr>
  <tr><td>marginesy zewnętrzne 5 px</td><td>margin: 5px;</td></tr>
  <tr><td>marginesy wewnętrzne 15 px 40 px</td><td>padding: 15px 40px;  /* góra/dół, lewo/prawo */</td></tr>
  <tr><td>jedynie margines zewnętrzny lewy 10%</td><td>margin-left: 10%;</td></tr>
  <tr><td>obramowanie 1 px linią ciągłą koloru Black</td><td>border: 1px solid Black;</td></tr>
  <tr><td>zaokrąglenie narożników 20 px</td><td>border-radius: 20px;</td></tr>
  <tr><td>cień przesunięty o 4 px w obu osiach, rozmycie 10 px, kolor DimGray</td><td>box-shadow: 4px 4px 10px DimGray;</td></tr>
  <tr><td>w przypadku przepełnienia zawartość jest ukrywana</td><td>overflow: hidden;</td></tr>
  <tr><td>wyświetlany w sposób blokowy / usunięty</td><td>display: block; / display: none;</td></tr>
  <tr><td>punktor kwadrat / bez punktora</td><td>list-style-type: square; / none;</td></tr>
</table>
<div class="box"><p><strong>Skróty marginesów:</strong> jedna wartość = wszystkie strony; dwie = góra/dół i lewo/prawo; cztery = góra, prawo, dół, lewo (zgodnie z ruchem wskazówek zegara).</p></div>
<div class="box trap"><p>„jedynie margines zewnętrzny lewy” znaczy: tylko <code>margin-left</code>. Gdy dopiszesz <code>margin: …</code>, zmienisz też pozostałe.</p></div>`,
    exercises: [
      {
        title: 'Bloki sekcji z cieniem',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>„Dla bloków sekcji: kolor tła Plum, wysokość 400 px, marginesy zewnętrzne 5 px, cień bloku o przesunięciu 4 px w obu osiach, rozmyciu 10 px i kolorze DimGray, w przypadku przepełnienia bloku zawartość poza blokiem jest ukrywana.”</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <section><h2>Liryka</h2></section>\n  <section><h2>Epika</h2></section>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Tło Plum', type: 'css', selector: 'section', all: true, prop: 'background-color', value: 'Plum' },
          { section: 'css', desc: 'Wysokość 400 px', type: 'css', selector: 'section', prop: 'height', value: '400px' },
          { section: 'css', desc: 'Marginesy zewnętrzne 5 px', type: 'css', selector: 'section', prop: 'margin', value: '5px' },
          { section: 'css', desc: 'Cień 4 px 4 px 10 px DimGray', type: 'css', selector: 'section', prop: 'box-shadow', value: '4px 4px 10px DimGray' },
          { section: 'css', desc: 'Przepełnienie ukrywane', type: 'css', selector: 'section', prop: 'overflow', value: 'hidden' },
        ],
        hint: 'section { background-color: Plum; height: 400px; margin: 5px; box-shadow: 4px 4px 10px DimGray; overflow: hidden; }',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <section><h2>Liryka</h2></section>\n  <section><h2>Epika</h2></section>'), 'styl.css': 'section {\n  background-color: Plum;\n  height: 400px;\n  margin: 5px;\n  box-shadow: 4px 4px 10px DimGray;\n  overflow: hidden;\n}\n' },
      },
      {
        title: 'Przycisk: marginesy wewnętrzne i zewnętrzne',
        source: 'czerwiec 2026, Wycieczki',
        task: '<p>„Dla przycisku: kolor tła SkyBlue, szerokość 45%, zaokrąglenie narożników 15 px, marginesy wewnętrzne 15 px 40 px, marginesy zewnętrzne 3 px 2%.”</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Wycieczki', '  <nav>\n    <button>Uczestnik</button><button>Rezerwacja</button>\n  </nav>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Tło SkyBlue', type: 'css', selector: 'button', prop: 'background-color', value: 'SkyBlue' },
          { section: 'css', desc: 'Szerokość 45%', type: 'css', selector: 'button', prop: 'width', value: '45%' },
          { section: 'css', desc: 'Zaokrąglenie 15 px', type: 'css', selector: 'button', prop: 'border-top-left-radius', value: '15px' },
          { section: 'css', desc: 'Marginesy wewnętrzne: góra 15 px', type: 'css', selector: 'button', prop: 'padding-top', value: '15px' },
          { section: 'css', desc: 'Marginesy wewnętrzne: lewy 40 px', type: 'css', selector: 'button', prop: 'padding-left', value: '40px' },
          { section: 'css', desc: 'Marginesy zewnętrzne: góra 3 px', type: 'css', selector: 'button', prop: 'margin-top', value: '3px' },
          { section: 'css', desc: 'Marginesy zewnętrzne: lewy 2%', type: 'css', selector: 'button', prop: 'margin-left', value: '2%' },
        ],
        hint: 'padding: 15px 40px; margin: 3px 2%; (dwie wartości: góra/dół, lewo/prawo)',
        solution: { 'index.html': DOC('Wycieczki', '  <nav>\n    <button>Uczestnik</button><button>Rezerwacja</button>\n  </nav>'), 'styl.css': 'button {\n  background-color: SkyBlue;\n  width: 45%;\n  border-radius: 15px;\n  padding: 15px 40px;\n  margin: 3px 2%;\n}\n' },
      },
      {
        title: 'Obraz w ramce',
        source: 'wzór z wielu arkuszy',
        task: '<p>Dla obrazu: szerokość 200 px, obramowanie 2 px linią ciągłą koloru SteelBlue, zaokrąglenie narożników 50%, marginesy zewnętrzne 10 px.</p>',
        entry: 'index.html',
        assetsBase: BIBLIO,
        assets: ['obraz.jpg'],
        files: { 'index.html': DOC('Galeria', '  <img src="obraz.jpg" alt="książki">'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Szerokość 200 px', type: 'css', selector: 'img', prop: 'width', value: '200px' },
          { section: 'css', desc: 'Obramowanie 2 px ciągłe SteelBlue', type: 'css', selector: 'img', prop: 'border-top', value: '2px solid SteelBlue' },
          { section: 'css', desc: 'Zaokrąglenie 50%', type: 'cssRule', selector: 'img', prop: 'border-radius', value: '50%' },
          { section: 'css', desc: 'Marginesy 10 px', type: 'css', selector: 'img', prop: 'margin', value: '10px' },
        ],
        hint: 'border: 2px solid SteelBlue;',
        solution: { 'index.html': DOC('Galeria', '  <img src="obraz.jpg" alt="książki">'), 'styl.css': 'img {\n  width: 200px;\n  border: 2px solid SteelBlue;\n  border-radius: 50%;\n  margin: 10px;\n}\n' },
      },
      {
        title: 'Tabela z ramkami',
        source: 'wzór z wielu arkuszy',
        task: '<p>„Dla tabeli: szerokość 100%, obramowanie zwinięte (pojedyncze). Wspólne dla komórek: obramowanie 1 px linią ciągłą koloru Gray, marginesy wewnętrzne 5 px.”</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Cennik', '  <table>\n    <tr><th>Usługa</th><th>Cena</th></tr>\n    <tr><td>Strzyżenie</td><td>40 zł</td></tr>\n  </table>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Tabela 100%', type: 'css', selector: 'table', prop: 'width', value: '100%' },
          { section: 'css', desc: 'Obramowanie zwinięte', type: 'css', selector: 'table', prop: 'border-collapse', value: 'collapse' },
          { section: 'css', desc: 'Komórki td: ramka 1 px Gray', type: 'css', selector: 'td', prop: 'border-top', value: '1px solid Gray' },
          { section: 'css', desc: 'Komórki th: ramka 1 px Gray', type: 'css', selector: 'th', prop: 'border-top', value: '1px solid Gray' },
          { section: 'css', desc: 'Komórki: marginesy wewnętrzne 5 px', type: 'css', selector: 'td', prop: 'padding', value: '5px' },
        ],
        hint: 'table { width: 100%; border-collapse: collapse; } td, th { border: 1px solid Gray; padding: 5px; }',
        solution: { 'index.html': DOC('Cennik', '  <table>\n    <tr><th>Usługa</th><th>Cena</th></tr>\n    <tr><td>Strzyżenie</td><td>40 zł</td></tr>\n  </table>'), 'styl.css': 'table {\n  width: 100%;\n  border-collapse: collapse;\n}\ntd, th {\n  border: 1px solid Gray;\n  padding: 5px;\n}\n' },
      },
      {
        title: 'Jedynie margines lewy i ukrywanie bloków',
        source: 'styczeń 2026, Paznokcie',
        task: '<p>„Dla trzech bloków sekcji: kolor tła Salmon, jedynie margines zewnętrzny lewy 10%. Dodatkowo blok sekcji 1 jest wyświetlany w sposób blokowy, natomiast bloki sekcji 2 i 3 są usunięte.”</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Paznokcie', '  <main>\n    <section id="sekcja1">Kolor</section>\n    <section id="sekcja2">Kształt</section>\n    <section id="sekcja3">Wzór</section>\n  </main>'), 'styl.css': '' },
        checks: [
          { section: 'css', desc: 'Sekcje: tło Salmon', type: 'css', selector: '#sekcja1', prop: 'background-color', value: 'Salmon' },
          { section: 'css', desc: 'Sekcje: margines lewy 10%', type: 'css', selector: '#sekcja1', prop: 'margin-left', value: '10%' },
          { section: 'css', desc: 'Jedynie lewy: margines górny 0', type: 'css', selector: '#sekcja1', prop: 'margin-top', value: '0px' },
          { section: 'css', desc: 'Sekcja 1 wyświetlana blokowo', type: 'css', selector: '#sekcja1', prop: 'display', value: 'block' },
          { section: 'css', desc: 'Sekcja 2 usunięta', type: 'css', selector: '#sekcja2', prop: 'display', value: 'none' },
          { section: 'css', desc: 'Sekcja 3 usunięta', type: 'css', selector: '#sekcja3', prop: 'display', value: 'none' },
        ],
        hint: '#sekcja2, #sekcja3 { display: none; }',
        solution: { 'index.html': DOC('Paznokcie', '  <main>\n    <section id="sekcja1">Kolor</section>\n    <section id="sekcja2">Kształt</section>\n    <section id="sekcja3">Wzór</section>\n  </main>'), 'styl.css': '#sekcja1, #sekcja2, #sekcja3 {\n  background-color: Salmon;\n  margin-left: 10%;\n}\n#sekcja1 {\n  display: block;\n}\n#sekcja2, #sekcja3 {\n  display: none;\n}\n' },
      },
    ],
  },

  'css-uklad': {
    module: 'css',
    title: 'Układ bloków: float, procenty, @media',
    short: 'Najczęściej oblewany punkt: bloki obok siebie zgodnie z ilustracją.',
    body: `
<p class="lead">„Układ bloków zgodny z ilustracją” to punkt, który recenzenci najczęściej odrzucali. Ilustracja pokazuje prostokąty; Ty ustawiasz je obok siebie przez <code>float</code> i szerokości w procentach.</p>
<h2>Dwie kolumny</h2>
<pre>header { height: 100px; }
aside  { float: left; width: 30%; }
main   { float: left; width: 70%; }
footer { clear: both; }          /* stopka pod obiema kolumnami */</pre>
<div class="box"><p><strong>Zasada sumy:</strong> szerokości bloków w jednym rzędzie (razem z marginesami, paddingiem i ramkami) muszą dać najwyżej 100%. Jeśli treść każe dodać padding, dopisz <code>box-sizing: border-box;</code> albo zmniejsz szerokości.</p></div>
<h2>Dwa bloki jeden pod drugim po lewej</h2>
<p>Gdy ilustracja ma po lewej dwa bloki jeden pod drugim, a po prawej jeden wysoki, opakuj lewe bloki w jeden kontener:</p>
<pre>&lt;div id="lewa"&gt;
  &lt;section id="lewy1"&gt;…&lt;/section&gt;
  &lt;section id="lewy2"&gt;…&lt;/section&gt;
&lt;/div&gt;
&lt;section id="prawy"&gt;…&lt;/section&gt;

#lewa  { float: left; width: 30%; }
#prawy { float: left; width: 70%; }</pre>
<h2>Ekrany różnej szerokości</h2>
<p>„W przypadku ekranów o szerokości do 800 px szerokość bloków sekcji 100%, powyżej 800 px 22%”:</p>
<pre>section { float: left; width: 22%; }
@media (max-width: 800px) {
  section { width: 100%; }
}</pre>
<div class="box trap"><ul>
  <li>Brak <code>clear: both</code> na stopce: stopka wjeżdża pod pływające bloki.</li>
  <li>Kolejność w HTML ma znaczenie: blok, który ma być wyżej po prawej, musi być w kodzie przed blokami pod nim.</li>
  <li>Marginesy w pikselach przy szerokościach w procentach przepełniają rząd (22% × 4 + 4 × 10 px &gt; 100%).</li>
</ul></div>`,
    exercises: [
      {
        title: 'Blok boczny i główny',
        source: 'styczeń 2026, Paznokcie',
        task: '<p>„Dla bloku bocznego: szerokość 20%. Dla bloku głównego: szerokość 80%.” Bloki stoją obok siebie (boczny po lewej), stopka pod nimi na całą szerokość.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Paznokcie', '  <aside>Blok boczny</aside>\n  <main>Blok główny</main>\n  <footer>Autor strony: 00000000000</footer>'), 'styl.css': 'aside { background-color: Wheat; height: 200px; }\nmain { background-color: Salmon; height: 150px; }\n' },
        checks: [
          { section: 'css', desc: 'Blok boczny 20%', type: 'css', selector: 'aside', prop: 'width', value: '20%' },
          { section: 'css', desc: 'Blok główny 80%', type: 'css', selector: 'main', prop: 'width', value: '80%' },
          { section: 'css', desc: 'Boczny po lewej stronie głównego', type: 'layout', a: 'aside', b: 'main', relation: 'leftOf' },
          { section: 'css', desc: 'Stopka pod blokiem bocznym', type: 'layout', a: 'footer', b: 'aside', relation: 'below' },
          { section: 'css', desc: 'Stopka na całą szerokość', type: 'layout', a: 'footer', relation: 'fullWidth' },
        ],
        hint: 'float: left na obu blokach i clear: both na stopce.',
        solution: { 'index.html': DOC('Paznokcie', '  <aside>Blok boczny</aside>\n  <main>Blok główny</main>\n  <footer>Autor strony: 00000000000</footer>'), 'styl.css': 'aside { background-color: Wheat; height: 200px; float: left; width: 20%; }\nmain { background-color: Salmon; height: 150px; float: left; width: 80%; }\nfooter { clear: both; }\n' },
      },
      {
        title: 'Trzy kolumny',
        source: 'wzór z wielu arkuszy',
        task: '<p>Bloki lewy (25%), środkowy (50%) i prawy (25%) obok siebie, w tej kolejności, pod banerem. Stopka pod nimi.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Kino', '  <header>Baner</header>\n  <section id="lewy">Lewy</section>\n  <section id="srodkowy">Środkowy</section>\n  <section id="prawy">Prawy</section>\n  <footer>Stopka</footer>'), 'styl.css': 'section { height: 200px; }\n#lewy, #prawy { background-color: LightBlue; }\n#srodkowy { background-color: White; }\n' },
        checks: [
          { section: 'css', desc: 'Lewy 25%', type: 'css', selector: '#lewy', prop: 'width', value: '25%' },
          { section: 'css', desc: 'Środkowy 50%', type: 'css', selector: '#srodkowy', prop: 'width', value: '50%' },
          { section: 'css', desc: 'Prawy 25%', type: 'css', selector: '#prawy', prop: 'width', value: '25%' },
          { section: 'css', desc: 'Lewy obok środkowego', type: 'layout', a: '#lewy', b: '#srodkowy', relation: 'leftOf' },
          { section: 'css', desc: 'Środkowy obok prawego', type: 'layout', a: '#srodkowy', b: '#prawy', relation: 'leftOf' },
          { section: 'css', desc: 'Stopka pod kolumnami', type: 'layout', a: 'footer', b: '#srodkowy', relation: 'below' },
        ],
        hint: 'section { float: left; } i szerokości dla id.',
        solution: { 'index.html': DOC('Kino', '  <header>Baner</header>\n  <section id="lewy">Lewy</section>\n  <section id="srodkowy">Środkowy</section>\n  <section id="prawy">Prawy</section>\n  <footer>Stopka</footer>'), 'styl.css': 'section { height: 200px; float: left; }\n#lewy, #prawy { background-color: LightBlue; width: 25%; }\n#srodkowy { background-color: White; width: 50%; }\nfooter { clear: both; }\n' },
      },
      {
        title: 'Dwa bloki po lewej, jeden po prawej',
        source: 'styczeń 2025, Województwa',
        task: '<p>Po lewej dwa bloki jeden pod drugim (<code>#lewy1</code>, <code>#lewy2</code>, razem kolumna 30%), po prawej blok <code>#prawy</code> (70%) obok nich. Możesz zmieniać HTML.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Województwa', '  <section id="lewy1">Lewy górny</section>\n  <section id="lewy2">Lewy dolny</section>\n  <section id="prawy">Prawy</section>'), 'styl.css': '#lewy1 { background-color: LightGreen; height: 120px; }\n#lewy2 { background-color: PaleGreen; height: 120px; }\n#prawy { background-color: Honeydew; height: 240px; }\n' },
        checks: [
          { section: 'css', desc: 'Lewy górny nad lewym dolnym', type: 'layout', a: '#lewy1', b: '#lewy2', relation: 'above' },
          { section: 'css', desc: 'Lewy górny obok prawego', type: 'layout', a: '#lewy1', b: '#prawy', relation: 'leftOf' },
          { section: 'css', desc: 'Lewy dolny obok prawego', type: 'layout', a: '#lewy2', b: '#prawy', relation: 'leftOf' },
          { section: 'css', desc: 'Prawy blok 70% szerokości', type: 'css', selector: '#prawy', prop: 'width', value: '70%' },
        ],
        hint: 'Opakuj #lewy1 i #lewy2 w <div id="lewa"> z float: left; width: 30%.',
        solution: { 'index.html': DOC('Województwa', '  <div id="lewa">\n    <section id="lewy1">Lewy górny</section>\n    <section id="lewy2">Lewy dolny</section>\n  </div>\n  <section id="prawy">Prawy</section>'), 'styl.css': '#lewy1 { background-color: LightGreen; height: 120px; }\n#lewy2 { background-color: PaleGreen; height: 120px; }\n#prawy { background-color: Honeydew; height: 240px; float: left; width: 70%; }\n#lewa { float: left; width: 30%; }\n' },
      },
      {
        title: 'Cztery sekcje i wąski ekran',
        source: 'czerwiec 2025, Biblioteka miejska',
        task: '<p>„W przypadku ekranów o szerokości do 800 px szerokość bloków sekcji 100%, powyżej 800 px szerokość bloków sekcji 22%.” Na szerokim ekranie cztery sekcje stoją w jednym rzędzie (mają marginesy 5 px).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Biblioteka miejska', '  <section>Liryka</section>\n  <section>Epika</section>\n  <section>Dramat</section>\n  <section>Zaległe</section>'), 'styl.css': 'section {\n  background-color: Plum;\n  height: 200px;\n  margin: 5px;\n}\n' },
        checks: [
          { section: 'css', desc: 'Powyżej 800 px: szerokość 22%', type: 'css', selector: 'section', prop: 'width', value: '22%' },
          { section: 'css', desc: 'Powyżej 800 px: sekcje 1 i 4 w jednym rzędzie', type: 'layout', a: 'section:nth-of-type(1)', b: 'section:nth-of-type(4)', relation: 'sameRow' },
          { section: 'css', desc: 'Do 800 px: szerokość 100%', type: 'css', viewport: 600, selector: 'section', prop: 'width', value: '100%' },
          { section: 'css', desc: 'Do 800 px: sekcje jedna pod drugą', type: 'layout', viewport: 600, a: 'section:nth-of-type(1)', b: 'section:nth-of-type(2)', relation: 'above' },
        ],
        hint: 'section { float: left; width: 22%; } @media (max-width: 800px) { section { width: 100%; } }',
        solution: { 'index.html': DOC('Biblioteka miejska', '  <section>Liryka</section>\n  <section>Epika</section>\n  <section>Dramat</section>\n  <section>Zaległe</section>'), 'styl.css': 'section {\n  background-color: Plum;\n  height: 200px;\n  margin: 5px;\n  float: left;\n  width: 22%;\n}\n@media (max-width: 800px) {\n  section {\n    width: 100%;\n  }\n}\n' },
      },
      {
        title: 'Padding a suma szerokości',
        source: 'czerwiec 2026, Wycieczki',
        task: '<p>Dwa bloki po 50% mają stać obok siebie, a treść każe im dać marginesy wewnętrzne 20 px. Popraw CSS tak, żeby wciąż mieściły się w jednym rzędzie (nie zmieniaj 50% ani 20 px).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Wycieczki', '  <section id="a">Blok A</section>\n  <section id="b">Blok B</section>'), 'styl.css': 'section {\n  float: left;\n  width: 50%;\n  padding: 20px;\n  background-color: LightSkyBlue;\n}\n#b { background-color: LightYellow; }\n' },
        checks: [
          { section: 'css', desc: 'Szerokość nadal 50%', type: 'cssRule', selector: 'section', prop: 'width', value: '50%' },
          { section: 'css', desc: 'Marginesy wewnętrzne nadal 20 px', type: 'css', selector: 'section', prop: 'padding-left', value: '20px' },
          { section: 'css', desc: 'Bloki w jednym rzędzie', type: 'layout', a: '#a', b: '#b', relation: 'leftOf' },
        ],
        hint: 'box-sizing: border-box; wlicza padding do szerokości.',
        solution: { 'index.html': DOC('Wycieczki', '  <section id="a">Blok A</section>\n  <section id="b">Blok B</section>'), 'styl.css': 'section {\n  float: left;\n  width: 50%;\n  padding: 20px;\n  box-sizing: border-box;\n  background-color: LightSkyBlue;\n}\n#b { background-color: LightYellow; }\n' },
      },
    ],
  },

  // ======================================================================= JS
  'js-dom': {
    module: 'js',
    title: 'JavaScript: pola, przyciski, wynik na stronie',
    short: 'getElementById, value, innerHTML, onclick, liczby z pól.',
    body: `
<p class="lead">Prawie każdy skrypt JS z arkusza robi to samo: po kliknięciu przycisku pobiera wartości z pól, coś liczy i wpisuje wynik do elementu strony.</p>
<h2>Wzór</h2>
<pre>&lt;input type="number" id="cena"&gt;
&lt;button onclick="oblicz()"&gt;Oblicz&lt;/button&gt;
&lt;p id="wynik"&gt;&lt;/p&gt;

&lt;script&gt;
function oblicz() {
  let cena = Number(document.getElementById("cena").value);
  let koszt = cena * 2;
  document.getElementById("wynik").innerHTML = "Koszt: " + koszt + " zł";
}
&lt;/script&gt;</pre>
<table class="dict">
  <tr><th>Potrzeba</th><th>Kod</th></tr>
  <tr><td>element po id</td><td>document.getElementById("id")</td></tr>
  <tr><td>wartość pola</td><td>.value (zawsze tekst!)</td></tr>
  <tr><td>tekst na liczbę</td><td>Number(x), parseInt(x), parseFloat(x)</td></tr>
  <tr><td>wpisanie treści (może zawierać znaczniki)</td><td>.innerHTML = "…"</td></tr>
  <tr><td>czy pole zaznaczone</td><td>.checked (true/false)</td></tr>
  <tr><td>reakcja na kliknięcie</td><td>onclick="funkcja()" w HTML</td></tr>
</table>
<div class="box trap"><ul>
  <li><code>"2" + "3"</code> to <code>"23"</code>. Wartości z pól zamień na liczby przed dodawaniem.</li>
  <li>Skrypt w osobnym pliku podłączasz przez <code>&lt;script src="skrypt.js"&gt;&lt;/script&gt;</code> na końcu <code>body</code>.</li>
  <li>Nazwa funkcji i id dokładnie jak w treści (wielkość liter ma znaczenie).</li>
</ul></div>`,
    exercises: [
      {
        title: 'Powitanie',
        source: 'rozgrzewka',
        task: '<p>Po kliknięciu przycisku „Pokaż” w paragrafie <code>#wynik</code> ma się pojawić tekst „Witaj, ” i imię z pola <code>#imie</code> (np. „Witaj, Ala”).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Powitanie', '  <input type="text" id="imie">\n  <button onclick="pokaz()">Pokaż</button>\n  <p id="wynik"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function pokaz() {\n  // tutaj Twój kod\n}\n' },
        checks: [
          { section: 'js', desc: 'Ala → „Witaj, Ala”', type: 'js', steps: [{ set: '#imie', value: 'Ala' }, { click: 'button' }], expect: [{ selector: '#wynik', equals: 'Witaj, Ala' }] },
          { section: 'js', desc: 'Jan → „Witaj, Jan”', type: 'js', steps: [{ set: '#imie', value: 'Jan' }, { click: 'button' }], expect: [{ selector: '#wynik', equals: 'Witaj, Jan' }] },
        ],
        hint: 'document.getElementById("wynik").innerHTML = "Witaj, " + document.getElementById("imie").value;',
        solution: { 'index.html': DOC('Powitanie', '  <input type="text" id="imie">\n  <button onclick="pokaz()">Pokaż</button>\n  <p id="wynik"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function pokaz() {\n  let imie = document.getElementById("imie").value;\n  document.getElementById("wynik").innerHTML = "Witaj, " + imie;\n}\n' },
      },
      {
        title: 'Koszt wycieczki',
        source: 'czerwiec 2026, Wycieczki',
        task: '<p>Wycieczka kosztuje 350 zł za osobę. Po kliknięciu „Oblicz” w <code>#koszt</code> wyświetl „Koszt wycieczki: X zł”, gdzie X to 350 razy liczba osób z pola <code>#osoby</code>.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Wycieczki', '  <label for="osoby">Liczba osób:</label> <input type="number" id="osoby">\n  <button onclick="oblicz()">Oblicz</button>\n  <p id="koszt"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function oblicz() {\n}\n' },
        checks: [
          { section: 'js', desc: '3 osoby → „Koszt wycieczki: 1050 zł”', type: 'js', steps: [{ set: '#osoby', value: '3' }, { click: 'button' }], expect: [{ selector: '#koszt', equals: 'Koszt wycieczki: 1050 zł' }] },
          { section: 'js', desc: '1 osoba → „Koszt wycieczki: 350 zł”', type: 'js', steps: [{ set: '#osoby', value: '1' }, { click: 'button' }], expect: [{ selector: '#koszt', equals: 'Koszt wycieczki: 350 zł' }] },
        ],
        hint: 'let osoby = Number(document.getElementById("osoby").value);',
        solution: { 'index.html': DOC('Wycieczki', '  <label for="osoby">Liczba osób:</label> <input type="number" id="osoby">\n  <button onclick="oblicz()">Oblicz</button>\n  <p id="koszt"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function oblicz() {\n  let osoby = Number(document.getElementById("osoby").value);\n  document.getElementById("koszt").innerHTML = "Koszt wycieczki: " + (osoby * 350) + " zł";\n}\n' },
      },
      {
        title: 'Suma dwóch liczb',
        source: 'pułapka z dodawaniem tekstów',
        task: '<p>Po kliknięciu „Dodaj” wpisz do <code>#suma</code> tekst „Wynik: ” i sumę liczb z pól <code>#a</code> i <code>#b</code> (np. 2 i 3 dają „Wynik: 5”, 1.5 i 2 dają „Wynik: 3.5”).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Kalkulator', '  <input type="number" id="a"> + <input type="number" id="b">\n  <button onclick="dodaj()">Dodaj</button>\n  <p id="suma"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function dodaj() {\n  let a = document.getElementById("a").value;\n  let b = document.getElementById("b").value;\n  document.getElementById("suma").innerHTML = "Wynik: " + (a + b);\n}\n' },
        checks: [
          { section: 'js', desc: '2 + 3 = 5', type: 'js', steps: [{ set: '#a', value: '2' }, { set: '#b', value: '3' }, { click: 'button' }], expect: [{ selector: '#suma', equals: 'Wynik: 5' }] },
          { section: 'js', desc: '1.5 + 2 = 3.5', type: 'js', steps: [{ set: '#a', value: '1.5' }, { set: '#b', value: '2' }, { click: 'button' }], expect: [{ selector: '#suma', equals: 'Wynik: 3.5' }] },
        ],
        hint: 'parseFloat(...) na obu wartościach.',
        solution: { 'index.html': DOC('Kalkulator', '  <input type="number" id="a"> + <input type="number" id="b">\n  <button onclick="dodaj()">Dodaj</button>\n  <p id="suma"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function dodaj() {\n  let a = parseFloat(document.getElementById("a").value);\n  let b = parseFloat(document.getElementById("b").value);\n  document.getElementById("suma").innerHTML = "Wynik: " + (a + b);\n}\n' },
      },
      {
        title: 'Wybór z listy rozwijanej',
        source: 'wzór z wielu arkuszy',
        task: '<p>Po kliknięciu „Wybierz” wpisz do <code>#info</code> tekst „Wybrano: ” i wartość wybraną z listy <code>#miasto</code>.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Kursy', '  <select id="miasto">\n    <option>Kraków</option>\n    <option>Gdańsk</option>\n    <option>Poznań</option>\n  </select>\n  <button onclick="wybierz()">Wybierz</button>\n  <p id="info"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Gdańsk → „Wybrano: Gdańsk”', type: 'js', steps: [{ set: '#miasto', value: 'Gdańsk' }, { click: 'button' }], expect: [{ selector: '#info', equals: 'Wybrano: Gdańsk' }] },
          { section: 'js', desc: 'Poznań → „Wybrano: Poznań”', type: 'js', steps: [{ set: '#miasto', value: 'Poznań' }, { click: 'button' }], expect: [{ selector: '#info', equals: 'Wybrano: Poznań' }] },
        ],
        hint: 'Lista rozwijana też ma .value.',
        solution: { 'index.html': DOC('Kursy', '  <select id="miasto">\n    <option>Kraków</option>\n    <option>Gdańsk</option>\n    <option>Poznań</option>\n  </select>\n  <button onclick="wybierz()">Wybierz</button>\n  <p id="info"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function wybierz() {\n  document.getElementById("info").innerHTML = "Wybrano: " + document.getElementById("miasto").value;\n}\n' },
      },
      {
        title: 'Licznik kliknięć',
        source: 'zmienna poza funkcją',
        task: '<p>Każde kliknięcie przycisku „+1” zwiększa licznik i wpisuje jego wartość do <code>#licznik</code> (po trzech kliknięciach: „3”).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Licznik', '  <button onclick="dodaj()">+1</button>\n  <p id="licznik">0</p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Po 3 kliknięciach: 3', type: 'js', steps: [{ click: 'button' }, { click: 'button' }, { click: 'button' }], expect: [{ selector: '#licznik', equals: '3' }] },
          { section: 'js', desc: 'Po 1 kliknięciu: 1', type: 'js', steps: [{ click: 'button' }], expect: [{ selector: '#licznik', equals: '1' }] },
        ],
        hint: 'let licznik = 0; poza funkcją, a w funkcji licznik++.',
        solution: { 'index.html': DOC('Licznik', '  <button onclick="dodaj()">+1</button>\n  <p id="licznik">0</p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'let licznik = 0;\nfunction dodaj() {\n  licznik++;\n  document.getElementById("licznik").innerHTML = licznik;\n}\n' },
      },
    ],
  },

  'js-logika': {
    module: 'js',
    title: 'JavaScript: warunki, pętle, obliczenia',
    short: 'if/else, for, tablice, Math, toFixed, walidacja.',
    body: `
<h2>Warunki</h2>
<pre>if (wiek &lt; 18) {
  komunikat = "Za młody";
} else if (wiek &lt; 65) {
  komunikat = "Zapraszamy";
} else {
  komunikat = "Zniżka seniora";
}</pre>
<p>Porównania: <code>==</code>/<code>===</code>, <code>!=</code>, <code>&lt;</code>, <code>&gt;=</code>; łączenie: <code>&amp;&amp;</code> (i), <code>||</code> (lub). Puste pole: <code>pole.value == ""</code>.</p>
<h2>Pętla for</h2>
<pre>let wynik = "";
for (let i = 1; i &lt;= 5; i++) {
  wynik += "&lt;li&gt;" + i + "&lt;/li&gt;";
}
document.getElementById("lista").innerHTML = wynik;</pre>
<h2>Liczby</h2>
<table class="dict">
  <tr><th>Potrzeba</th><th>Kod</th></tr>
  <tr><td>2 miejsca po przecinku</td><td>x.toFixed(2)</td></tr>
  <tr><td>zaokrąglenie / w dół / w górę</td><td>Math.round(x) / Math.floor(x) / Math.ceil(x)</td></tr>
  <tr><td>losowa liczba 1..10</td><td>Math.floor(Math.random() * 10) + 1</td></tr>
  <tr><td>największa z tablicy</td><td>Math.max(...tablica)</td></tr>
</table>
<div class="box trap"><p>Komunikaty co do znaku, z kropką lub bez, jak w treści. Wynik pieniężny z dwoma miejscami: <code>toFixed(2)</code>.</p></div>`,
    exercises: [
      {
        title: 'Walidacja wieku',
        source: 'wzór z wielu arkuszy',
        task: '<p>Po kliknięciu „Sprawdź”: gdy pole <code>#wiek</code> jest puste, w <code>#msg</code> wpisz „Podaj wiek”; gdy wiek &lt; 18: „Za młody”; w przeciwnym razie „Zapraszamy”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Wiek', '  <input type="number" id="wiek">\n  <button onclick="sprawdz()">Sprawdź</button>\n  <p id="msg"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Puste → „Podaj wiek”', type: 'js', steps: [{ click: 'button' }], expect: [{ selector: '#msg', equals: 'Podaj wiek' }] },
          { section: 'js', desc: '15 → „Za młody”', type: 'js', steps: [{ set: '#wiek', value: '15' }, { click: 'button' }], expect: [{ selector: '#msg', equals: 'Za młody' }] },
          { section: 'js', desc: '18 → „Zapraszamy”', type: 'js', steps: [{ set: '#wiek', value: '18' }, { click: 'button' }], expect: [{ selector: '#msg', equals: 'Zapraszamy' }] },
        ],
        hint: 'Najpierw sprawdź puste pole: if (pole.value == "") …',
        solution: { 'index.html': DOC('Wiek', '  <input type="number" id="wiek">\n  <button onclick="sprawdz()">Sprawdź</button>\n  <p id="msg"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function sprawdz() {\n  let pole = document.getElementById("wiek").value;\n  let msg = document.getElementById("msg");\n  if (pole == "") {\n    msg.innerHTML = "Podaj wiek";\n  } else if (Number(pole) < 18) {\n    msg.innerHTML = "Za młody";\n  } else {\n    msg.innerHTML = "Zapraszamy";\n  }\n}\n' },
      },
      {
        title: 'Rabat od liczby sztuk',
        source: 'kalkulatory z arkuszy',
        task: '<p>Cena sztuki to 12.50 zł. Gdy liczba sztuk (<code>#sztuki</code>) jest większa od 5, przysługuje rabat 10%. Po kliknięciu „Oblicz” wpisz do <code>#cena</code> „Do zapłaty: X zł” z dwoma miejscami po przecinku.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Sklep', '  <input type="number" id="sztuki">\n  <button onclick="oblicz()">Oblicz</button>\n  <p id="cena"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: '2 sztuki → „Do zapłaty: 25.00 zł”', type: 'js', steps: [{ set: '#sztuki', value: '2' }, { click: 'button' }], expect: [{ selector: '#cena', equals: 'Do zapłaty: 25.00 zł' }] },
          { section: 'js', desc: '6 sztuk → „Do zapłaty: 67.50 zł”', type: 'js', steps: [{ set: '#sztuki', value: '6' }, { click: 'button' }], expect: [{ selector: '#cena', equals: 'Do zapłaty: 67.50 zł' }] },
          { section: 'js', desc: '5 sztuk (bez rabatu) → „Do zapłaty: 62.50 zł”', type: 'js', steps: [{ set: '#sztuki', value: '5' }, { click: 'button' }], expect: [{ selector: '#cena', equals: 'Do zapłaty: 62.50 zł' }] },
        ],
        hint: 'if (sztuki > 5) suma = suma * 0.9;  potem suma.toFixed(2)',
        solution: { 'index.html': DOC('Sklep', '  <input type="number" id="sztuki">\n  <button onclick="oblicz()">Oblicz</button>\n  <p id="cena"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function oblicz() {\n  let sztuki = Number(document.getElementById("sztuki").value);\n  let suma = sztuki * 12.5;\n  if (sztuki > 5) {\n    suma = suma * 0.9;\n  }\n  document.getElementById("cena").innerHTML = "Do zapłaty: " + suma.toFixed(2) + " zł";\n}\n' },
      },
      {
        title: 'Lista z pętli',
        source: 'pętle z arkuszy',
        task: '<p>Po kliknięciu „Generuj” wypełnij listę <code>#lista</code> elementami od 1 do liczby z pola <code>#ile</code> (każdy element listy to kolejna liczba).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Pętla', '  <input type="number" id="ile">\n  <button onclick="generuj()">Generuj</button>\n  <ol id="lista"></ol>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: '4 → cztery elementy listy', type: 'js', steps: [{ set: '#ile', value: '4' }, { click: 'button' }], expect: [{ selector: '#lista li', count: 4 }, { selector: '#lista li:last-child', equals: '4' }] },
          { section: 'js', desc: '2 → dwa elementy', type: 'js', steps: [{ set: '#ile', value: '2' }, { click: 'button' }], expect: [{ selector: '#lista li', count: 2 }] },
        ],
        hint: 'Zbierz tekst w zmiennej: wynik += "<li>" + i + "</li>"; a na końcu wpisz innerHTML.',
        solution: { 'index.html': DOC('Pętla', '  <input type="number" id="ile">\n  <button onclick="generuj()">Generuj</button>\n  <ol id="lista"></ol>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function generuj() {\n  let ile = Number(document.getElementById("ile").value);\n  let wynik = "";\n  for (let i = 1; i <= ile; i++) {\n    wynik += "<li>" + i + "</li>";\n  }\n  document.getElementById("lista").innerHTML = wynik;\n}\n' },
      },
      {
        title: 'Suma zaznaczonych kursów',
        source: 'styczeń 2025, Kursy programowania',
        task: '<p>Kurs React.js kosztuje 5000 zł, kurs JavaScript 3000 zł. Po kliknięciu „Oblicz” wpisz do <code>#kwota</code> „Kwota: X zł”, gdzie X to suma cen zaznaczonych kursów (<code>#react</code>, <code>#javascript</code>).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Kursy', '  <input type="checkbox" id="react"> <label for="react">Kurs React.js</label><br>\n  <input type="checkbox" id="javascript"> <label for="javascript">Kurs JavaScript</label><br>\n  <button onclick="oblicz()">Oblicz</button>\n  <p id="kwota"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Oba → „Kwota: 8000 zł”', type: 'js', steps: [{ set: '#react', value: true }, { set: '#javascript', value: true }, { click: 'button' }], expect: [{ selector: '#kwota', equals: 'Kwota: 8000 zł' }] },
          { section: 'js', desc: 'Tylko JavaScript → „Kwota: 3000 zł”', type: 'js', steps: [{ set: '#javascript', value: true }, { click: 'button' }], expect: [{ selector: '#kwota', equals: 'Kwota: 3000 zł' }] },
          { section: 'js', desc: 'Nic → „Kwota: 0 zł”', type: 'js', steps: [{ click: 'button' }], expect: [{ selector: '#kwota', equals: 'Kwota: 0 zł' }] },
        ],
        hint: 'if (document.getElementById("react").checked) suma += 5000;',
        solution: { 'index.html': DOC('Kursy', '  <input type="checkbox" id="react"> <label for="react">Kurs React.js</label><br>\n  <input type="checkbox" id="javascript"> <label for="javascript">Kurs JavaScript</label><br>\n  <button onclick="oblicz()">Oblicz</button>\n  <p id="kwota"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function oblicz() {\n  let suma = 0;\n  if (document.getElementById("react").checked) suma += 5000;\n  if (document.getElementById("javascript").checked) suma += 3000;\n  document.getElementById("kwota").innerHTML = "Kwota: " + suma + " zł";\n}\n' },
      },
      {
        title: 'Średnia z tablicy',
        source: 'tablice',
        task: '<p>W skrypcie jest tablica ocen <code>[5, 4, 3, 5, 6]</code>. Po kliknięciu „Średnia” wpisz do <code>#srednia</code> średnią z dwoma miejscami po przecinku („4.60”).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Oceny', '  <button onclick="srednia()">Średnia</button>\n  <p id="srednia"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'let oceny = [5, 4, 3, 5, 6];\n' },
        checks: [
          { section: 'js', desc: 'Wynik „4.60”', type: 'js', steps: [{ click: 'button' }], expect: [{ selector: '#srednia', equals: '4.60' }] },
        ],
        hint: 'Pętla sumuje oceny, potem suma / oceny.length i toFixed(2).',
        solution: { 'index.html': DOC('Oceny', '  <button onclick="srednia()">Średnia</button>\n  <p id="srednia"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'let oceny = [5, 4, 3, 5, 6];\nfunction srednia() {\n  let suma = 0;\n  for (let i = 0; i < oceny.length; i++) {\n    suma += oceny[i];\n  }\n  document.getElementById("srednia").innerHTML = (suma / oceny.length).toFixed(2);\n}\n' },
      },
    ],
  },

  'js-style': {
    module: 'js',
    title: 'JavaScript: zmiana wyglądu strony',
    short: 'style, przełączanie bloków, zamiana obrazów, najechanie kursorem.',
    body: `
<h2>Zmiana stylu</h2>
<pre>let blok = document.getElementById("blok");
blok.style.backgroundColor = "Salmon";   // background-color → backgroundColor
blok.style.display = "none";            // ukryj
blok.style.display = "block";           // pokaż</pre>
<p>Właściwości z myślnikiem piszesz w JS „wielbłądzio”: <code>font-size</code> → <code>fontSize</code>.</p>
<h2>Przełączanie bloków (zakładki)</h2>
<p>Wzór z arkusza „Paznokcie” (styczeń 2026): trzy sekcje, w jednym momencie widoczna tylko jedna.</p>
<pre>function pokaz(nr) {
  document.getElementById("sekcja1").style.display = "none";
  document.getElementById("sekcja2").style.display = "none";
  document.getElementById("sekcja3").style.display = "none";
  document.getElementById("sekcja" + nr).style.display = "block";
}</pre>
<h2>Zamiana obrazu</h2>
<pre>document.getElementById("duze").src = "2.jpg";</pre>
<h2>Zdarzenia</h2>
<table class="dict">
  <tr><th>W treści</th><th>Zdarzenie</th></tr>
  <tr><td>po kliknięciu</td><td>onclick</td></tr>
  <tr><td>gdy kursor najedzie / zjedzie</td><td>onmouseover / onmouseout</td></tr>
  <tr><td>po zmianie wartości pola</td><td>onchange / oninput</td></tr>
  <tr><td>po załadowaniu strony</td><td>window.onload albo skrypt na końcu body</td></tr>
  <tr><td>co 3 sekundy</td><td>setInterval(funkcja, 3000)</td></tr>
</table>`,
    exercises: [
      {
        title: 'Kolor tła po kliknięciu',
        source: 'rozgrzewka',
        task: '<p>Po kliknięciu przycisku „Zmień” blok <code>#blok</code> ma dostać kolor tła Salmon.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Kolory', '  <div id="blok" style="height:80px">Blok</div>\n  <button onclick="zmien()">Zmień</button>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Po kliknięciu tło Salmon', type: 'js', steps: [{ click: 'button' }], expect: [{ selector: '#blok', css: 'background-color', value: 'Salmon' }] },
        ],
        hint: 'document.getElementById("blok").style.backgroundColor = "Salmon";',
        solution: { 'index.html': DOC('Kolory', '  <div id="blok" style="height:80px">Blok</div>\n  <button onclick="zmien()">Zmień</button>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function zmien() {\n  document.getElementById("blok").style.backgroundColor = "Salmon";\n}\n' },
      },
      {
        title: 'Zakładki z trzema sekcjami',
        source: 'styczeń 2026, Paznokcie',
        task: '<p>„Działanie w przypadku zdarzenia, gdy kursor najedzie na przycisk „Kształt”: drugi blok sekcji jest wyświetlany w postaci blokowej, pozostałe bloki są usunięte.” Zrób to samo dla trzech przycisków (najechanie kursorem).</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Paznokcie', '  <button id="b1" onmouseover="pokaz(1)">Kolor</button>\n  <button id="b2" onmouseover="pokaz(2)">Kształt</button>\n  <button id="b3" onmouseover="pokaz(3)">Wzór</button>\n  <section id="sekcja1">Kolor</section>\n  <section id="sekcja2" style="display:none">Kształt</section>\n  <section id="sekcja3" style="display:none">Wzór</section>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function pokaz(nr) {\n}\n' },
        checks: [
          { section: 'js', desc: '„Kształt”: sekcja 2 widoczna', type: 'js', steps: [{ hover: '#b2' }], expect: [{ selector: '#sekcja2', css: 'display', value: 'block' }, { selector: '#sekcja1', css: 'display', value: 'none' }, { selector: '#sekcja3', css: 'display', value: 'none' }] },
          { section: 'js', desc: '„Wzór”: sekcja 3 widoczna', type: 'js', steps: [{ hover: '#b3' }], expect: [{ selector: '#sekcja3', css: 'display', value: 'block' }, { selector: '#sekcja2', css: 'display', value: 'none' }] },
          { section: 'js', desc: 'Powrót do „Kolor”', type: 'js', steps: [{ hover: '#b3' }, { hover: '#b1' }], expect: [{ selector: '#sekcja1', css: 'display', value: 'block' }, { selector: '#sekcja3', css: 'display', value: 'none' }] },
        ],
        hint: 'Ukryj wszystkie trzy, potem pokaż "sekcja" + nr.',
        solution: { 'index.html': DOC('Paznokcie', '  <button id="b1" onmouseover="pokaz(1)">Kolor</button>\n  <button id="b2" onmouseover="pokaz(2)">Kształt</button>\n  <button id="b3" onmouseover="pokaz(3)">Wzór</button>\n  <section id="sekcja1">Kolor</section>\n  <section id="sekcja2" style="display:none">Kształt</section>\n  <section id="sekcja3" style="display:none">Wzór</section>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function pokaz(nr) {\n  for (let i = 1; i <= 3; i++) {\n    document.getElementById("sekcja" + i).style.display = "none";\n  }\n  document.getElementById("sekcja" + nr).style.display = "block";\n}\n' },
      },
      {
        title: 'Pokaż i ukryj opis',
        source: 'wzór z wielu arkuszy',
        task: '<p>Przycisk „Opis” przełącza widoczność akapitu <code>#opis</code>: jeśli jest ukryty, pokazuje go, jeśli widoczny, ukrywa. Na początku opis jest ukryty.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Opis', '  <button onclick="przelacz()">Opis</button>\n  <p id="opis" style="display:none">Opis produktu</p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Jedno kliknięcie: opis widoczny', type: 'js', steps: [{ click: 'button' }], expect: [{ selector: '#opis', css: 'display', value: 'block' }] },
          { section: 'js', desc: 'Dwa kliknięcia: opis znów ukryty', type: 'js', steps: [{ click: 'button' }, { click: 'button' }], expect: [{ selector: '#opis', css: 'display', value: 'none' }] },
        ],
        hint: 'if (opis.style.display == "none") … else …',
        solution: { 'index.html': DOC('Opis', '  <button onclick="przelacz()">Opis</button>\n  <p id="opis" style="display:none">Opis produktu</p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function przelacz() {\n  let opis = document.getElementById("opis");\n  if (opis.style.display == "none") {\n    opis.style.display = "block";\n  } else {\n    opis.style.display = "none";\n  }\n}\n' },
      },
      {
        title: 'Duży obraz z miniatury',
        source: 'galerie z arkuszy',
        task: '<p>Kliknięcie miniatury ma ustawić jej plik w dużym obrazie <code>#duze</code> (atrybut <code>src</code>). Użyj jednej funkcji <code>pokazDuze(plik)</code>.</p>',
        entry: 'index.html',
        assetsBase: BIBLIO,
        assets: ['obraz.jpg'],
        files: { 'index.html': DOC('Galeria', '  <img src="obraz.jpg" alt="1" width="80" onclick="pokazDuze(\'obraz.jpg\')">\n  <img src="obraz.png" alt="2" width="80" onclick="pokazDuze(\'obraz.png\')">\n  <br><img id="duze" src="" alt="duży" width="300">\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Druga miniatura → duży obraz obraz.png', type: 'js', steps: [{ click: 'img[alt="2"]' }], expect: [{ selector: '#duze', attr: 'src', contains: 'obraz.png' }] },
          { section: 'js', desc: 'Pierwsza miniatura → obraz.jpg', type: 'js', steps: [{ click: 'img[alt="1"]' }], expect: [{ selector: '#duze', attr: 'src', contains: 'obraz.jpg' }] },
        ],
        hint: 'document.getElementById("duze").src = plik;',
        solution: { 'index.html': DOC('Galeria', '  <img src="obraz.jpg" alt="1" width="80" onclick="pokazDuze(\'obraz.jpg\')">\n  <img src="obraz.png" alt="2" width="80" onclick="pokazDuze(\'obraz.png\')">\n  <br><img id="duze" src="" alt="duży" width="300">\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function pokazDuze(plik) {\n  document.getElementById("duze").src = plik;\n}\n' },
      },
      {
        title: 'Komunikat w oknie',
        source: 'alert z arkuszy',
        task: '<p>Po kliknięciu „Wyślij”: jeśli pole <code>#email</code> nie zawiera znaku @, pokaż komunikat (alert) „Błędny adres”; w przeciwnym razie wpisz do <code>#info</code> „Dziękujemy”.</p>',
        entry: 'index.html',
        files: { 'index.html': DOC('Kontakt', '  <input type="text" id="email">\n  <button onclick="wyslij()">Wyślij</button>\n  <p id="info"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': '' },
        checks: [
          { section: 'js', desc: 'Bez @ → alert „Błędny adres”', type: 'js', steps: [{ set: '#email', value: 'jan.pl' }, { click: 'button' }], expect: [{ alert: 'Błędny adres' }] },
          { section: 'js', desc: 'Z @ → „Dziękujemy”', type: 'js', steps: [{ set: '#email', value: 'jan@x.pl' }, { click: 'button' }], expect: [{ selector: '#info', equals: 'Dziękujemy' }] },
        ],
        hint: 'email.includes("@")',
        solution: { 'index.html': DOC('Kontakt', '  <input type="text" id="email">\n  <button onclick="wyslij()">Wyślij</button>\n  <p id="info"></p>\n  <script src="skrypt.js"></script>'), 'skrypt.js': 'function wyslij() {\n  let email = document.getElementById("email").value;\n  if (!email.includes("@")) {\n    alert("Błędny adres");\n  } else {\n    document.getElementById("info").innerHTML = "Dziękujemy";\n  }\n}\n' },
      },
    ],
  },
};
