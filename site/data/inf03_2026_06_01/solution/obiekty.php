<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Islandia</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1><a href="islandia.php">Zwiedzaj Islandię</a></h1>
    </header>
    <aside>
        <h3>Do zwiedzania</h3>
        <ul>
            <li>Wodospady:
                <ol>
<?php
$polaczenie = mysqli_connect("localhost", "root", "", "islandia");
$zapytanie = "SELECT nazwa FROM obiekty WHERE panstwo = 'Islandia' AND idRodzaj = 10;";
$wynik = mysqli_query($polaczenie, $zapytanie);
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<li>" . $wiersz["nazwa"] . "</li>";
}
mysqli_close($polaczenie);
?>
                </ol>
            </li>
            <li>Siedliska zwierząt:
                <ol>
<?php
$polaczenie = mysqli_connect("localhost", "root", "", "islandia");
$zapytanie = "SELECT nazwa FROM obiekty WHERE panstwo = 'Islandia' AND idRodzaj = 14;";
$wynik = mysqli_query($polaczenie, $zapytanie);
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<li>" . $wiersz["nazwa"] . "</li>";
}
mysqli_close($polaczenie);
?>
                </ol>
            </li>
        </ul>
    </aside>
    <main>
        <h2>Opis miejsca</h2>
        <section>
<?php
$polaczenie = mysqli_connect("localhost", "root", "", "islandia");
$idObiektu = isset($_GET["id"]) ? (int) $_GET["id"] : 0;
$zapytanie = "SELECT obiekty.plik, obiekty.nazwa, obiekty.nazwaCechy, obiekty.wartoscCechy, obiekty.opis, rodzaje.rodzaj FROM obiekty JOIN rodzaje ON obiekty.idRodzaj = rodzaje.idRodzaj WHERE obiekty.idObiekt = $idObiektu;";
$wynik = mysqli_query($polaczenie, $zapytanie);
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<img src=\"" . $wiersz["plik"] . "\" alt=\"" . $wiersz["nazwa"] . "\">";
    echo "<h2>" . $wiersz["nazwa"] . "</h2>";
    echo "<h3>" . $wiersz["rodzaj"] . "</h3>";
    echo "<p>" . $wiersz["nazwaCechy"] . ": " . $wiersz["wartoscCechy"] . "</p>";
    echo "<p>" . $wiersz["opis"] . "</p>";
}
mysqli_close($polaczenie);
?>
        </section>
    </main>
    <footer>
        <hr>
        <p>Autor: 00000000000</p>
    </footer>
</body>
</html>
