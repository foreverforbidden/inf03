<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Sprzedaż antyków</title>
<link rel="stylesheet" href="styl.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'antyki');
function wypiszMeble($polaczenie, $kategoria, $folder) {
    $zapytanie = "SELECT idMeble, nazwa, plik, styl, cena, opis FROM meble WHERE kategoria = $kategoria;";
    $wynik = mysqli_query($polaczenie, $zapytanie);
    while ($wiersz = mysqli_fetch_array($wynik)) {
        echo "<div class='mebel'>";
        echo "<div class='obraz'><img src='$folder/{$wiersz['plik']}' alt='mebel'></div>";
        echo "<div class='informacje'>";
        echo "<h3>{$wiersz['nazwa']}</h3>";
        echo "<h4>styl {$wiersz['styl']}</h4>";
        echo "<h3>CENA: {$wiersz['cena']} zł</h3>";
        echo "<form method='post'><button name='kup' value='{$wiersz['idMeble']}'>KUP</button></form>";
        echo "</div>";
        echo "<div class='opis'>{$wiersz['opis']}</div>";
        echo "</div>";
    }
}
?>
<header>
<h1>Najlepsze antyki w mieście</h1>
</header>
<main>
<section>
<h2>- Sofy -</h2>
<?php wypiszMeble($polaczenie, 1, 'sofy'); ?>
<h2>- Fotele -</h2>
<?php wypiszMeble($polaczenie, 2, 'fotele'); ?>
<h2>- Komody -</h2>
<?php wypiszMeble($polaczenie, 3, 'komody'); ?>
<?php
if (isset($_POST['kup'])) {
    $idMebla = (int)$_POST['kup'];
    mysqli_query($polaczenie, "INSERT INTO zakupy (idKlienci, idMeble, sztuk) VALUES (1, $idMebla, 1);");
}
?>
</section>
<aside>
<h2>Koszyk</h2>
<p>Zalogowano: Anna Kowalska</p>
<?php
$wynik = mysqli_query($polaczenie, "SELECT meble.nazwa, meble.cena FROM zakupy JOIN meble ON zakupy.idMeble = meble.idMeble WHERE zakupy.idKlienci = 1;");
$koszt = 0;
echo "<ol>";
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<li>{$wiersz['nazwa']}, cena: {$wiersz['cena']}</li>";
    $koszt += $wiersz['cena'];
}
echo "</ol>";
echo "<p>Koszt całkowity: $koszt</p>";
mysqli_close($polaczenie);
?>
</aside>
</main>
<footer>
<p>Stronę wykonał: 00000000000</p>
</footer>
</body>
</html>
