<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Konfigurator samochodów</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'samochody');
?>
    <header>
        <h1>Serwis konfiguracji samochodów</h1>
    </header>
    <nav>
        <h2>Samochody</h2><h2>Konfigurator</h2><h2>Kontakt</h2>
    </nav>
    <main>
        <section id="lewa">
            <table>
<?php
$wynik = mysqli_query($polaczenie, "SELECT pojazdy.marka, pojazdy.model, pojazdy.cena, kolory.nazwa, kolory.doplata FROM pojazdy INNER JOIN kolory ON pojazdy.kolor = kolory.id WHERE pojazdy.model = 'alfa'");
while ($wiersz = mysqli_fetch_array($wynik)) {
    $cenaCalkowita = $wiersz['cena'] + $wiersz['doplata'];
    echo "<tr><td>{$wiersz['marka']}</td><td>{$wiersz['model']}</td><td>{$wiersz['nazwa']}</td><td>$cenaCalkowita</td></tr>\n";
}
?>
            </table>
        </section>
        <section id="srodkowa">
            <table>
                <tr><th colspan="2">Konfiguracja</th><th>Cena</th></tr>
                <tr><td colspan="3"><img src="a1.jpg" alt="Konfiguracja 1"></td></tr>
<?php
$wynik = mysqli_query($polaczenie, "SELECT marka, model, cena FROM pojazdy ORDER BY RAND() LIMIT 2");
$numer = 0;
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<tr><td>Marka</td><td>{$wiersz['marka']}</td><td rowspan=\"2\">{$wiersz['cena']}</td></tr>\n";
    echo "<tr><td>Model</td><td>{$wiersz['model']}</td></tr>\n";
    if ($numer == 0) {
        echo "<tr><td colspan=\"3\"><img src=\"a2.jpg\" alt=\"Konfiguracja 2\"></td></tr>\n";
    }
    $numer++;
}
?>
            </table>
        </section>
        <section id="prawa">
            <h3>111 222 444</h3>
            <img src="a3.png" alt="Samochód">
        </section>
    </main>
    <footer>
        <p>Stronę wykonał: 00000000000</p>
    </footer>
<?php
mysqli_close($polaczenie);
?>
</body>
</html>
