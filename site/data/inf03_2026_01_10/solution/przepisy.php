<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Blog kulinarny</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
<?php
$conn = mysqli_connect('localhost', 'root', '', 'przepisy');
$id = isset($_GET['id']) ? intval($_GET['id']) : 7;
?>
    <aside>
        <a href="przepisy.php?id=1">Sernik</a><br>
        <a href="przepisy.php?id=2">Sałatka</a><br>
        <a href="przepisy.php?id=3">Pankejki</a><br>
        <a href="przepisy.php?id=4">Nugetsy</a><br>
        <a href="przepisy.php?id=5">Łosoś</a><br>
        <a href="przepisy.php?id=6">Kociołek</a><br>
        <a href="przepisy.php?id=7">Jagnięcina</a><br>
        <a href="przepisy.php?id=8">Hamburgery</a><br>
        <a href="przepisy.php?id=9">Eklerki</a><br>
        <a href="przepisy.php?id=10">Churros</a>
        <p>Autor: 00000000000</p>
    </aside>
    <main>
        <h1><?php
        $wynik = mysqli_query($conn, "SELECT potrawy.nazwa, rodzaje.rodzaj FROM potrawy JOIN rodzaje ON potrawy.idRodzaje = rodzaje.idRodzaje WHERE potrawy.idPotrawy = $id");
        while ($wiersz = mysqli_fetch_array($wynik)) {
            echo $wiersz['rodzaj'];
        }
        ?></h1>
        <?php
        $wynik = mysqli_query($conn, "SELECT nazwa, trudnosc, kalorie FROM potrawy WHERE idPotrawy = $id");
        $trudnosci = [1 => 'łatwe', 2 => 'średnie', 3 => 'trudne'];
        while ($wiersz = mysqli_fetch_array($wynik)) {
            echo "<h2>" . $wiersz['nazwa'] . "</h2>";
            echo "<p>Trudność: " . $trudnosci[$wiersz['trudnosc']] . ", Kalorie: " . $wiersz['kalorie'] . "</p>";
        }
        ?>
        <img src="separator.png" alt="przepis">
        <p>Alergeny: <?php
        $wynik = mysqli_query($conn, "SELECT potrawy.nazwa, alergeny.alergen FROM potrawy JOIN lista_alergenow ON potrawy.idPotrawy = lista_alergenow.idPotrawy JOIN alergeny ON lista_alergenow.idAlergeny = alergeny.idAlergeny WHERE potrawy.idPotrawy = $id");
        while ($wiersz = mysqli_fetch_array($wynik)) {
            echo $wiersz['alergen'] . " ";
        }
        ?></p>
        <h2>Składniki</h2>
        <ul>
            <li>Lorem 1 kg</li>
            <li>Ipsum 2 szt.</li>
            <li>Dolor 200 g</li>
            <li>Sit amet (szczypta)</li>
        </ul>
        <?php
        $wynik = mysqli_query($conn, "SELECT przepis, plik FROM potrawy WHERE idPotrawy = $id");
        $plik = '';
        while ($wiersz = mysqli_fetch_array($wynik)) {
            echo "<p>" . $wiersz['przepis'] . "</p>";
            $plik = $wiersz['plik'];
        }
        mysqli_close($conn);
        ?>
    </main>
    <section style="background-image: url('<?php echo $plik; ?>');">
        <h1>Blog Kulinarny</h1>
    </section>
</body>
</html>
