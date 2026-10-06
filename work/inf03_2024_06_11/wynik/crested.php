<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Hodowla świnek morskich</title>
<link rel="stylesheet" href="styl.css">
</head>
<body>
<header>
<h1>Hodowla świnek morskich - zamów świnkowe maluszki</h1>
</header>
<nav>
<a href="peruwianka.php">Rasa Peruwianka</a>
<a href="american.php">Rasa American</a>
<a href="crested.php">Rasa Crested</a>
</nav>
<aside>
<h3>Poznaj wszystkie rasy świnek morskich</h3>
<ol>
<?php
$connection = mysqli_connect('localhost', 'root', '', 'hodowla');
$breedsQuery = "SELECT rasa FROM rasy;";
$breedsResult = mysqli_query($connection, $breedsQuery);
while ($breedRow = mysqli_fetch_row($breedsResult)) {
    echo "<li>" . $breedRow[0] . "</li>";
}
?>
</ol>
</aside>
<main>
<img src="crested.jpg" alt="Świnka morska rasy crested">
<?php
$litterQuery = "SELECT DISTINCT swinki.data_ur, swinki.miot, rasy.rasa FROM swinki JOIN rasy ON swinki.rasy_id = rasy.id WHERE rasy.id = 7;";
$litterResult = mysqli_query($connection, $litterQuery);
while ($litterRow = mysqli_fetch_row($litterResult)) {
    echo "<h2>Rasa: " . $litterRow[2] . "</h2>";
    echo "<p>Data urodzenia: " . $litterRow[0] . "</p>";
    echo "<p>Oznaczenie miotu: " . $litterRow[1] . "</p>";
}
?>
<hr>
<h2>Świnki w tym miocie</h2>
<?php
$guineaPigsQuery = "SELECT imie, cena, opis FROM swinki WHERE rasy_id = 7;";
$guineaPigsResult = mysqli_query($connection, $guineaPigsQuery);
while ($guineaPigRow = mysqli_fetch_row($guineaPigsResult)) {
    echo "<h3>" . $guineaPigRow[0] . " - " . $guineaPigRow[1] . " zł</h3>";
    echo "<p>" . $guineaPigRow[2] . "</p>";
}
mysqli_close($connection);
?>
</main>
<footer>
<p>Stronę wykonał: 00000000000</p>
</footer>
</body>
</html>
