<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'wazenietirow');
mysqli_query($polaczenie, "INSERT INTO wagi (lokalizacje_id, waga, rejestracja, dzien, czas) VALUES (5, FLOOR(1 + RAND() * 10), 'DW12345', CURDATE(), CURTIME());");
header("Refresh: 10");
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Ważenie samochodów ciężarowych</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header id="baner1">
        <h1>Ważenie pojazdów we Wrocławiu</h1>
    </header>
    <header id="baner2">
        <img src="obraz1.png" alt="waga">
    </header>
    <aside id="lewy">
        <h2>Lokalizacje wag</h2>
        <ol>
<?php
$wynikUlic = mysqli_query($polaczenie, "SELECT ulica FROM lokalizacje;");
while ($wierszUlicy = mysqli_fetch_row($wynikUlic)) {
    echo "<li>ulica " . $wierszUlicy[0] . "</li>\n";
}
?>
        </ol>
        <h2>Kontakt</h2>
        <a href="mailto:wazenie@wroclaw.pl">napisz</a>
    </aside>
    <main id="srodkowy">
        <h2>Alerty</h2>
        <table>
            <tr><th>rejestracja</th><th>ulica</th><th>waga</th><th>dzień</th><th>czas</th></tr>
<?php
$wynikAlertow = mysqli_query($polaczenie, "SELECT wagi.rejestracja, lokalizacje.ulica, wagi.waga, wagi.dzien, wagi.czas FROM wagi JOIN lokalizacje ON wagi.lokalizacje_id = lokalizacje.id WHERE wagi.waga > 5;");
while ($wierszAlertu = mysqli_fetch_row($wynikAlertow)) {
    echo "<tr>";
    foreach ($wierszAlertu as $wartosc) {
        echo "<td>" . $wartosc . "</td>";
    }
    echo "</tr>\n";
}
mysqli_close($polaczenie);
?>
        </table>
    </main>
    <aside id="prawy">
        <img id="obraz2" src="obraz2.jpg" alt="tir">
    </aside>
    <footer>
        <p>Stronę wykonał: 00000000000</p>
    </footer>
</body>
</html>
