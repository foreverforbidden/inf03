<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Remonty</title>
<link rel="stylesheet" href="styl.css">
</head>
<body>
<header>
<h1>Malowanie i gipsowanie</h1>
</header>
<main>
<nav>
<a href="kontakt.html">Kontakt</a>
<a href="https://remonty.pl" target="_blank">Partnerzy</a>
</nav>
<aside>
<img src="tapeta_lewa.png" alt="usługi">
<img src="tapeta_prawa.png" alt="usługi">
<img src="tapeta_lewa.png" alt="usługi">
</aside>
<section>
<h2>Dla klientów</h2>
<form method="post">
<label for="liczba">Ilu co najmniej pracowników potrzebujesz?</label><br>
<input type="number" id="liczba" name="liczba" step="1">
<button type="submit">Szukaj firm</button>
</form>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'remonty');
if (isset($_POST['liczba']) && $_POST['liczba'] !== '') {
    $liczbaMin = (int)$_POST['liczba'];
    $wynik = mysqli_query($polaczenie, "SELECT nazwa_firmy, liczba_pracownikow FROM wykonawcy WHERE liczba_pracownikow >= $liczbaMin");
    while ($wiersz = mysqli_fetch_row($wynik)) {
        echo "<p>$wiersz[0], $wiersz[1] pracowników</p>";
    }
}
?>
</section>
<section>
<h2>Dla wykonawców</h2>
<form method="post">
<select name="miasto">
<?php
$wynik = mysqli_query($polaczenie, "SELECT DISTINCT miasto FROM klienci ORDER BY miasto ASC");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<option value=\"$wiersz[0]\">$wiersz[0]</option>";
}
?>
</select><br>
<input type="radio" name="rodzaj" value="malowanie" id="mal" checked><label for="mal">malowanie</label><br>
<input type="radio" name="rodzaj" value="gipsowanie" id="gip"><label for="gip">gipsowanie</label><br>
<button type="submit">Szukaj klientów</button>
</form>
<ul>
<?php
if (isset($_POST['miasto']) && isset($_POST['rodzaj'])) {
    $miasto = mysqli_real_escape_string($polaczenie, $_POST['miasto']);
    $rodzaj = mysqli_real_escape_string($polaczenie, $_POST['rodzaj']);
    $wynik = mysqli_query($polaczenie, "SELECT klienci.imie, zlecenia.cena FROM klienci JOIN zlecenia ON klienci.id_klienta = zlecenia.id_klienta WHERE klienci.miasto = '$miasto' AND zlecenia.rodzaj = '$rodzaj'");
    while ($wiersz = mysqli_fetch_row($wynik)) {
        echo "<li>$wiersz[0] - $wiersz[1]</li>";
    }
}
mysqli_close($polaczenie);
?>
</ul>
</section>
</main>
<footer>
<p><strong>Stronę wykonał: 00000000000</strong></p>
</footer>
</body>
</html>
