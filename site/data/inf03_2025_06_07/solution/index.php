<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Biuro turystyczne</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <nav>
        <ul>
            <li><a href="wczasy.html">Wczasy</a></li>
            <li><a href="wycieczki.html">Wycieczki</a></li>
            <li><a href="allinclusive.html">All inclusive</a></li>
        </ul>
    </nav>
    <main>
        <aside>
            <h3>Twój cel wyprawy</h3>
            <form action="index.php" method="post">
                <label for="miejsce">Miejsce wycieczki</label>
                <select name="miejsce" id="miejsce">
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'wyprawy');
$wynik = mysqli_query($polaczenie, "SELECT nazwa FROM miejsca ORDER BY nazwa ASC");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<option value=\"" . htmlspecialchars($wiersz[0]) . "\">" . htmlspecialchars($wiersz[0]) . "</option>\n";
}
?>
                </select>
                <label for="doroslych">Ile dorosłych?</label>
                <input type="number" name="doroslych" id="doroslych"><br>
                <label for="dzieci">Ile dzieci?</label>
                <input type="number" name="dzieci" id="dzieci"><br>
                <label for="termin">Termin</label>
                <input type="date" name="termin" id="termin"><br>
                <input type="submit" value="Symulacja ceny">
            </form>
            <h4>Koszt wycieczki</h4>
<?php
if (isset($_POST['miejsce'], $_POST['doroslych'], $_POST['dzieci'], $_POST['termin'])) {
    $miejsce = mysqli_real_escape_string($polaczenie, $_POST['miejsce']);
    $wynik = mysqli_query($polaczenie, "SELECT cena FROM miejsca WHERE nazwa = '$miejsce'");
    $wiersz = mysqli_fetch_row($wynik);
    $dorosli = (int)$_POST['doroslych'];
    $dzieci = (int)$_POST['dzieci'];
    $wartosc = $dorosli * $wiersz[0] + $dzieci * $wiersz[0] / 2;
    echo "<p>W dniu: " . htmlspecialchars($_POST['termin']) . "</p>\n";
    echo "<p>" . $wartosc . " złotych</p>\n";
}
?>
        </aside>
        <section>
            <h3>Wycieczki</h3>
<?php
$wynik = mysqli_query($polaczenie, "SELECT nazwa, cena, link_obraz FROM miejsca WHERE link_obraz LIKE '0%'");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<div class=\"wycieczka\">";
    echo "<img src=\"" . $wiersz[2] . "\" alt=\"zdjęcie z wycieczki\">";
    echo "<h2>" . $wiersz[0] . "</h2>";
    echo "<p>" . $wiersz[1] . "</p>";
    echo "</div>\n";
}
mysqli_close($polaczenie);
?>
        </section>
    </main>
    <footer>
        <p>Autor: 00000000000</p>
    </footer>
</body>
</html>
