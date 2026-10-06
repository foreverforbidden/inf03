// Tresc lekcji. Kazda lekcja SQL ma tag, wg ktorego dobierane sa cwiczenia z prawdziwych arkuszy.
// Kolejnosc lekcji = kolejnosc nauki; cwiczenie trafia do NAJPOZNIEJSZEJ lekcji, ktorej wzorca wymaga.

export const SQL_LESSON_ORDER = ['sql-select', 'sql-warunki', 'sql-sortowanie', 'sql-agregacja', 'sql-join', 'sql-modyfikacja', 'sql-ddl', 'sql-uzytkownicy'];

const TAG_TO_LESSON = {
  'sql:select': 'sql-select',
  'sql:aliasy': 'sql-agregacja',
  'sql:warunki': 'sql-warunki',
  'sql:daty': 'sql-warunki',
  'sql:sortowanie': 'sql-sortowanie',
  'sql:agregacja': 'sql-agregacja',
  'sql:join': 'sql-join',
  'sql:insert': 'sql-modyfikacja',
  'sql:update': 'sql-modyfikacja',
  'sql:delete': 'sql-modyfikacja',
  'sql:ddl': 'sql-ddl',
  'sql:uzytkownicy': 'sql-uzytkownicy',
};

export function lessonForQuery(q) {
  let best = 0;
  for (const t of q.tags) {
    const i = SQL_LESSON_ORDER.indexOf(TAG_TO_LESSON[t]);
    if (i > best) best = i;
  }
  return SQL_LESSON_ORDER[best];
}

export const MODULES = [
  { id: 'start', title: 'Mapa egzaminu', desc: 'Jak wygląda arkusz, plan na 150 minut, najczęstsze pułapki.', status: 'ready', href: '#/lekcja/egzamin' },
  { id: 'sql', title: 'Kwerendy SQL', desc: 'Są w prawie każdym arkuszu. 8 lekcji i ponad 300 kwerend z prawdziwych arkuszy.', status: 'ready', href: '#/lekcje' },
  { id: 'php', title: 'PHP i baza danych', desc: 'Szablon połączenia, pętla po wynikach, formularze.', status: 'soon' },
  { id: 'web', title: 'HTML i CSS', desc: 'Szkielet strony, układ bloków, style z treści.', status: 'soon' },
  { id: 'js', title: 'JavaScript', desc: 'Odczyt pól, obliczenia, zmiana stylów i treści.', status: 'soon' },
  { id: 'exam', title: 'Egzamin próbny', desc: 'Cały arkusz na czas, z raportem punktów.', status: 'soon' },
];

