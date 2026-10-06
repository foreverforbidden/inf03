<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Wyszukiwarka miast</title>
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/png" href="fav.png">
</head>
<body>
    <div id="kontener">
        <header>
            <img src="baner.jpg" alt="Polska">
        </header>
        <section id="lewy-gorny">
            <h4>Podaj początek nazwy miasta</h4>
            <form action="index.php" method="post">
                <input type="text" name="filtr">
                <input type="submit" value="Szukaj">
            </form>
        </section>
        <section id="prawy">
            <h1>Wyniki wyszukiwania miast z uwzględnieniem filtra:</h1>
            <?php
            $polaczenie = mysqli_connect('localhost', 'root', '', 'wykaz');
            mysqli_set_charset($polaczenie, 'utf8');
            if (isset($_POST['filtr'])) {
                $filtr = $_POST['filtr'];
                echo "<p id=\"filtr\">" . htmlspecialchars($filtr) . "</p>";
                $filtrBezpieczny = mysqli_real_escape_string($polaczenie, $filtr);
                $zapytanie = "SELECT miasta.nazwa, wojewodztwa.nazwa FROM miasta JOIN wojewodztwa ON miasta.id_wojewodztwa = wojewodztwa.id WHERE miasta.nazwa LIKE '$filtrBezpieczny%' ORDER BY miasta.nazwa";
                $wynik = mysqli_query($polaczenie, $zapytanie);
                echo "<table>";
                echo "<tr><th>Miasto</th><th>Województwo</th></tr>";
                while ($wiersz = mysqli_fetch_row($wynik)) {
                    echo "<tr><td>" . $wiersz[0] . "</td><td>" . $wiersz[1] . "</td></tr>";
                }
                echo "</table>";
            }
            mysqli_close($polaczenie);
            ?>
        </section>
        <section id="lewy-dolny">
            <p>Egzamin INF.03</p>
            <p>Autor: 00000000000</p>
        </section>
    </div>
</body>
</html>
