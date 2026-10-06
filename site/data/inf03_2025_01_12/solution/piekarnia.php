<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>PIEKARNIA</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <img src="wypieki.png" alt="Produkty naszej piekarni">
    <nav>
        <a href="kw1.png">KWERENDA1</a>
        <a href="kw2.png">KWERENDA2</a>
        <a href="kw3.png">KWERENDA3</a>
        <a href="kw4.png">KWERENDA4</a>
    </nav>
    <header>
        <h1>WITAMY</h1>
        <h4>NA STRONIE PIEKARNI</h4>
        <p>Od 31 lat oferujemy najwyższej jakości pieczywo. Naturalnie świeże, naturalnie smaczne. Pieczemy wyłącznie wypieki na naturalnym zakwasie bez polepszaczy i zagęstników. Korzystamy wyłącznie z najlepszych ziaren pochodzących z ekologicznych upraw położonych w rejonach zgierskim i ozorkowskim.</p>
    </header>
    <main>
        <h4>Wybierz rodzaj wypieków:</h4>
        <form method="post" action="piekarnia.php">
            <select name="rodzaj">
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'piekarnia');
mysqli_set_charset($polaczenie, 'utf8');
$wynikRodzajow = mysqli_query($polaczenie, "SELECT DISTINCT Rodzaj FROM wyroby ORDER BY Rodzaj DESC");
while ($wiersz = mysqli_fetch_row($wynikRodzajow)) {
    echo "                <option value=\"" . htmlspecialchars($wiersz[0]) . "\">" . htmlspecialchars($wiersz[0]) . "</option>\n";
}
?>
            </select>
            <input type="submit" value="Wybierz">
        </form>
        <table>
            <tr><th>Rodzaj</th><th>Nazwa</th><th>Gramatura</th><th>Cena</th></tr>
<?php
if (isset($_POST['rodzaj'])) {
    $wybranyRodzaj = mysqli_real_escape_string($polaczenie, $_POST['rodzaj']);
    $wynikWyrobow = mysqli_query($polaczenie, "SELECT Rodzaj, Nazwa, Gramatura, Cena FROM wyroby WHERE Rodzaj = '$wybranyRodzaj'");
    while ($wiersz = mysqli_fetch_row($wynikWyrobow)) {
        echo "            <tr><td>$wiersz[0]</td><td>$wiersz[1]</td><td>$wiersz[2]</td><td>$wiersz[3]</td></tr>\n";
    }
}
mysqli_close($polaczenie);
?>
        </table>
    </main>
    <footer>
        <p>AUTOR: 00000000000</p>
        <p>Data: 30.03.2025</p>
    </footer>
</body>
</html>
