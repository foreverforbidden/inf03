<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Wynajem pokoi</title>
    <link rel="stylesheet" href="styl2.css">
</head>
<body>
    <header>
        <h1>Pensjonat pod dobrym humorem</h1>
    </header>
    <section>
        <a href="index.html">GŁÓWNA</a>
        <img src="1.jpg" alt="pokoje">
    </section>
    <section>
        <a href="cennik.php">CENNIK</a>
        <table>
<?php
$polaczenie = mysqli_connect("localhost", "root", "", "wynajem");
$wynik = mysqli_query($polaczenie, "SELECT * FROM pokoje;");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<tr><td>$wiersz[0]</td><td>$wiersz[1]</td><td>$wiersz[2]</td></tr>";
}
mysqli_close($polaczenie);
?>
        </table>
    </section>
    <section>
        <a href="kalkulator.html">KALKULATOR</a>
        <img src="3.jpg" alt="pokoje">
    </section>
    <footer>
        <p>Stronę opracował: 00000000000</p>
    </footer>
</body>
</html>
