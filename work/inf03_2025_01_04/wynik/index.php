<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Obuwie</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<header><h1>Obuwie męskie</h1></header>
<main>
<form action="zamow.php" method="post">
<label for="model">Model: </label>
<select class="kontrolka" name="model" id="model">
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'obuwie');
$wynikModeli = mysqli_query($polaczenie, "SELECT model FROM produkt;");
while ($wiersz = mysqli_fetch_row($wynikModeli)) {
    echo "<option value=\"$wiersz[0]\">$wiersz[0]</option>";
}
?>
</select>
<label for="rozmiar">Rozmiar: </label>
<select class="kontrolka" name="rozmiar" id="rozmiar">
<?php for ($r = 40; $r <= 43; $r++) { echo "<option value=\"$r\">$r</option>"; } ?>
</select>
<label for="liczba">Liczba par: </label>
<input class="kontrolka" type="number" name="liczba" id="liczba">
<button class="kontrolka" type="submit">Zamów</button>
</form>
<?php
$wynikProduktow = mysqli_query($polaczenie, "SELECT buty.model, buty.nazwa, buty.cena, produkt.nazwa_pliku FROM buty JOIN produkt ON buty.model = produkt.model;");
while ($produkt = mysqli_fetch_array($wynikProduktow)) {
    echo "<div class=\"buty\">";
    echo "<img src=\"{$produkt['nazwa_pliku']}\" alt=\"but męski\">";
    echo "<h2>{$produkt['nazwa']}</h2>";
    echo "<h5>Model: {$produkt['model']}</h5>";
    echo "<h4>Cena: {$produkt['cena']}</h4>";
    echo "</div>";
}
mysqli_close($polaczenie);
?>
</main>
<footer><p>Autor strony: 00000000000</p></footer>
</body>
</html>
