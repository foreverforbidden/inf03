<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Informacje o aktorze | KinoTEKA</title>
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
        <section id="aktorzy">
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'kino');
$idAktora = isset($_GET['id']) ? (int) $_GET['id'] : 0;
$imie = '';
$wynik = mysqli_query($polaczenie, "SELECT imie, nazwisko, plik_awatara FROM aktorzy WHERE id_aktora = $idAktora");
while ($aktor = mysqli_fetch_array($wynik)) {
    $imie = $aktor['imie'];
    $pelneImie = $aktor['imie'] . ' ' . $aktor['nazwisko'];
    echo '<div class="aktor-szczegoly">';
    echo '<img src="' . $aktor['plik_awatara'] . '" alt="' . $pelneImie . '" title="' . $pelneImie . '">';
    echo '<h1>' . $pelneImie . '</h1>';
    echo '</div>';
}
?>
        </section>
<?php
$wynikFilmy = mysqli_query($polaczenie, "SELECT filmy.id_filmu, filmy.tytul, filmy.rok_produkcji FROM filmy JOIN filmy_aktorzy ON filmy.id_filmu = filmy_aktorzy.id_filmu WHERE filmy_aktorzy.id_aktora = $idAktora");
$liczbaFilmow = mysqli_num_rows($wynikFilmy);
if ($liczbaFilmow == 0) {
    echo '<p>' . $imie . ' nie znajduje się na listach obsady znanych nam produkcji.</p>';
} else {
    echo '<p>' . $imie . ' znajduje się na listach obsady ' . $liczbaFilmow . ' znanych nam produkcji.</p>';
}
mysqli_close($polaczenie);
?>
    </main>
    <footer>
        <p>Autor: <strong>00000000000</strong></p>
    </footer>
</body>
</html>
