<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>ZDOBYWCY GÓR</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Klub zdobywców gór polskich</h1>
    </header>
    <nav>
        <a href="kw1.png">kwerenda1</a>
        <a href="kw2.png">kwerenda2</a>
        <a href="kw3.png">kwerenda3</a>
        <a href="kw4.png">kwerenda4</a>
    </nav>
    <aside>
        <img src="logo.png" alt="logo zdobywcy">
        <h3>razem z nami:</h3>
        <ul>
            <li>wyjazdy</li>
            <li>szkolenia</li>
            <li>rekreacja</li>
            <li>wypoczynek</li>
            <li>wyzwania</li>
        </ul>
    </aside>
    <main>
        <h2>Dołącz do naszego zespołu!</h2>
        <p>Wpisz swoje dane do formularza:</p>
        <form action="zdobywcy.php" method="post">
            <label for="nazwisko">Nazwisko: </label>
            <input type="text" name="nazwisko" id="nazwisko"><br>
            <label for="imie">Imię: </label>
            <input type="text" name="imie" id="imie"><br>
            <label for="funkcja">Funkcja: </label>
            <select name="funkcja" id="funkcja">
                <option>uczestnik</option>
                <option>przewodnik</option>
                <option>zaopatrzeniowiec</option>
                <option>organizator</option>
                <option>ratownik</option>
            </select><br>
            <label for="email">Email: </label>
            <input type="email" name="email" id="email"><br>
            <input type="submit" value="Dodaj">
        </form>
        <table>
            <tr><th>Nazwisko</th><th>Imię</th><th>Funkcja</th><th>Email</th></tr>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'zdobywcy');
mysqli_set_charset($polaczenie, 'utf8');

$wynik = mysqli_query($polaczenie, "SELECT nazwisko, imie, funkcja, email FROM osoby;");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<tr><td>$wiersz[0]</td><td>$wiersz[1]</td><td>$wiersz[2]</td><td>$wiersz[3]</td></tr>";
}

if (isset($_POST['nazwisko']) && isset($_POST['imie']) && isset($_POST['funkcja']) && isset($_POST['email'])
    && $_POST['nazwisko'] != '' && $_POST['imie'] != '' && $_POST['email'] != '') {
    $nazwisko = mysqli_real_escape_string($polaczenie, $_POST['nazwisko']);
    $imie = mysqli_real_escape_string($polaczenie, $_POST['imie']);
    $funkcja = mysqli_real_escape_string($polaczenie, $_POST['funkcja']);
    $email = mysqli_real_escape_string($polaczenie, $_POST['email']);
    mysqli_query($polaczenie, "INSERT INTO osoby (nazwisko, imie, funkcja, email) VALUES ('$nazwisko', '$imie', '$funkcja', '$email');");
}

mysqli_close($polaczenie);
?>
        </table>
    </main>
    <footer>
        <p>Stronę wykonał: 00000000000</p>
    </footer>
</body>
</html>
