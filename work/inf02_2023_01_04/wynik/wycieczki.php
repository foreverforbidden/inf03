<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Wycieczki po Europie</title>
    <link rel="stylesheet" href="styl4.css">
</head>
<body>
    <section id="baner">
        <h1>BIURO TURYSTYCZNE</h1>
    </section>
    <section id="dane">
        <h3>Wycieczki, na które są wolne miejsca</h3>
        <ul>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'biuro');
$wynik = mysqli_query($polaczenie, "SELECT id, dataWyjazdu, cel, cena FROM wycieczki WHERE dostepna = TRUE;");
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<li>" . $wiersz['id'] . ". dnia " . $wiersz['dataWyjazdu'] . " jedziemy do " . $wiersz['cel'] . ", cena: " . $wiersz['cena'] . "</li>\n";
}
?>
        </ul>
    </section>
    <section id="lewy">
        <h2>Bestselery</h2>
        <table>
            <tr><td>Wenecja</td><td>kwiecień</td></tr>
            <tr><td>Londyn</td><td>lipiec</td></tr>
            <tr><td>Rzym</td><td>wrzesień</td></tr>
        </table>
    </section>
    <section id="srodkowy">
        <h2>Nasze zdjęcia</h2>
<?php
$wynik = mysqli_query($polaczenie, "SELECT nazwaPliku, podpis FROM zdjecia ORDER BY podpis DESC;");
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<img src=\"" . $wiersz['nazwaPliku'] . "\" alt=\"" . $wiersz['podpis'] . "\">\n";
}
mysqli_close($polaczenie);
?>
    </section>
    <section id="prawy">
        <h2>Skontaktuj się</h2>
        <a href="mailto:turysta@wycieczki.pl">napisz do nas</a>
        <p>telefon: 111222333</p>
    </section>
    <section id="stopka">
        <p>Stronę wykonał: 00000000000</p>
    </section>
</body>
</html>