export const LESSONS = {
  egzamin: {
    title: 'Mapa egzaminu INF.03',
    short: 'Co jest w arkuszu i jak rozplanować 150 minut.',
    body: `
<p class="lead">Arkusz INF.03 to zawsze jedno zadanie: mała aplikacja internetowa. Zanim zaczniesz ćwiczyć, zobacz, z czego się składa i gdzie najłatwiej tracić punkty.</p>

<h2>Z czego składa się arkusz</h2>
<ol>
  <li><strong>Baza danych</strong>: import pliku .sql w phpMyAdmin i zwykle 4 lub 5 kwerend zapisanych w <code>kwerendy.txt</code> (plus zrzuty ekranu wyników).</li>
  <li><strong>Grafika</strong>: przeskalowanie, kadrowanie, przezroczyste tło, zmiana formatu. Robisz to w edytorze grafiki.</li>
  <li><strong>Strona HTML i CSS</strong>: bloki ułożone jak na ilustracji, teksty z treści, style z listy.</li>
  <li><strong>Skrypt</strong>: w większości arkuszy PHP pobierający dane z bazy (w 50 z 79 arkuszy w tym zbiorze), w pozostałych JavaScript działający w przeglądarce (28 z 79).</li>
</ol>
<p>Ocena to lista kryteriów. Każdy punkt z treści (np. „kolor tła Plum”, „tytuł strony Biblioteka miejska”) to osobny punkt na karcie oceny. Dlatego dokładność jest ważniejsza niż pomysłowość.</p>

<h2>Plan na 150 minut</h2>
<div class="table-wrap"><table class="data">
  <tr><th>Czas</th><th>Co robisz</th></tr>
  <tr><td>0 do 10 min</td><td>Czytasz całą treść, zakładasz folder, rozpakowujesz archiwum.</td></tr>
  <tr><td>10 do 35 min</td><td>Baza, import, kwerendy, zrzuty ekranu. Kwerendy przydadzą się potem w skrypcie.</td></tr>
  <tr><td>35 do 50 min</td><td>Grafika.</td></tr>
  <tr><td>50 do 90 min</td><td>HTML i CSS: najpierw szkielet bloków, potem treści, na końcu style.</td></tr>
  <tr><td>90 do 135 min</td><td>Skrypt PHP lub JS.</td></tr>
  <tr><td>135 do 150 min</td><td>Kontrola: lista plików z końca treści, <code>przeglądarka.txt</code>, nazwy plików, czy wszystko się otwiera.</td></tr>
</table></div>

<h2>Gdzie najczęściej giną punkty</h2>
<div class="box trap">
<ul>
  <li><strong>„jedynie”</strong>: kwerenda ma zwracać tylko wymienione kolumny, w podanej kolejności. Gwiazdka <code>*</code> to błąd.</li>
  <li><strong>Teksty co do znaku</strong>: nagłówki, odnośniki, tytuł strony, teksty alternatywne obrazów. Wielkość liter i polskie znaki też.</li>
  <li><strong>„wyłącznie przy pomocy selektora znacznika”</strong>: wtedy <code>img { }</code>, a nie <code>.klasa img { }</code>.</li>
  <li><strong>Układ bloków</strong>: <code>float</code>, szerokości w procentach i <code>clear: both</code> na stopce. Porównaj z ilustracją.</li>
  <li><strong>PHP</strong>: brak <code>mysqli_close()</code> na końcu, zły format wypisywania danych.</li>
  <li><strong>Pliki</strong>: zła nazwa lub rozszerzenie (<code>obraz.png</code> zamiast <code>obraz.jpg</code>), brak zrzutów, brak <code>przeglądarka.txt</code>.</li>
</ul>
</div>

<h2>Słownik: treść zadania → SQL</h2>
<p>Treść kwerend jest pisana stałymi zwrotami. Liczby w nawiasach pokazują, jak często dany zwrot pojawił się w 79 arkuszach.</p>
<table class="dict">
  <tr><th>W treści</th><th>W SQL</th></tr>
  <tr><td>„wybierające <strong>jedynie</strong> pola X i Y” (218)</td><td>SELECT X, Y FROM …</td></tr>
  <tr><td>„<strong>Należy posłużyć się relacją</strong>” (73, zawsze JOIN)</td><td>… JOIN t2 ON t1.klucz = t2.klucz</td></tr>
  <tr><td>„posortowane <strong>rosnąco</strong> / <strong>malejąco</strong> według …”</td><td>ORDER BY kolumna ASC / DESC</td></tr>
  <tr><td>„<strong>zliczające</strong>”, „liczbę …”</td><td>COUNT(*)</td></tr>
  <tr><td>„<strong>średnią</strong> …”, „sumę”, „najwyższą / najniższą”</td><td>AVG(), SUM(), MAX(), MIN()</td></tr>
  <tr><td>„<strong>dla każdego</strong> …”, „pogrupowane”</td><td>GROUP BY …</td></tr>
  <tr><td>„kolumna ma <strong>alias</strong> / nazwę …” (25, zawsze AS)</td><td>… AS nazwa</td></tr>
  <tr><td>„<strong>losowo</strong> wybrane”, „pierwszych 5”</td><td>ORDER BY RAND() LIMIT 5</td></tr>
  <tr><td>„zaczyna się na”, „zawiera”</td><td>LIKE 'A%', LIKE '%tekst%'</td></tr>
  <tr><td>„<strong>wstawiające</strong> rekord”</td><td>INSERT INTO t (…) VALUES (…)</td></tr>
  <tr><td>„<strong>aktualizujące</strong>”, „zmieniające wartość”</td><td>UPDATE t SET … WHERE …</td></tr>
  <tr><td>„<strong>usuwające</strong> rekord”</td><td>DELETE FROM t WHERE …</td></tr>
  <tr><td>„<strong>dodające kolumnę</strong>”, „modyfikujące strukturę tabeli”</td><td>ALTER TABLE t ADD …</td></tr>
  <tr><td>„<strong>tworzące użytkownika</strong>”, „nadające prawa”</td><td>CREATE USER …; GRANT … ON … TO …</td></tr>
</table>

<h2>Jak korzystać z tej strony</h2>
<ol>
  <li>Przejdź lekcje SQL po kolei. Każda kończy się listą prawdziwych kwerend z arkuszy, które sprawdzają się od razu.</li>
  <li>Gdy lekcje idą gładko, rozwiązuj całe arkusze w zakładce <a href="#/arkusze">Arkusze</a>.</li>
  <li>Moduły PHP, HTML/CSS i JS oraz egzamin próbny pojawią się w kolejnych wersjach.</li>
</ol>
<p class="btns"><a class="btn primary" href="#/lekcja/sql-select">Zacznij od SELECT →</a></p>
`,
  },

  'sql-select': {
    title: 'SELECT: wybieranie kolumn i wierszy',
    short: 'SELECT … FROM … WHERE … i słowo „jedynie”.',
    body: `
<p class="lead">Najczęstsza kwerenda na egzaminie: wybierz kilka kolumn z jednej tabeli, czasem z prostym warunkiem.</p>
<h2>Wzór</h2>
<pre>SELECT kolumna1, kolumna2
FROM tabela
WHERE warunek;</pre>
<ul>
  <li><strong>SELECT</strong>: które kolumny i w jakiej kolejności. Kolejność ma być taka jak w treści.</li>
  <li><strong>FROM</strong>: z której tabeli.</li>
  <li><strong>WHERE</strong>: które wiersze. Tekst w apostrofach: <code>gatunek = 'liryka'</code>, liczby bez: <code>cena &lt; 15</code>.</li>
</ul>
<h2>Przykład z arkusza</h2>
<p>Treść: <em>„Zapytanie 1: wybierające jedynie id i tytuły książek z gatunku liryka”</em> (czerwiec 2025, Biblioteka miejska).</p>
<pre>SELECT id, tytul FROM ksiazka WHERE gatunek = 'liryka';</pre>
<p>Nazwy kolumn bierzesz ze schematu bazy (ilustracja w arkuszu, tutaj w panelu obok zadania), a nie z treści: w treści jest „tytuły”, w bazie kolumna <code>tytul</code>.</p>
<h2>Operatory porównania</h2>
<p><code>=</code>, <code>&lt;&gt;</code> lub <code>!=</code> (różne), <code>&lt;</code>, <code>&gt;</code>, <code>&lt;=</code>, <code>&gt;=</code>. „Mniejsza od 15” to <code>&lt; 15</code>, „co najmniej 15” to <code>&gt;= 15</code>.</p>
<div class="box trap">
<p><strong>Pułapki</strong></p>
<ul>
  <li><code>SELECT *</code>, gdy treść mówi „jedynie”. Zawsze wypisuj kolumny.</li>
  <li>Cudzysłowy typograficzne z treści („ ”) zamiast apostrofów prostych <code>'</code>.</li>
  <li>Zła kolejność kolumn względem treści.</li>
</ul>
</div>
<div class="box tip"><p>Skróty w ćwiczeniach: <kbd>Ctrl</kbd>+<kbd>Enter</kbd> uruchamia zapytanie, <kbd>Shift</kbd>+<kbd>Enter</kbd> sprawdza odpowiedź.</p></div>
`,
  },

  'sql-warunki': {
    title: 'Warunki: AND, OR, LIKE, BETWEEN, daty',
    short: 'Złożone warunki w WHERE, wzorce tekstu i daty.',
    body: `
<p class="lead">Gdy warunek ma kilka części albo dotyczy fragmentu tekstu lub daty.</p>
<h2>Łączenie warunków</h2>
<pre>WHERE cena &lt; 100 AND kategoria = 'dramat'
WHERE miasto = 'Malbork' OR miasto = 'Gdańsk'
WHERE miasto IN ('Malbork', 'Gdańsk')     -- to samo krócej</pre>
<p>Mieszając AND i OR, używaj nawiasów: <code>WHERE (a OR b) AND c</code>.</p>
<h2>LIKE: fragment tekstu</h2>
<pre>WHERE nazwisko LIKE 'K%'     -- zaczyna się na K
WHERE nazwa LIKE '%ka'       -- kończy się na „ka”
WHERE opis LIKE '%wiosna%'   -- zawiera „wiosna”</pre>
<p><code>%</code> oznacza dowolny ciąg znaków, <code>_</code> dokładnie jeden znak.</p>
<h2>BETWEEN: przedział (z końcami)</h2>
<pre>WHERE cena BETWEEN 100 AND 200          -- 100 &lt;= cena &lt;= 200
WHERE data BETWEEN '2024-01-01' AND '2024-01-31'</pre>
<h2>Daty</h2>
<p>Daty w MySQL zapisuje się jako tekst <code>'RRRR-MM-DD'</code>. Przydatne funkcje:</p>
<pre>WHERE YEAR(data_ur) = 2000       -- rok
WHERE MONTH(data) = 5            -- miesiąc
WHERE data = CURDATE()           -- dzisiaj
WHERE data &gt; '2023-12-31'</pre>
<h2>Brak wartości</h2>
<pre>WHERE telefon IS NULL
WHERE telefon IS NOT NULL</pre>
<div class="box trap"><p><strong>Pułapka:</strong> <code>= NULL</code> nigdy nie działa. Zawsze <code>IS NULL</code>.</p></div>
`,
  },

  'sql-sortowanie': {
    title: 'Sortowanie, LIMIT, losowanie, DISTINCT',
    short: 'ORDER BY, LIMIT, ORDER BY RAND(), bez powtórzeń.',
    body: `
<h2>ORDER BY</h2>
<pre>SELECT imie, nazwisko FROM autorzy ORDER BY nazwisko ASC;   -- rosnąco (A→Z, 1→9)
SELECT nazwa, cena FROM dania ORDER BY cena DESC;          -- malejąco</pre>
<p>„posortowane rosnąco” to <code>ASC</code> (domyślne, można pominąć), „malejąco” to <code>DESC</code>. Kilka kolumn: <code>ORDER BY nazwisko, imie</code>.</p>
<h2>LIMIT</h2>
<pre>SELECT nazwa, cena FROM produkty ORDER BY cena DESC LIMIT 3;   -- 3 najdroższe</pre>
<p>LIMIT jest zawsze na końcu zapytania.</p>
<h2>Losowo</h2>
<pre>SELECT nazwa, opis, cena FROM nagrody ORDER BY RAND() LIMIT 5;</pre>
<p>„losowo wybrane 5 rekordów” to zawsze <code>ORDER BY RAND() LIMIT 5</code>. W tym trenerze takie kwerendy sprawdzane są inaczej: liczba wierszy i to, czy każdy wiersz spełnia warunki zadania.</p>
<h2>Bez powtórzeń</h2>
<pre>SELECT DISTINCT miasto FROM klienci ORDER BY miasto;</pre>
<div class="box trap"><p><strong>Pułapka:</strong> kolejność części zapytania jest stała: <code>SELECT … FROM … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT …</code>.</p></div>
`,
  },

  'sql-agregacja': {
    title: 'Funkcje agregujące, GROUP BY i aliasy',
    short: 'COUNT, AVG, SUM, MIN, MAX, „dla każdego”, AS.',
    body: `
<p class="lead">Gdy treść każe coś policzyć, uśrednić albo zsumować.</p>
<h2>Funkcje agregujące</h2>
<pre>SELECT COUNT(*) FROM zamowienia;              -- liczba wierszy
SELECT AVG(cena) FROM wycieczki;               -- średnia
SELECT SUM(kwota), MIN(cena), MAX(cena) FROM …</pre>
<h2>GROUP BY: „dla każdego”</h2>
<p>„liczba zamówień dla poszczególnych kwiaciarni” oznacza osobny wynik dla każdej kwiaciarni:</p>
<pre>SELECT id_kwiaciarni, COUNT(*) FROM zamowienia GROUP BY id_kwiaciarni;</pre>
<div class="box"><p><strong>Zasada:</strong> każda kolumna z SELECT, która nie jest w funkcji agregującej, musi być w GROUP BY.</p></div>
<h2>Alias: AS</h2>
<p>Gdy treść podaje nazwę kolumny wyniku („kolumna ma alias liczba”), użyj <code>AS</code>:</p>
<pre>SELECT liczbaDni, AVG(cena) AS sredniaCena FROM wycieczki GROUP BY liczbaDni;</pre>
<p>Alias ze spacją lub polskimi znakami bierzesz w odwrócone apostrofy: <code>AS &#96;Średnia cena&#96;</code>.</p>
<h2>HAVING: warunek na wyniku grupy</h2>
<pre>SELECT autor, COUNT(*) AS ile FROM ksiazki GROUP BY autor HAVING COUNT(*) &gt; 2;</pre>
<p>WHERE filtruje wiersze <em>przed</em> grupowaniem, HAVING wyniki <em>po</em> grupowaniu.</p>
<div class="box trap">
<ul>
  <li>Brak GROUP BY przy „dla każdego”: wtedy wychodzi jeden wiersz zamiast wielu.</li>
  <li>Alias inny niż w treści (wielkość liter też się liczy przy ocenie).</li>
  <li><code>ROUND(AVG(cena), 2)</code>, gdy treść każe zaokrąglić do 2 miejsc.</li>
</ul>
</div>
`,
  },

  'sql-join': {
    title: 'Relacje: JOIN … ON',
    short: '„Należy posłużyć się relacją” = JOIN.',
    body: `
<p class="lead">„Należy posłużyć się relacją” pojawiło się w 73 kwerendach i zawsze oznacza złączenie tabel.</p>
<h2>Wzór</h2>
<pre>SELECT tabela1.kolumna, tabela2.kolumna
FROM tabela1
JOIN tabela2 ON tabela1.klucz_obcy = tabela2.id;</pre>
<h2>Jak znaleźć warunek ON</h2>
<p>Na schemacie bazy relacja to linia między tabelami. W praktyce: w jednej tabeli jest kolumna typu <code>id_autor</code>, <code>autorzy_id</code>, <code>Wycieczki_id</code> (klucz obcy, w panelu oznaczony <span class="pill accent">FK</span>), a w drugiej jej <code>id</code> (klucz główny, <span class="pill soon">PK</span>).</p>
<h2>Przykład z arkusza</h2>
<p><em>„Zapytanie 2: wybierające pierwsze 15 rekordów, jedynie tytuł książki oraz odpowiadające mu id czytelnika i data oddania posortowane rosnąco według daty oddania. Należy posłużyć się relacją”</em> (czerwiec 2025, Biblioteka miejska)</p>
<pre>SELECT ksiazka.tytul, wypozyczenia.id_cz, wypozyczenia.data_odd
FROM ksiazka
JOIN wypozyczenia ON ksiazka.id = wypozyczenia.id_ks
ORDER BY wypozyczenia.data_odd ASC
LIMIT 15;</pre>
<h2>Trzy tabele</h2>
<pre>SELECT meble.nazwa, klienci.imie, klienci.nazwisko
FROM zakupy
JOIN meble ON zakupy.idMeble = meble.idMeble
JOIN klienci ON zakupy.idKlienci = klienci.idKlienci;</pre>
<h2>LEFT JOIN</h2>
<p>Gdy w wyniku mają być także wiersze bez dopasowania (np. autor bez żadnej książki, z liczbą 0), użyj <code>LEFT JOIN</code>.</p>
<div class="box tip"><p>Pisz zawsze <code>tabela.kolumna</code>. Gdy dwie tabele mają kolumnę o tej samej nazwie (np. <code>id</code>), bez nazwy tabeli dostaniesz błąd „ambiguous”.</p></div>
<div class="box trap"><p><strong>Pułapka:</strong> JOIN bez ON (albo zły ON) daje iloczyn wszystkich wierszy: wynik ma wtedy dziesiątki razy za dużo rekordów.</p></div>
`,
  },

  'sql-modyfikacja': {
    title: 'INSERT, UPDATE, DELETE',
    short: 'Wstawianie, zmiana i usuwanie rekordów.',
    body: `
<h2>INSERT: wstawianie</h2>
<pre>INSERT INTO czytelnicy (imie, nazwisko, kod) VALUES ('Ewa', 'Kowalska', '145321');</pre>
<p>„wartość klucza głównego nadawana automatycznie” znaczy: pomiń kolumnę <code>id</code> (albo wpisz <code>NULL</code>). Teksty i daty w apostrofach, liczby bez.</p>
<h2>UPDATE: zmiana</h2>
<pre>UPDATE pracownicy SET stanowisko = 'barman' WHERE stanowisko = 'kelner';
UPDATE opony SET cena = cena * 0.75 WHERE sezon = 'letnia';</pre>
<h2>DELETE: usuwanie</h2>
<pre>DELETE FROM zadania WHERE id_zadania = 2;</pre>
<div class="box trap">
<p><strong>Najgroźniejszy błąd:</strong> UPDATE albo DELETE bez WHERE zmienia albo usuwa <em>wszystkie</em> wiersze tabeli.</p>
</div>
<p>W tym trenerze po wykonaniu porównywana jest cała zawartość tabeli z tym, co dałaby poprawna kwerenda.</p>
`,
  },

  'sql-ddl': {
    title: 'Struktura tabel: ALTER, CREATE, DROP, VIEW',
    short: 'Dodawanie i zmiana kolumn, nowe tabele, widoki.',
    body: `
<h2>Dodanie kolumny</h2>
<pre>ALTER TABLE ksiazka ADD rezerwacja TINYINT(1) NOT NULL DEFAULT 0;
ALTER TABLE adresy ADD numerMieszkania INT AFTER numer;</pre>
<p><code>AFTER kolumna</code> wstawia nową kolumnę w konkretnym miejscu, <code>FIRST</code> na początku.</p>
<h2>Usunięcie, zmiana nazwy, zmiana typu</h2>
<pre>ALTER TABLE osoby DROP COLUMN telefon;
ALTER TABLE zapisy CHANGE Id_klienta Id_sluchacza INT;    -- nowa nazwa i typ
ALTER TABLE Potrawy MODIFY cena DECIMAL(6,2) NOT NULL;   -- tylko typ</pre>
<h2>Typy, które pojawiają się w treściach</h2>
<div class="table-wrap"><table class="data">
  <tr><th>Treść</th><th>Typ</th></tr>
  <tr><td>liczba całkowita</td><td>INT</td></tr>
  <tr><td>liczba całkowita bez znaku</td><td>INT UNSIGNED</td></tr>
  <tr><td>o długości 1 bajta</td><td>TINYINT</td></tr>
  <tr><td>tekst o długości 15 znaków</td><td>VARCHAR(15)</td></tr>
  <tr><td>długi tekst</td><td>TEXT</td></tr>
  <tr><td>data</td><td>DATE</td></tr>
  <tr><td>liczba z 2 miejscami po przecinku</td><td>DECIMAL(6,2)</td></tr>
</table></div>
<h2>Nowa tabela</h2>
<pre>CREATE TABLE klienci (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  imie VARCHAR(15),
  nazwisko VARCHAR(15),
  rabat INT
);</pre>
<h2>Usunięcie tabeli i widok</h2>
<pre>DROP TABLE uzytkownik;
CREATE VIEW pomieszczenie1 AS SELECT id_sciany, id_farby, liczba_puszek FROM malowanie WHERE id_pomieszczenia = 1;</pre>
<p>Ocena tutaj porównuje nazwy kolumn, ich kolejność, typy oraz NOT NULL i DEFAULT tam, gdzie wymaga ich treść.</p>
`,
  },

  'sql-uzytkownicy': {
    title: 'Użytkownicy i uprawnienia',
    short: 'CREATE USER i GRANT.',
    body: `
<h2>Tworzenie użytkownika</h2>
<pre>CREATE USER 'jan'@'localhost' IDENTIFIED BY 'janKowalski1@';</pre>
<p>Nazwa i hasło dokładnie jak w treści (wielkość liter ma znaczenie). <code>@'localhost'</code>, gdy treść mówi o serwerze localhost.</p>
<h2>Nadawanie uprawnień</h2>
<pre>GRANT SELECT, INSERT, UPDATE ON samochody.samochody TO 'jan'@'localhost';
GRANT ALL PRIVILEGES ON wycieczki.* TO 'Ewa'@'localhost';</pre>
<p><code>baza.tabela</code> to jedna tabela, <code>baza.*</code> to cała baza. Lista uprawnień jest po przecinku.</p>
<div class="box"><p>Na egzaminie wykonujesz to w phpMyAdmin i robisz zrzut. Tutaj nie ma serwera MySQL, więc odpowiedź jest sprawdzana przez rozbiór instrukcji: nazwa, host, hasło, uprawnienia, baza i tabela.</p></div>
`,
  },
};
