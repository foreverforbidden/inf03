<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Biblioteka publiczna</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'biblioteka');
?>
    <header>
        <h1>Biblioteka w Książkowicach Wielkich</h1>
    </header>
    <section id="lewy">
        <h3>Polecamy dzieła autorów:</h3>
        <ol>
<?php
$wynik = mysqli_query($polaczenie, "SELECT imie, nazwisko FROM autorzy ORDER BY nazwisko ASC");
while ($autor = mysqli_fetch_array($wynik)) {
    echo "<li>" . $autor['imie'] . " " . $autor['nazwisko'] . "</li>\n";
}
?>
        </ol>
    </section>
    <section id="srodkowy">
        <h3>ul. Czytelnicza 25, Książkowice&nbsp;Wielkie</h3>
        <p><a href="mailto:sekretariat@biblioteka.pl">Napisz do nas</a></p>
        <img src="biblioteka.png" alt="książki">
    </section>
    <section id="prawy1">
        <h3>Dodaj czytelnika</h3>
        <form method="post" action="biblioteka.php">
            <label>imię: <input type="text" name="imie"></label><br>
            <label>nazwisko: <input type="text" name="nazwisko"></label><br>
            <label>symbol: <input type="number" name="symbol"></label><br>
            <input type="submit" value="DODAJ">
        </form>
    </section>
    <section id="prawy2">
<?php
if (isset($_POST['imie']) && isset($_POST['nazwisko']) && isset($_POST['symbol'])) {
    $imie = mysqli_real_escape_string($polaczenie, $_POST['imie']);
    $nazwisko = mysqli_real_escape_string($polaczenie, $_POST['nazwisko']);
    $symbol = mysqli_real_escape_string($polaczenie, $_POST['symbol']);
    echo "<p>Czytelnik " . htmlspecialchars($_POST['imie']) . " " . htmlspecialchars($_POST['nazwisko']) . " został(a) dodany do bazy danych</p>";
    mysqli_query($polaczenie, "INSERT INTO czytelnicy (imie, nazwisko, kod) VALUES ('$imie', '$nazwisko', '$symbol')");
}
mysqli_close($polaczenie);
?>
    </section>
    <footer>
        <p>Projekt strony: 00000000000</p>
    </footer>
</body>
</html>
