<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'kalendarz');
if (isset($_POST['wpis'])) {
    $nowyWpis = mysqli_real_escape_string($polaczenie, $_POST['wpis']);
    mysqli_query($polaczenie, "UPDATE zadania SET wpis = '$nowyWpis' WHERE dataZadania = '2020-08-09'");
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Sierpniowy kalendarz</title>
    <link rel="stylesheet" href="styl5.css">
</head>
<body>
    <section class="baner" id="baner1">
        <h1>Organizer: SIERPIEŃ</h1>
    </section>
    <section class="baner" id="baner2">
        <form method="post" action="organizer.php">
            <label for="wpis">Zapisz wydarzenie: </label>
            <input type="text" name="wpis" id="wpis">
            <button type="submit">OK</button>
        </form>
    </section>
    <section class="baner" id="baner3">
        <img src="logo2.png" alt="sierpień">
    </section>
    <section id="glowny">
<?php
$wynik = mysqli_query($polaczenie, "SELECT dataZadania, wpis FROM zadania WHERE dataZadania BETWEEN '2020-08-01' AND '2020-08-31'");
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<section class=\"kalendarz\">";
    echo "<h5>" . $wiersz['dataZadania'] . "</h5>";
    echo "<p>" . $wiersz['wpis'] . "</p>";
    echo "</section>\n";
}
mysqli_close($polaczenie);
?>
    </section>
    <footer>
        <p>Stronę wykonał: 00000000000</p>
    </footer>
</body>
</html>
