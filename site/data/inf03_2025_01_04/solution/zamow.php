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
<h2>Zamówienie</h2>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'obuwie');
if (isset($_POST['model'], $_POST['rozmiar'], $_POST['liczba'])) {
$model = mysqli_real_escape_string($polaczenie, $_POST['model']);
$rozmiar = $_POST['rozmiar'];
$liczbaPar = (int)$_POST['liczba'];
$wynik = mysqli_query($polaczenie, "SELECT buty.nazwa, buty.cena, produkt.kolor, produkt.kod_produktu, produkt.material, produkt.nazwa_pliku FROM buty JOIN produkt ON buty.model = produkt.model WHERE buty.model = '$model';");
if ($wiersz = mysqli_fetch_array($wynik)) {
    $wartosc = $liczbaPar * $wiersz['cena'];
    echo "<img src=\"{$wiersz['nazwa_pliku']}\" alt=\"but męski\">";
    echo "<h2>{$wiersz['nazwa']}</h2>";
    echo "<p>cena za $liczbaPar par: $wartosc zł</p>";
    echo "<p>Szczegóły produktu: {$wiersz['kolor']}, {$wiersz['material']}</p>";
    echo "<p>Rozmiar: " . htmlspecialchars($rozmiar) . "</p>";
}
}
mysqli_close($polaczenie);
?>
<a href="index.php">Strona główna</a>
</main>
<footer><p>Autor strony: 00000000000</p></footer>
</body>
</html>
