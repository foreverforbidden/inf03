<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Lista aktorów | KinoTEKA</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header id="baner1">
        <h2><a href="index.php">KinoTEKA</a></h2>
    </header>
    <header id="baner2">
        <p><em>W naszej bazie znajdują się najlepsi aktorzy</em></p>
    </header>
    <main>
        <h1>Najlepsi aktorzy tylko w naszym kinie</h1>
        <section id="aktorzy">
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'kino');
$wynik = mysqli_query($polaczenie, "SELECT * FROM aktorzy ORDER BY nazwisko ASC, imie ASC");
while ($aktor = mysqli_fetch_array($wynik)) {
    $pelneImie = $aktor['imie'] . ' ' . $aktor['nazwisko'];
    echo '<a href="aktor.php?id=' . $aktor['id_aktora'] . '"><div class="aktor">';
    echo '<img src="' . $aktor['plik_awatara'] . '" alt="' . $pelneImie . '" title="' . $pelneImie . '">';
    echo '<p>' . $pelneImie . '</p>';
    echo '</div></a>';
}
mysqli_close($polaczenie);
?>
        </section>
    </main>
    <footer>
        <p>Autor: <strong>00000000000</strong></p>
    </footer>
</body>
</html>
