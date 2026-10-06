<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Pogoda</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header id="baner1"><img src="slonce.png" alt="Słonecznie"></header>
    <header id="baner2"><h1>Pogoda w Europie</h1></header>
    <main>
        <section id="lewa">
            <h2>Temperatury w lipcu</h2>
            <table>
                <tr><th>Miasto</th><th>Kraj</th><th>Temperatura</th><th>Pogoda</th></tr>
                <?php
                $polaczenie = mysqli_connect('localhost', 'root', '', 'pogoda');
                $zapytanie = "SELECT miejscowosc.nazwa, miejscowosc.kraj, pomiary.temperatura FROM miejscowosc JOIN pomiary ON miejscowosc.id = pomiary.id_miejscowosc WHERE pomiary.id_miesiac = 7;";
                $wynik = mysqli_query($polaczenie, $zapytanie);
                while ($wiersz = mysqli_fetch_row($wynik)) {
                    if ($wiersz[2] > 30) {
                        $obraz = 'slonce.png';
                    } elseif ($wiersz[2] < 26) {
                        $obraz = 'deszcz.png';
                    } else {
                        $obraz = 'chmury.png';
                    }
                    echo "<tr><td>$wiersz[0]</td><td>$wiersz[1]</td><td>$wiersz[2]</td><td><img src=\"$obraz\" alt=\"pogoda\"></td></tr>";
                }
                ?>
            </table>
        </section>
        <section id="prawa">
            <h2>Średnie temperatury w roku</h2>
            <a href="index.php?miesiac=1">Styczeń</a>
            <a href="index.php?miesiac=2">Luty</a>
            <a href="index.php?miesiac=3">Marzec</a>
            <a href="index.php?miesiac=4">Kwiecień</a>
            <a href="index.php?miesiac=5">Maj</a>
            <a href="index.php?miesiac=6">Czerwiec</a>
            <a href="index.php?miesiac=7">Lipiec</a>
            <a href="index.php?miesiac=8">Sierpień</a>
            <a href="index.php?miesiac=9">Wrzesień</a>
            <a href="index.php?miesiac=10">Październik</a>
            <a href="index.php?miesiac=11">Listopad</a>
            <a href="index.php?miesiac=12">Grudzień</a>
            <p>Średnia temperatura dla wybranego miesiąca wynosi</p>
            <?php
            if (isset($_GET['miesiac'])) {
                $idMiesiaca = (int) $_GET['miesiac'];
                $zapytanieSrednia = "SELECT ROUND(AVG(temperatura), 2) FROM pomiary WHERE id_miesiac = $idMiesiaca;";
                $wynikSrednia = mysqli_query($polaczenie, $zapytanieSrednia);
                $wierszSrednia = mysqli_fetch_row($wynikSrednia);
                echo "<h3>$wierszSrednia[0] stopni</h3>";
            }
            mysqli_close($polaczenie);
            ?>
        </section>
    </main>
    <footer>
        <p>Numer zdającego: 00000000000</p>
    </footer>
</body>
</html>
