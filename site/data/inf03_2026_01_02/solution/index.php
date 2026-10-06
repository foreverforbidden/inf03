<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Zdrowy bazarek</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>Zdrowy bazarek</h1>
    </header>
    <nav>
        <?php
        $polaczenie = mysqli_connect('localhost', 'root', '', 'bazar');
        $wynik = mysqli_query($polaczenie, "SELECT nazwa, plik FROM towar LIMIT 10;");
        while ($wiersz = mysqli_fetch_array($wynik)) {
            echo "<img src=\"" . $wiersz['plik'] . "\" alt=\"" . $wiersz['nazwa'] . "\">";
        }
        ?>
    </nav>
    <main>
        <aside>
            <img src="market.png" alt="bazarek">
        </aside>
        <section>
            <p>Wybierz owoc lub warzywo i podaj jego wagę:</p>
            <form method="post" action="index.php">
                <select name="towar">
                    <?php
                    $wynik = mysqli_query($polaczenie, "SELECT id, nazwa FROM towar;");
                    while ($wiersz = mysqli_fetch_array($wynik)) {
                        echo "<option value=\"" . $wiersz['id'] . "\">" . $wiersz['nazwa'] . "</option>";
                    }
                    ?>
                </select>
                <input type="number" name="waga" step="1" required>
                <input type="submit" value="Zamów">
            </form>
            <?php
            if (isset($_POST['towar']) && isset($_POST['waga'])) {
                $idTowaru = (int)$_POST['towar'];
                $liczbaKg = (int)$_POST['waga'];
                $wynik = mysqli_query($polaczenie, "SELECT rodzaj, nazwa, cena FROM towar WHERE id = $idTowaru;");
                $wiersz = mysqli_fetch_array($wynik);
                if ($wiersz) {
                    $wartosc = $wiersz['cena'] * $liczbaKg;
                    echo "<p>" . $wiersz['rodzaj'] . " " . $wiersz['nazwa'] . " wartość: " . $wartosc . " zł</p>";
                    mysqli_query($polaczenie, "INSERT INTO zamowienie (id_towar, id_sklep, liczba_kg) VALUES ($idTowaru, 2, $liczbaKg);");
                }
            }
            mysqli_close($polaczenie);
            ?>
        </section>
    </main>
    <footer>
        <p>Stronę opracował: 00000000000</p>
    </footer>
</body>
</html>
