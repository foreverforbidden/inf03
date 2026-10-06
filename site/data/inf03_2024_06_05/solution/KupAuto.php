<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Komis aut</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'kupauto');
?>
<header>
    <h1><em>KupAuto!</em> Internetowy Komis Samochodowy</h1>
</header>
<main>
<?php
$wynikOferty = mysqli_query($polaczenie, "SELECT model, rocznik, przebieg, paliwo, cena, zdjecie FROM samochody WHERE id = 10;");
while ($oferta = mysqli_fetch_array($wynikOferty)) {
    echo "<img src='" . $oferta['zdjecie'] . "' alt='oferta dnia'>";
    echo "<h4>Oferta Dnia: Toyota " . $oferta['model'] . "</h4>";
    echo "<p>Rocznik: " . $oferta['rocznik'] . ", przebieg: " . $oferta['przebieg'] . ", rodzaj paliwa: " . $oferta['paliwo'] . "</p>";
    echo "<h4>Cena: " . $oferta['cena'] . "</h4>";
}
?>
</main>
<main>
    <h2>Oferty Wyróżnione</h2>
<?php
$wynikWyrozniony = mysqli_query($polaczenie, "SELECT marki.nazwa, samochody.model, samochody.rocznik, samochody.cena, samochody.zdjecie FROM samochody JOIN marki ON samochody.marki_id = marki.id WHERE samochody.wyrozniony = 1 LIMIT 4;");
while ($wyrozniony = mysqli_fetch_array($wynikWyrozniony)) {
    echo "<div class='oferta'>";
    echo "<img src='" . $wyrozniony['zdjecie'] . "' alt='" . $wyrozniony['model'] . "'>";
    echo "<h4>" . $wyrozniony['nazwa'] . " " . $wyrozniony['model'] . "</h4>";
    echo "<p>Rocznik: " . $wyrozniony['rocznik'] . "</p>";
    echo "<h4>Cena: " . $wyrozniony['cena'] . "</h4>";
    echo "</div>";
}
?>
</main>
<main>
    <h2>Wybierz markę</h2>
    <form method="post" action="KupAuto.php">
        <select name="marka">
<?php
$wynikMarki = mysqli_query($polaczenie, "SELECT nazwa FROM marki;");
while ($marka = mysqli_fetch_array($wynikMarki)) {
    echo "<option value='" . $marka['nazwa'] . "'>" . $marka['nazwa'] . "</option>";
}
?>
        </select>
        <input type="submit" value="Wyszukaj">
    </form>
<?php
if (isset($_POST['marka'])) {
    $wybranaMarka = mysqli_real_escape_string($polaczenie, $_POST['marka']);
    $wynikMarka = mysqli_query($polaczenie, "SELECT marki.nazwa, samochody.model, samochody.cena, samochody.zdjecie FROM samochody JOIN marki ON samochody.marki_id = marki.id WHERE marki.nazwa = '$wybranaMarka';");
    while ($samochod = mysqli_fetch_array($wynikMarka)) {
        echo "<div class='oferta'>";
        echo "<img src='" . $samochod['zdjecie'] . "' alt='" . $samochod['model'] . "'>";
        echo "<h4>" . $samochod['nazwa'] . " " . $samochod['model'] . "</h4>";
        echo "<h4>Cena: " . $samochod['cena'] . "</h4>";
        echo "</div>";
    }
}
mysqli_close($polaczenie);
?>
</main>
<footer>
    <p>Stronę wykonał: 00000000000</p>
    <p><a href="http://firmy.pl/komis">Znajdź nas także</a></p>
</footer>
</body>
</html>
