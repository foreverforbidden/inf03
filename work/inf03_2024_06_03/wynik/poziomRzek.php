<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Poziomy rzek</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header><img src="obraz1.png" alt="Mapa Polski"></header>
    <header><h1>Rzeki w województwie dolnośląskim</h1></header>
    <nav>
        <form method="post" action="poziomRzek.php">
            <input type="radio" name="poziom" value="wszystkie" id="wszystkie"><label for="wszystkie" class="opcja">Wszystkie</label>
            <input type="radio" name="poziom" value="ostrzegawczy" id="ostrzegawczy"><label for="ostrzegawczy" class="opcja">Ponad stan ostrzegawczy</label>
            <input type="radio" name="poziom" value="alarmowy" id="alarmowy"><label for="alarmowy" class="opcja">Ponad stan alarmowy</label>
            <button type="submit">Pokaż</button>
        </form>
    </nav>
    <main>
        <h3>Stany na dzień 2022-05-05</h3>
        <table>
            <tr><th>Wodomierz</th><th>Rzeka</th><th>Ostrzegawczy</th><th>Alarmowy</th><th>Aktualny</th></tr>
<?php
$connection = mysqli_connect('localhost', 'root', '', 'rzeki');
if (isset($_POST['poziom'])) {
    $selectedLevel = $_POST['poziom'];
    $levelsQuery = "SELECT nazwa, rzeka, stanOstrzegawczy, stanAlarmowy, stanWody FROM wodowskazy JOIN pomiary ON wodowskazy.id = pomiary.wodowskazy_id WHERE dataPomiaru = '2022-05-05'";
    if ($selectedLevel == 'ostrzegawczy') {
        $levelsQuery .= " AND stanWody > stanOstrzegawczy";
    } elseif ($selectedLevel == 'alarmowy') {
        $levelsQuery .= " AND stanWody > stanAlarmowy";
    }
    $levelsResult = mysqli_query($connection, $levelsQuery);
    while ($row = mysqli_fetch_row($levelsResult)) {
        echo "<tr><td>$row[0]</td><td>$row[1]</td><td>$row[2]</td><td>$row[3]</td><td>$row[4]</td></tr>";
    }
}
?>
        </table>
    </main>
    <aside>
        <h3>Informacje</h3>
        <ul>
            <li>Brak ostrzeżeń o burzach z gradem</li>
            <li>Smog w mieście Wrocław</li>
            <li>Silny wiatr w Karkonoszach</li>
        </ul>
        <h3>Średnie stany wód</h3>
<?php
$averageQuery = "SELECT dataPomiaru, AVG(stanWody) FROM pomiary GROUP BY dataPomiaru";
$averageResult = mysqli_query($connection, $averageQuery);
while ($row = mysqli_fetch_row($averageResult)) {
    echo "<p>$row[0]: $row[1]</p>";
}
mysqli_close($connection);
?>
        <a href="https://komunikaty.pl">Dowiedz się więcej</a>
        <img src="obraz2.jpg" alt="rzeka">
    </aside>
    <footer><p>Stronę wykonał: 00000000000</p></footer>
</body>
</html>
