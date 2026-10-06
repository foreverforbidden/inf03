<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Gry komputerowe</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'gry');
mysqli_set_charset($polaczenie, 'utf8');
?>
<header>
    <h1>Ranking gier komputerowych</h1>
</header>
<section id="lewa">
    <h3>Top 5 gier w tym miesiącu</h3>
    <ul>
<?php
$wynik = mysqli_query($polaczenie, "SELECT nazwa, punkty FROM gry ORDER BY punkty DESC LIMIT 5");
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<li>" . $wiersz['nazwa'] . " <span class=\"punkty\">" . $wiersz['punkty'] . "</span></li>";
}
?>
    </ul>
    <h3>Nasz sklep</h3>
    <a href="http://sklep.gry.pl">Tu kupisz gry</a>
    <h3>Stronę wykonał</h3>
    <p>00000000000</p>
</section>
<section id="srodek">
<?php
$wynik = mysqli_query($polaczenie, "SELECT id, nazwa, zdjecie FROM gry");
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<div class=\"gra\">";
    echo "<img src=\"" . $wiersz['zdjecie'] . "\" alt=\"" . $wiersz['nazwa'] . "\" title=\"" . $wiersz['id'] . "\">";
    echo "<p>" . $wiersz['nazwa'] . "</p>";
    echo "</div>";
}
?>
</section>
<section id="prawa">
    <h3>Dodaj nową grę</h3>
    <form method="post" action="gry.php">
        <label for="nazwa">nazwa</label><br>
        <input type="text" name="nazwa" id="nazwa"><br>
        <label for="opis">opis</label><br>
        <input type="text" name="opis" id="opis"><br>
        <label for="cena">cena</label><br>
        <input type="number" name="cena" id="cena"><br>
        <label for="zdjecie">zdjęcie</label><br>
        <input type="text" name="zdjecie" id="zdjecie"><br>
        <input type="submit" value="DODAJ">
    </form>
<?php
if (isset($_POST['nazwa']) && $_POST['nazwa'] != '') {
    $nazwa = mysqli_real_escape_string($polaczenie, $_POST['nazwa']);
    $opis = mysqli_real_escape_string($polaczenie, $_POST['opis']);
    $cena = (float) $_POST['cena'];
    $zdjecie = mysqli_real_escape_string($polaczenie, $_POST['zdjecie']);
    mysqli_query($polaczenie, "INSERT INTO gry (nazwa, opis, punkty, cena, zdjecie) VALUES ('$nazwa', '$opis', 0, $cena, '$zdjecie')");
}
?>
</section>
<footer>
    <form method="post" action="gry.php">
        <input type="text" name="id">
        <input type="submit" value="Pokaż opis">
    </form>
<?php
if (isset($_POST['id']) && $_POST['id'] != '') {
    $id = (int) $_POST['id'];
    $wynik = mysqli_query($polaczenie, "SELECT nazwa, LEFT(opis, 100) AS opis, punkty, cena FROM gry WHERE id = $id");
    while ($wiersz = mysqli_fetch_row($wynik)) {
        echo "<h2>$wiersz[0], $wiersz[2] punktów, $wiersz[3] zł</h2>";
        echo "<p>$wiersz[1]</p>";
    }
}
mysqli_close($polaczenie);
?>
</footer>
</body>
</html>
