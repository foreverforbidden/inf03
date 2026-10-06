<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Korona gór polskich</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <img src="logo.png" alt="Logo">
    </header>
    <header>
        <h1>Korona Gór Polskich</h1>
    </header>
    <main>
<?php
$polaczenie = mysqli_connect("localhost", "root", "", "korona");
$wynik = mysqli_query($polaczenie, "SELECT id, nazwa FROM szczyty ORDER BY wysokosc DESC;");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<span><a href=\"szczyty.php?id=$wiersz[0]\">$wiersz[1]</a></span>";
}
mysqli_close($polaczenie);
?>
    </main>
    <section>
<?php
$polaczenie = mysqli_connect("localhost", "root", "", "korona");
$wynik = mysqli_query($polaczenie, "SELECT plik, nazwa FROM szczyty LIMIT 10;");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<img class=\"miniatury\" src=\"$wiersz[0]\" alt=\"$wiersz[1]\">";
}
mysqli_close($polaczenie);
?>
    </section>
    <footer>
        <h3>Kontakt</h3>
        <ul>
            <li>Zadzwoń do nas: 111 222 333</li>
            <li><a href="mailto:korona@gory.pl">Napisz do nas</a></li>
        </ul>
    </footer>
    <footer>
        <h3>&copy; Wykonane przez: 00000000000</h3>
    </footer>
</body>
</html>
