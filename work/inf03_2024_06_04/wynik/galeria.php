<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Galeria</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>Zdjęcia</h1>
    </header>
    <aside id="lewy">
        <h2>Tematy zdjęć</h2>
        <ol>
            <li>Zwierzęta</li>
            <li>Krajobrazy</li>
            <li>Miasta</li>
            <li>Przyroda</li>
            <li>Samochody</li>
        </ol>
    </aside>
    <main>
        <?php
        $polaczenie = mysqli_connect('localhost', 'root', '', 'galeria');
        $zapytanieZdjecia = "SELECT zdjecia.plik, zdjecia.tytul, zdjecia.polubienia, autorzy.imie, autorzy.nazwisko FROM zdjecia JOIN autorzy ON zdjecia.autorzy_id = autorzy.id ORDER BY autorzy.nazwisko ASC;";
        $wynikZdjecia = mysqli_query($polaczenie, $zapytanieZdjecia);
        while ($wiersz = mysqli_fetch_array($wynikZdjecia)) {
            echo "<section class=\"blok\">";
            echo "<img src=\"" . $wiersz['plik'] . "\" alt=\"zdjęcie\">";
            echo "<h3>" . $wiersz['tytul'] . "</h3>";
            if ($wiersz['polubienia'] > 40) {
                echo "<p>Autor: " . $wiersz['imie'] . " " . $wiersz['nazwisko'] . ".<br>Wiele osób polubiło ten obraz</p>";
            } else {
                echo "<p>Autor: " . $wiersz['imie'] . " " . $wiersz['nazwisko'] . "</p>";
            }
            echo "<a href=\"" . $wiersz['plik'] . "\" download>Pobierz</a>";
            echo "</section>";
        }
        ?>
    </main>
    <aside id="prawy">
        <h2>Najbardziej lubiane</h2>
        <?php
        $zapytaniePopularne = "SELECT tytul, plik FROM zdjecia WHERE polubienia >= 100;";
        $wynikPopularne = mysqli_query($polaczenie, $zapytaniePopularne);
        while ($wierszPopularny = mysqli_fetch_array($wynikPopularne)) {
            echo "<img src=\"" . $wierszPopularny['plik'] . "\" alt=\"" . $wierszPopularny['tytul'] . "\">";
        }
        mysqli_close($polaczenie);
        ?>
        <strong>Zobacz wszystkie nasze zdjęcia</strong>
    </aside>
    <footer>
        <h5>Stronę wykonał: 00000000000</h5>
    </footer>
</body>
</html>
