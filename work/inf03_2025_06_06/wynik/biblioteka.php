<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'biblioteka');
mysqli_set_charset($polaczenie, 'utf8');

function listaKsiazek($polaczenie, $gatunek)
{
    $wynik = mysqli_query($polaczenie, "SELECT id, tytul FROM ksiazka WHERE gatunek = '$gatunek';");
    while ($wiersz = mysqli_fetch_row($wynik)) {
        echo "<option value=\"$wiersz[0]\">$wiersz[1]</option>";
    }
}

function rezerwuj($polaczenie, $pole)
{
    if (isset($_POST[$pole])) {
        $id = (int)$_POST[$pole];
        $wynik = mysqli_query($polaczenie, "SELECT tytul FROM ksiazka WHERE id = $id;");
        $wiersz = mysqli_fetch_row($wynik);
        if ($wiersz) {
            echo "<p>Książka $wiersz[0] została zarezerwowana</p>";
            mysqli_query($polaczenie, "UPDATE ksiazka SET rezerwacja = 1 WHERE id = $id;");
        }
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Biblioteka miejska</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <?php
        for ($i = 0; $i < 20; $i++) {
            echo '<img src="obraz.png" alt="książki">';
        }
        ?>
    </header>
    <section>
        <h2>Liryka</h2>
        <form method="post" action="biblioteka.php">
            <select name="liryka">
                <?php listaKsiazek($polaczenie, 'liryka'); ?>
            </select>
            <input type="submit" value="Rezerwuj">
        </form>
        <?php rezerwuj($polaczenie, 'liryka'); ?>
    </section>
    <section>
        <h2>Epika</h2>
        <form method="post" action="biblioteka.php">
            <select name="epika">
                <?php listaKsiazek($polaczenie, 'epika'); ?>
            </select>
            <input type="submit" value="Rezerwuj">
        </form>
        <?php rezerwuj($polaczenie, 'epika'); ?>
    </section>
    <section>
        <h2>Dramat</h2>
        <form method="post" action="biblioteka.php">
            <select name="dramat">
                <?php listaKsiazek($polaczenie, 'dramat'); ?>
            </select>
            <input type="submit" value="Rezerwuj">
        </form>
        <?php rezerwuj($polaczenie, 'dramat'); ?>
    </section>
    <section>
        <h2>Zaległe książki</h2>
        <ul>
            <?php
            $wynik = mysqli_query($polaczenie, "SELECT ksiazka.tytul, wypozyczenia.id_cz, wypozyczenia.data_odd FROM ksiazka JOIN wypozyczenia ON ksiazka.id = wypozyczenia.id_ks ORDER BY wypozyczenia.data_odd ASC LIMIT 15;");
            while ($wiersz = mysqli_fetch_row($wynik)) {
                echo "<li>$wiersz[0] $wiersz[1] $wiersz[2]</li>";
            }
            ?>
        </ul>
    </section>
    <footer>
        <p><strong>Autor: 00000000000</strong></p>
    </footer>
</body>
</html>
<?php
mysqli_close($polaczenie);
?>
