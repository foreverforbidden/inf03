<?php
header('refresh: 10;');
$polaczenie = mysqli_connect('localhost', 'root', '', 'opony');
mysqli_set_charset($polaczenie, 'utf8');
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>OPONY</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
<main>
    <aside>
<?php
$wynik1 = mysqli_query($polaczenie, "SELECT * FROM opony ORDER BY cena ASC LIMIT 10;");
while ($opona = mysqli_fetch_array($wynik1)) {
    if ($opona['sezon'] == 'letnia') {
        $obraz = 'lato.png';
    } elseif ($opona['sezon'] == 'zimowa') {
        $obraz = 'zima.png';
    } else {
        $obraz = 'uniwer.png';
    }
    echo "<div class=\"opona\">";
    echo "<img src=\"$obraz\" alt=\"Opona\">";
    echo "<h4>Opona: " . $opona['producent'] . " " . $opona['model'] . "</h4>";
    echo "<h3>Cena: " . $opona['cena'] . "</h3>";
    echo "</div>";
}
?>
        <p><a href="https://opona.pl/">więcej ofert</a></p>
    </aside>
    <section id="sekcja1">
        <img src="opona.png" alt="Opona">
        <h2>Opona dnia</h2>
<?php
$wynik2 = mysqli_query($polaczenie, "SELECT producent, model, sezon, cena FROM opony WHERE nr_kat = 9;");
while ($wiersz = mysqli_fetch_array($wynik2)) {
    echo "<h2>" . $wiersz['producent'] . " model " . $wiersz['model'] . "</h2>";
    echo "<h2>Sezon: " . $wiersz['sezon'] . "</h2>";
    echo "<h2>Tylko " . $wiersz['cena'] . " zł!</h2>";
}
?>
    </section>
    <section id="sekcja2">
        <h2>Najnowsze zamówienie</h2>
<?php
$wynik3 = mysqli_query($polaczenie, "SELECT zamowienie.id_zam, zamowienie.ilosc, opony.model, opony.cena FROM zamowienie JOIN opony ON zamowienie.nr_kat = opony.nr_kat ORDER BY RAND() LIMIT 1;");
while ($zamowienie = mysqli_fetch_array($wynik3)) {
    $wartosc = $zamowienie['ilosc'] * $zamowienie['cena'];
    echo "<h2>" . $zamowienie['id_zam'] . " " . $zamowienie['ilosc'] . " sztuki modelu " . $zamowienie['model'] . "</h2>";
    echo "<h2>Wartość zamówienia " . $wartosc . " zł</h2>";
}
mysqli_close($polaczenie);
?>
    </section>
</main>
<footer>
    <p>Stronę wykonał: 00000000000</p>
</footer>
</body>
</html>
