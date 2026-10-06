<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Smoki</title>
    <link rel="stylesheet" href="styl.css">
    <script src="skrypt.js"></script>
</head>
<body>
    <header>
        <h2>Poznaj smoki!</h2>
    </header>
    <nav>
        <div id="blok1" onclick="pokazSekcje(1)">Baza</div>
        <div id="blok2" onclick="pokazSekcje(2)">Opisy</div>
        <div id="blok3" onclick="pokazSekcje(3)">Galeria</div>
    </nav>
    <main>
        <section id="sekcja1">
            <h3>Baza Smoków</h3>
            <form method="post" action="smoki.php">
                <select name="kraj">
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'smoki');
$wynikKraje = mysqli_query($polaczenie, "SELECT DISTINCT pochodzenie FROM smok ORDER BY pochodzenie ASC;");
while ($wiersz = mysqli_fetch_row($wynikKraje)) {
    echo "                    <option value=\"" . htmlspecialchars($wiersz[0]) . "\">" . htmlspecialchars($wiersz[0]) . "</option>\n";
}
?>
                </select>
                <input type="submit" value="Szukaj">
            </form>
            <table>
                <tr><th>Nazwa</th><th>Długość</th><th>Szerokość</th></tr>
<?php
if (isset($_POST['kraj'])) {
    $kraj = mysqli_real_escape_string($polaczenie, $_POST['kraj']);
    $wynikSmoki = mysqli_query($polaczenie, "SELECT nazwa, dlugosc, szerokosc FROM smok WHERE pochodzenie = '$kraj';");
    while ($smok = mysqli_fetch_row($wynikSmoki)) {
        echo "                <tr><td>$smok[0]</td><td>$smok[1]</td><td>$smok[2]</td></tr>\n";
    }
}
mysqli_close($polaczenie);
?>
            </table>
        </section>
        <section id="sekcja2">
            <h3>Opisy smoków</h3>
            <dl>
            <dt>Smok czerwony</dt>
            <dd>Pochodzi z Chin. Ma 1000 lat. Żywi się mniejszymi zwierzętami. Posiada łuski cenne na rynkach wschodnich do wyrabiania lekarstw. Jest dziki i groźny.</dd>
            <dt>Smok zielony</dt>
            <dd>Pochodzi z Bułgarii. Ma 10000 lat. Żywi się mniejszymi zwierzętami, ale tylko w kolorze zielonym. Jest kosmaty. Z sierści zgubionej przez niego, tka się najdroższe materiały.</dd>
            <dt>Smok niebieski</dt>
            <dd>Pochodzi z Francji. Ma 100 lat. Żywi się owocami morza. Jest natchnieniem dla najlepszych malarzy. Często im pozuje. Smok ten jest przyjacielem ludzi i czasami im pomaga. Jest jednak próżny i nie lubi się przepracowywać.</dd>
            </dl>
        </section>
        <section id="sekcja3">
            <h3>Galeria</h3>
            <img src="smok1.jpg" alt="Smok czerwony">
            <img src="smok2.jpg" alt="Smok wielki">
            <img src="smok3.jpg" alt="Skrzydlaty łaciaty">
        </section>
    </main>
    <footer>
        <p>Stronę opracował: 00000000000</p>
    </footer>
</body>
</html>
