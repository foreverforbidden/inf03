<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Matura</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>System informacji dla maturzystów</h1>
    </header>
    <aside>
        <img src="ma.jpg" alt="Matura"><br>
        <img src="tu.jpg" alt="Matura"><br>
        <img src="ra.jpg" alt="Matura">
    </aside>
    <section>
        <h3>Wybierz ucznia z listy:</h3>
        <?php
        $polaczenie = mysqli_connect("localhost", "root", "", "matura");
        $wynikZapytania = mysqli_query($polaczenie, "SELECT id, imie, nazwisko FROM maturzysta WHERE szkola = 'T3' ORDER BY nazwisko ASC;");
        while ($wiersz = mysqli_fetch_row($wynikZapytania)) {
            echo "<a href=\"wynik.php?id=$wiersz[0]&imie=" . urlencode($wiersz[1]) . "&nazwisko=" . urlencode($wiersz[2]) . "\">$wiersz[0]. $wiersz[1] $wiersz[2]</a><br>";
        }
        mysqli_close($polaczenie);
        ?>
    </section>
    <section>
        <?php
        $polaczenie = mysqli_connect("localhost", "root", "", "matura");

        echo "<div class=\"blok\"><h4>Przedmioty</h4>";
        $wynikZapytania = mysqli_query($polaczenie, "SELECT DISTINCT przedmiot FROM arkusz;");
        while ($wiersz = mysqli_fetch_row($wynikZapytania)) {
            echo $wiersz[0] . " ";
        }
        echo "</div>";

        echo "<div class=\"blok\"><h4>Lata</h4>";
        $wynikZapytania = mysqli_query($polaczenie, "SELECT MIN(rok), MAX(rok) FROM arkusz;");
        $wiersz = mysqli_fetch_row($wynikZapytania);
        echo $wiersz[0] . " - " . $wiersz[1];
        echo "</div>";

        echo "<div class=\"blok\"><h4>Najlepszy wynik</h4>";
        $wynikZapytania = mysqli_query($polaczenie, "SELECT maturzysta_id, AVG(punkty) AS Wynik FROM wynik GROUP BY maturzysta_id ORDER BY Wynik DESC LIMIT 1;");
        $wiersz = mysqli_fetch_row($wynikZapytania);
        echo $wiersz[1] . "%";
        echo "</div>";

        echo "<div class=\"blok\"><h4>Najgorszy wynik</h4>";
        $wynikZapytania = mysqli_query($polaczenie, "SELECT maturzysta_id, AVG(punkty) AS Wynik FROM wynik GROUP BY maturzysta_id ORDER BY Wynik ASC LIMIT 1;");
        $wiersz = mysqli_fetch_row($wynikZapytania);
        echo $wiersz[1] . "%";
        echo "</div>";
        mysqli_close($polaczenie);
        ?>
    </section>
    <footer>
        <p>Stronę wykonał: 00000000000</p>
    </footer>
</body>
</html>
