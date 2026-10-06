<?php
session_start();
if (!isset($_SESSION['uzytkownik'])) {
    header("Location: login.php");
    exit;
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Przeglądaj wyniki</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>Portal laboratorium</h1>
        <p>Witaj, <strong><?php echo htmlspecialchars($_SESSION['uzytkownik']); ?></strong></p>
        <p><a href="wyloguj.php">Wyloguj</a></p>
    </header>
    <main>
        <h2>Wyniki pacjentów</h2>
        <div class="tabela">
            <table>
                <tr>
                    <th>Imię pacjenta</th>
                    <th>Nazwisko pacjenta</th>
                    <th>PESEL</th>
                    <th>Data zlecenia</th>
                    <th>Data wykonania</th>
                    <th>Wynik</th>
                </tr>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'laboratorium');
mysqli_set_charset($polaczenie, 'utf8');
$zapytanie = "SELECT Pacjent.imie, Pacjent.nazwisko, Pacjent.pesel, Zlecenie.data, Wynik.data, Wynik.plik FROM Zlecenie JOIN Pacjent ON Zlecenie.idPacjenta = Pacjent.id LEFT JOIN Wynik ON Wynik.idZlecenia = Zlecenie.id;";
$wynik = mysqli_query($polaczenie, $zapytanie);
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<tr>";
    for ($i = 0; $i < 5; $i++) {
        echo "<td>" . $wiersz[$i] . "</td>";
    }
    echo "<td>";
    if (!empty($wiersz[5])) {
        echo "<a href=\"" . $wiersz[5] . "\" target=\"_blank\">wynik</a>";
    }
    echo "</td></tr>\n";
}
mysqli_close($polaczenie);
?>
            </table>
        </div>
    </main>
    <footer>
        <p>Wykonał: 00000000000</p>
    </footer>
</body>
</html>
