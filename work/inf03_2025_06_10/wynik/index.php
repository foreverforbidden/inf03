<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Szkolenia i kursy</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>SZKOLENIA</h1>
    </header>
    <main>
        <section id="lewa">
            <table>
                <tr><th>Kurs</th><th>Nazwa</th><th>Cena</th></tr>
                <?php
                $polaczenie = mysqli_connect('localhost', 'root', '', 'szkolenia');
                $wynik = mysqli_query($polaczenie, "SELECT kod, nazwa, cena FROM kursy ORDER BY cena ASC");
                while ($wiersz = mysqli_fetch_row($wynik)) {
                    echo "<tr><td><img src=\"$wiersz[0].jpg\" alt=\"kurs\"></td><td>$wiersz[1]</td><td>$wiersz[2]</td></tr>";
                }
                ?>
            </table>
        </section>
        <section id="prawa">
            <h2>Zapisy na kursy</h2>
            <form action="index.php" method="post">
                <label for="imie">Imię</label><br>
                <input type="text" name="imie" id="imie"><br>
                <label for="nazwisko">Nazwisko</label><br>
                <input type="text" name="nazwisko" id="nazwisko"><br>
                <label for="wiek">Wiek</label><br>
                <input type="number" name="wiek" id="wiek"><br>
                <label for="kurs">Rodzaj kursu</label><br>
                <select name="kurs" id="kurs">
                    <?php
                    $wynik = mysqli_query($polaczenie, "SELECT nazwa FROM kursy");
                    while ($wiersz = mysqli_fetch_row($wynik)) {
                        echo "<option>$wiersz[0]</option>";
                    }
                    ?>
                </select><br>
                <button type="submit">Dodaj dane</button>
            </form>
            <?php
            if (isset($_POST['imie']) && isset($_POST['nazwisko']) && isset($_POST['wiek'])
                && $_POST['imie'] !== '' && $_POST['nazwisko'] !== '' && $_POST['wiek'] !== '') {
                $imie = mysqli_real_escape_string($polaczenie, $_POST['imie']);
                $nazwisko = mysqli_real_escape_string($polaczenie, $_POST['nazwisko']);
                $wiek = (int)$_POST['wiek'];
                mysqli_query($polaczenie, "INSERT INTO uczestnicy (imie, nazwisko, wiek) VALUES ('$imie', '$nazwisko', $wiek)");
                echo "<p>Dane uczestnika " . htmlspecialchars($_POST['imie']) . " " . htmlspecialchars($_POST['nazwisko']) . " zostały dodane</p>";
            } elseif (isset($_POST['imie']) || isset($_POST['nazwisko']) || isset($_POST['wiek'])) {
                echo "<p>Wprowadź wszystkie dane</p>";
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
