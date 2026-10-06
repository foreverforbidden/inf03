<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Przychodnia Medica</title>
<link rel="icon" href="obraz2.png" type="image/png">
<link rel="stylesheet" href="styl.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'medica');
function wypiszCechy($polaczenie, $idAbonamentu) {
    $zapytanie = "SELECT abonamenty.nazwa, cechy.cecha FROM abonamenty JOIN szczegolyabonamentu ON abonamenty.id = szczegolyabonamentu.Abonamenty_id JOIN cechy ON cechy.id = szczegolyabonamentu.Cechy_id WHERE abonamenty.id = $idAbonamentu;";
    $wynik = mysqli_query($polaczenie, $zapytanie);
    while ($wiersz = mysqli_fetch_array($wynik)) {
        echo "<li>" . $wiersz['cecha'] . "</li>";
    }
}
?>
<header>
<h1>Abonamenty w przychodni Medica</h1>
</header>
<article>
<?php
$wynik = mysqli_query($polaczenie, "SELECT nazwa, cena, opis FROM abonamenty;");
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<h3>Pakiet " . $wiersz['nazwa'] . " - cena " . $wiersz['cena'] . " zł</h3>";
    echo "<p>" . $wiersz['opis'] . "</p>";
}
?>
<a href="opis.html">Dowiedz się więcej</a>
</article>
<main>
<section>
<h2>Standardowy</h2>
<ul><?php wypiszCechy($polaczenie, 1); ?></ul>
</section>
<section>
<h2>Premium</h2>
<ul><?php wypiszCechy($polaczenie, 2); ?></ul>
</section>
<section>
<h2>Dziecko</h2>
<ul><?php wypiszCechy($polaczenie, 3); ?></ul>
</section>
</main>
<footer>
<p><img src="obraz2.png" alt="przychodnia">Stronę przygotował: 00000000000</p>
</footer>
<?php mysqli_close($polaczenie); ?>
</body>
</html>
