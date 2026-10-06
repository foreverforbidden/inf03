<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Hurtownia szkolna</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>Hurtownia z najlepszymi cenami</h1>
    </header>
    <section id="lewy">
        <h2>Nasze ceny</h2>
        <table>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'sklep');
$zapytanie = "SELECT nazwa, cena FROM towary LIMIT 4;";
$wynik = mysqli_query($polaczenie, $zapytanie);
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<tr><td>$wiersz[0]</td><td>$wiersz[1]</td></tr>";
}
?>
        </table>
    </section>
    <section id="srodkowy">
        <h2>Koszt zakupów</h2>
        <form action="index.php" method="post">
            <label for="artykul">wybierz artykuł: </label>
            <select name="artykul" id="artykul">
                <option>Zeszyt 60 kartek</option>
                <option>Zeszyt 32 kartki</option>
                <option>Cyrkiel</option>
                <option>Linijka 30 cm</option>
            </select><br>
            <label for="liczba">liczba sztuk: </label>
            <input type="number" name="liczba" id="liczba"><br>
            <input type="submit" value="OBLICZ">
        </form>
<?php
if (isset($_POST['artykul']) && isset($_POST['liczba'])) {
    $nazwaTowaru = mysqli_real_escape_string($polaczenie, $_POST['artykul']);
    $liczbaSztuk = (int) $_POST['liczba'];
    $zapytanie = "SELECT cena FROM towary WHERE nazwa = '$nazwaTowaru';";
    $wynik = mysqli_query($polaczenie, $zapytanie);
    $wiersz = mysqli_fetch_row($wynik);
    if ($wiersz) {
        $wartosc = round($wiersz[0] * $liczbaSztuk, 2);
        echo "<p>wartość zakupów: $wartosc</p>";
    }
}
mysqli_close($polaczenie);
?>
    </section>
    <section id="prawy">
        <h2>Kontakt</h2>
        <img src="zakupy.png" alt="hurtownia"><br>
        <p>e-mail: <a href="mailto:hurt@poczta2.pl">hurt@poczta2.pl</a></p>
    </section>
    <footer>
        <h4>Witrynę wykonał: 00000000000</h4>
    </footer>
</body>
</html>
