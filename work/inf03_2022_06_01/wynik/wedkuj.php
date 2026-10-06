<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Wędkowanie</title>
    <link rel="stylesheet" href="styl_1.css">
</head>
<body>
    <header>
        <h1>Portal dla wędkarzy</h1>
    </header>
    <section id="lewy1">
        <h3>Ryby zamieszkujące rzeki</h3>
        <ol>
            <?php
            $polaczenie = mysqli_connect('localhost', 'root', '', 'wedkowanie');
            $wynik1 = mysqli_query($polaczenie, "SELECT ryby.nazwa, lowisko.akwen, lowisko.wojewodztwo FROM ryby JOIN lowisko ON ryby.id = lowisko.Ryby_id WHERE lowisko.rodzaj = 3;");
            while ($wiersz = mysqli_fetch_row($wynik1)) {
                echo "<li>$wiersz[0] pływa w rzece $wiersz[1], $wiersz[2]</li>";
            }
            ?>
        </ol>
    </section>
    <section id="lewy2">
        <h3>Ryby drapieżne naszych wód</h3>
        <table>
            <tr><th>L.p.</th><th>Gatunek</th><th>Występowanie</th></tr>
            <?php
            $wynik2 = mysqli_query($polaczenie, "SELECT id, nazwa, wystepowanie FROM ryby WHERE styl_zycia = 1;");
            while ($wiersz = mysqli_fetch_row($wynik2)) {
                echo "<tr><td>$wiersz[0]</td><td>$wiersz[1]</td><td>$wiersz[2]</td></tr>";
            }
            mysqli_close($polaczenie);
            ?>
        </table>
    </section>
    <section id="prawy">
        <img src="ryba1.jpg" alt="Sum"><br>
        <a href="kwerendy.txt">Pobierz kwerendy</a>
    </section>
    <footer>
        <p>Stronę wykonał: 00000000000</p>
    </footer>
</body>
</html>
