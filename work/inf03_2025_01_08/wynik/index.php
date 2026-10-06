<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Mieszalnia farb</title>
    <link rel="icon" type="image/png" href="fav.png">
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header>
        <img src="baner.png" alt="Mieszalnia farb">
    </header>
    <section>
        <form method="post" action="index.php">
            <label for="od">Data odbioru od: </label>
            <input type="date" id="od" name="od">
            <label for="do">do: </label>
            <input type="date" id="do" name="do">
            <button type="submit">Wyszukaj</button>
        </form>
    </section>
    <main>
        <table>
            <tr>
                <th>Nr zamówienia</th>
                <th>Nazwisko</th>
                <th>Imię</th>
                <th>Kolor</th>
                <th>Pojemność [ml]</th>
                <th>Data odbioru</th>
            </tr>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'mieszalnia');
mysqli_set_charset($polaczenie, 'utf8');
if (isset($_POST['od']) && isset($_POST['do']) && $_POST['od'] !== '' && $_POST['do'] !== '') {
    $dataOd = mysqli_real_escape_string($polaczenie, $_POST['od']);
    $dataDo = mysqli_real_escape_string($polaczenie, $_POST['do']);
    $zapytanie = "SELECT klienci.Nazwisko, klienci.Imie, zamowienia.id, zamowienia.kod_koloru, zamowienia.pojemnosc, zamowienia.data_odbioru FROM klienci JOIN zamowienia ON klienci.Id = zamowienia.id_klienta WHERE zamowienia.data_odbioru BETWEEN '$dataOd' AND '$dataDo' ORDER BY zamowienia.data_odbioru ASC;";
} else {
    $zapytanie = "SELECT klienci.Nazwisko, klienci.Imie, zamowienia.id, zamowienia.kod_koloru, zamowienia.pojemnosc, zamowienia.data_odbioru FROM klienci JOIN zamowienia ON klienci.Id = zamowienia.id_klienta ORDER BY zamowienia.data_odbioru ASC;";
}
$wynik = mysqli_query($polaczenie, $zapytanie);
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<tr>";
    echo "<td>" . $wiersz['id'] . "</td>";
    echo "<td>" . $wiersz['Nazwisko'] . "</td>";
    echo "<td>" . $wiersz['Imie'] . "</td>";
    echo "<td style=\"background-color: #" . $wiersz['kod_koloru'] . "\">" . $wiersz['kod_koloru'] . "</td>";
    echo "<td>" . $wiersz['pojemnosc'] . "</td>";
    echo "<td>" . $wiersz['data_odbioru'] . "</td>";
    echo "</tr>";
}
mysqli_close($polaczenie);
?>
        </table>
    </main>
    <footer>
        <h3>Egzamin INF.03</h3>
        <p>Autor: 00000000000</p>
    </footer>
</body>
</html>
