<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Biblioteka</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <section id="baner">
        <h1>Biblioteka w Książkowicach Małych</h1>
    </section>
    <section id="lewy">
        <h4>Dodaj czytelnika</h4>
        <form action="biblioteka.php" method="post">
            <label>imię: <input type="text" name="imie"></label><br>
            <label>nazwisko: <input type="text" name="nazwisko"></label><br>
            <label>symbol: <input type="number" name="symbol"></label><br>
            <button type="submit">AKCEPTUJ</button>
        </form>
        <?php
        $polaczenie = mysqli_connect('localhost', 'root', '', 'biblioteka');
        if (isset($_POST['imie']) && isset($_POST['nazwisko']) && isset($_POST['symbol'])) {
            $imie = $_POST['imie'];
            $nazwisko = $_POST['nazwisko'];
            $symbol = $_POST['symbol'];
            echo "Dodano czytelnika $imie $nazwisko";
            $imieSql = mysqli_real_escape_string($polaczenie, $imie);
            $nazwiskoSql = mysqli_real_escape_string($polaczenie, $nazwisko);
            $symbolSql = mysqli_real_escape_string($polaczenie, $symbol);
            mysqli_query($polaczenie, "INSERT INTO czytelnicy (imie, nazwisko, kod) VALUES ('$imieSql', '$nazwiskoSql', '$symbolSql')");
        }
        ?>
    </section>
    <section id="srodkowy">
        <img src="biblioteka.png" alt="biblioteka">
        <h6>ul. Czytelników&nbsp;15; Książkowice Małe</h6>
        <p><a href="mailto:biuro@bib.pl">Czy masz jakieś uwagi?</a></p>
    </section>
    <section id="prawy">
        <h4>Nasi czytelnicy:</h4>
        <ol>
        <?php
        $wynik = mysqli_query($polaczenie, "SELECT imie, nazwisko FROM czytelnicy ORDER BY nazwisko ASC");
        while ($wiersz = mysqli_fetch_array($wynik)) {
            echo "<li>" . $wiersz['imie'] . " " . $wiersz['nazwisko'] . "</li>";
        }
        mysqli_close($polaczenie);
        ?>
        </ol>
    </section>
    <section id="stopka">
        <p>Projekt witryny: 00000000000</p>
    </section>
</body>
</html>
