<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Wykaz chorób</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>Informacja o chorobach w Polsce</h1>
    </header>
    <nav>
        <a href="https://szpitale.pl/" target="_blank">Szpitale</a>
        <a href="https://www.przychodnie.pl/" target="_blank">Przychodnie</a>
        <a href="https://www.nfz.gov.pl/" target="_blank">NFZ</a>
    </nav>
    <main>
        <section id="lewa">
            <h2>Choroby zakaźne</h2>
            <ol>
                <?php
                $polaczenie = mysqli_connect('localhost', 'root', '', 'choroby');
                $wynik1 = mysqli_query($polaczenie, "SELECT nazwa FROM choroby WHERE zakazna = 'T' ORDER BY nazwa ASC;");
                while ($wiersz = mysqli_fetch_row($wynik1)) {
                    echo "<li>$wiersz[0]</li>";
                }
                ?>
            </ol>
        </section>
        <section id="prawa">
            <h2>Objawy chorób</h2>
            <form method="post" action="zdrowie.php">
                <select name="choroba">
                    <?php
                    $wynik2 = mysqli_query($polaczenie, "SELECT id, nazwa FROM choroby;");
                    while ($wiersz = mysqli_fetch_row($wynik2)) {
                        echo "<option value=\"$wiersz[0]\">$wiersz[1]</option>";
                    }
                    ?>
                </select>
                <button type="submit">Sprawdź</button>
            </form>
            <div id="wynik">
                <?php
                if (isset($_POST['choroba'])) {
                    $idChoroby = (int) $_POST['choroba'];
                    $wynik3 = mysqli_query($polaczenie, "SELECT objawy.nazwa FROM objawy JOIN choroby_objawy ON objawy.id = choroby_objawy.id_objawy WHERE choroby_objawy.id_choroby = $idChoroby;");
                    while ($wiersz = mysqli_fetch_row($wynik3)) {
                        echo "<span> $wiersz[0] </span>";
                    }
                }
                mysqli_close($polaczenie);
                ?>
            </div>
        </section>
    </main>
    <footer>
        <p>Stronę opracował: 00000000000</p>
    </footer>
    <img src="zdrowia.png" alt="Życzymy zdrowia!">
</body>
</html>
