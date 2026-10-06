<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'terminarz');
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Zadania na lipiec</title>
    <link rel="stylesheet" href="styl6.css">
</head>
<body>
    <section id="baner1">
        <img src="logo1.png" alt="lipiec">
    </section>
    <section id="baner2">
        <h1>TERMINARZ</h1>
        <p>najbliższe zadania:
<?php
$zapytanie1 = "SELECT DISTINCT wpis FROM zadania WHERE dataZadania BETWEEN '2020-07-01' AND '2020-07-07' AND wpis <> ''";
$wynik1 = mysqli_query($polaczenie, $zapytanie1);
while ($wiersz = mysqli_fetch_row($wynik1)) {
    echo $wiersz[0] . '; ';
}
?>
        </p>
    </section>
    <section id="glowny">
<?php
$zapytanie2 = "SELECT dataZadania, wpis FROM zadania WHERE miesiac = 'lipiec'";
$wynik2 = mysqli_query($polaczenie, $zapytanie2);
while ($wiersz = mysqli_fetch_row($wynik2)) {
    echo "<section class=\"blok\">\n";
    echo "<h6>" . $wiersz[0] . "</h6>\n";
    echo "<p>" . $wiersz[1] . "</p>\n";
    echo "</section>\n";
}
mysqli_close($polaczenie);
?>
    </section>
    <section id="stopka">
        <a href="sierpien.html">Terminarz na sierpień</a>
        <p>Stronę wykonał: 00000000000</p>
    </section>
</body>
</html>
