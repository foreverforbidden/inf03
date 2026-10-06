<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Wodospady</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h2>Łowcy wodospadów</h2>
    </header>
    <main>
        <aside>
            <?php
            $polaczenie = mysqli_connect('localhost', 'root', '', 'wodospady');
            mysqli_report(MYSQLI_REPORT_OFF);
            $wynikKontynenty = mysqli_query($polaczenie, "SELECT idKontynent, nazwa FROM kontynenty;");
            while ($kontynent = mysqli_fetch_row($wynikKontynenty)) {
                echo "<a href=\"index.php?id=$kontynent[0]\">$kontynent[1]</a>";
            }
            ?>
        </aside>
        <section>
            <table>
                <tr><th>Identyfikator</th><th>Państwo</th><th>Nazwa wodospadu</th><th>Wysokość</th></tr>
                <?php
                $idKontynentu = isset($_GET['id']) ? intval($_GET['id']) : 6;
                $wynikObiekty = mysqli_query($polaczenie, "SELECT idObiekt, panstwo, nazwa, wartoscCechy FROM obiekty WHERE idRodzaj = 10 AND idKontynent = $idKontynentu;");
                while ($obiekt = mysqli_fetch_row($wynikObiekty)) {
                    echo "<tr><td>$obiekt[0]</td><td>$obiekt[1]</td><td>$obiekt[2]</td><td>$obiekt[3]</td></tr>";
                }
                ?>
            </table>
            <h4>Wpisz osiągnięcie do bazy</h4>
            <form action="index.php" method="post">
                <label for="idObiektu">identyfikator wodospadu</label>
                <input type="number" id="idObiektu" name="idObiektu">
                <label for="turysta">turysta</label>
                <select id="turysta" name="turysta">
                    <?php
                    $wynikTurysci = mysqli_query($polaczenie, "SELECT idTurysta, nick FROM turysci;");
                    while ($turysta = mysqli_fetch_row($wynikTurysci)) {
                        echo "<option value=\"$turysta[0]\">$turysta[1]</option>";
                    }
                    ?>
                </select>
                <button type="submit">Wpisz</button>
            </form>
            <?php
            if (isset($_POST['idObiektu']) && isset($_POST['turysta'])) {
                $idObiektu = intval($_POST['idObiektu']);
                $idTurysty = intval($_POST['turysta']);
                mysqli_query($polaczenie, "INSERT INTO osiagniecia (idObiekt, idTurysta) VALUES ($idObiektu, $idTurysty);");
            }
            mysqli_close($polaczenie);
            ?>
        </section>
    </main>
    <article>
        <h3>Wodospady w Polsce</h3>
        <img src="kamienczyk.jpg" alt="wodospad">
        <img src="siklawica.jpg" alt="wodospad">
        <img src="siklawa.jpg" alt="wodospad">
        <img src="wilczki.jpg" alt="wodospad">
    </article>
    <footer>
        <p>Autor: 00000000000</p>
    </footer>
</body>
</html>
