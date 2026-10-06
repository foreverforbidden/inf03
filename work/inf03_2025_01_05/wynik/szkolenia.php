<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Firma szkoleniowa</title>
<link rel="stylesheet" href="style.css">
</head>
<body>
<div id="kontener">
<header><img src="baner.jpg" alt="Szkolenia"></header>
<nav><ul><li><a href="index.html">Strona główna</a></li><li><a href="szkolenia.php">Szkolenia</a></li></ul></nav>
<main>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'firma');
$wynik = mysqli_query($polaczenie, "SELECT Data, Temat FROM szkolenia ORDER BY Data ASC");
$plik = fopen('harmonogram.txt', 'w');
while ($wiersz = mysqli_fetch_row($wynik)) {
    $linia = $wiersz[0] . ' ' . $wiersz[1];
    echo "<p>$linia</p>\n";
    fwrite($plik, $linia . "\n");
}
fclose($plik);
mysqli_close($polaczenie);
?>
</main>
<footer><h2>Firma szkoleniowa, ul. Główna 1, 23-456 Warszawa</h2><p>Autor: 00000000000</p></footer>
</div>
</body>
</html>
