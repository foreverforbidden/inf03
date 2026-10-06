<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Kwiaty</title>
    <link rel="stylesheet" href="styl3.css">
</head>
<body>
    <header>
        <h1>Grupa Polskich Kwiaciarni</h1>
    </header>
    <nav>
        <h2>Menu</h2>
        <ol>
            <li><a href="index.html">Strona główna</a></li>
            <li><a href="https://www.kwiaty.pl/" target="_blank">Rozpoznaj kwiaty</a></li>
            <li><a href="znajdz.php">Znajdź kwiaciarnię</a>
                <ul>
                    <li>w Warszawie</li>
                    <li>w Malborku</li>
                    <li>w Poznaniu</li>
                </ul>
            </li>
        </ol>
    </nav>
    <main>
        <h2>Znajdź kwiaciarnię</h2>
        <form method="post" action="znajdz.php">
            <label for="miasto">Podaj nazwę miasta:</label>
            <input type="text" name="miasto" id="miasto">
            <input type="submit" value="SPRAWDŹ">
        </form>
        <?php
        $polaczenie = mysqli_connect('localhost', 'root', '', 'kwiaciarnia');
        if (isset($_POST['miasto'])) {
            $miasto = mysqli_real_escape_string($polaczenie, $_POST['miasto']);
            $wynik = mysqli_query($polaczenie, "SELECT nazwa, ulica FROM kwiaciarnie WHERE miasto = '$miasto'");
            while ($wiersz = mysqli_fetch_row($wynik)) {
                echo "<h3>$wiersz[0], $wiersz[1]</h3>";
            }
        }
        mysqli_close($polaczenie);
        ?>
    </main>
    <footer>
        <p>Stronę opracował: 00000000000</p>
    </footer>
</body>
</html>
