<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>KOŁO SZACHOWE</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h2>Koło szachowe <em>gambit piona</em></h2>
    </header>
    <aside>
        <h4>Polecane linki</h4>
        <ul>
            <li><a href="kw1.png">kwerenda1</a></li>
            <li><a href="kw2.png">kwerenda2</a></li>
            <li><a href="kw3.png">kwerenda3</a></li>
            <li><a href="kw4.png">kwerenda4</a></li>
        </ul>
        <img src="logo.png" alt="Logo koła">
    </aside>
    <main>
        <h3>Najlepsi gracze naszego koła</h3>
        <table>
            <tr><th>Pozycja</th><th>Pseudonim</th><th>Tytuł</th><th>Ranking</th><th>Klasa</th></tr>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'szachy');
$zapytanie = "SELECT pseudonim, tytul, ranking, klasa FROM zawodnicy WHERE ranking > 2787 ORDER BY ranking DESC;";
$wynik = mysqli_query($polaczenie, $zapytanie);
$numer = 1;
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<tr><td>$numer</td><td>$wiersz[0]</td><td>$wiersz[1]</td><td>$wiersz[2]</td><td>$wiersz[3]</td></tr>\n";
    $numer++;
}
?>
        </table>
        <form method="post" action="szachy.php">
            <input type="submit" name="losuj" value="Losuj nową parę graczy">
        </form>
<?php
if (isset($_POST['losuj'])) {
    $zapytanieLosowe = "SELECT pseudonim, klasa FROM zawodnicy ORDER BY RAND() LIMIT 2;";
    $wynikLosowy = mysqli_query($polaczenie, $zapytanieLosowe);
    echo "<h4>";
    $teksty = [];
    while ($gracz = mysqli_fetch_row($wynikLosowy)) {
        $teksty[] = $gracz[0] . " " . $gracz[1];
    }
    echo implode(" ", $teksty);
    echo "</h4>\n";
}
mysqli_close($polaczenie);
?>
        <p>Legenda: AM - Absolutny Mistrz, SM - Szkolny Mistrz, PM - Mistrz Poziomu, KM - Mistrz Klasowy</p>
    </main>
    <footer>
        <p>Stronę wykonał: 00000000000</p>
    </footer>
</body>
</html>
