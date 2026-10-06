<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Poznaj Europę</title>
    <link rel="stylesheet" href="styl9.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'podroze');
?>
<section id="baner">
    <h1>BIURO PODRÓŻY</h1>
</section>
<section id="lewy">
    <h2>Promocje</h2>
    <table>
        <tr><td>Warszawa</td><td>od 600 zł</td></tr>
        <tr><td>Wenecja</td><td>od 1200 zł</td></tr>
        <tr><td>Paryż</td><td>od 1200 zł</td></tr>
    </table>
</section>
<section id="srodkowy">
    <h2>W tym roku jedziemy do...</h2>
<?php
$wynikZdjec = mysqli_query($polaczenie, 'SELECT nazwaPliku, podpis FROM zdjecia ORDER BY podpis ASC;');
while ($zdjecie = mysqli_fetch_row($wynikZdjec)) {
    echo '<img src="' . $zdjecie[0] . '" alt="' . $zdjecie[1] . '" title="' . $zdjecie[1] . '">';
}
?>
</section>
<section id="prawy">
    <h2>Kontakt</h2>
    <a href="mailto:biuro@wycieczki.pl">napisz do nas</a>
    <p>telefon: 444555666</p>
</section>
<section id="dane">
    <h3>W poprzednich latach byliśmy...</h3>
    <ol>
<?php
$wynikWycieczek = mysqli_query($polaczenie, 'SELECT cel, dataWyjazdu FROM wycieczki WHERE dostepna = 0;');
while ($wycieczka = mysqli_fetch_row($wynikWycieczek)) {
    echo '<li>Dnia ' . $wycieczka[1] . ' pojechaliśmy do ' . $wycieczka[0] . '</li>';
}
mysqli_close($polaczenie);
?>
    </ol>
</section>
<footer>
    <p>Stronę wykonał: 00000000000</p>
</footer>
</body>
</html>
