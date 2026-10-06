<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Sklep dla uczniów</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'sklep');
?>
    <section id="baner">
        <h1>Dzisiejsze promocje naszego sklepu</h1>
    </section>
    <section id="lewy">
        <h2>Taniej o 30%</h2>
        <ol>
<?php
$wynikPromocji = mysqli_query($polaczenie, "SELECT nazwa FROM towary WHERE promocja = 1");
while ($towar = mysqli_fetch_row($wynikPromocji)) {
    echo "<li>" . $towar[0] . "</li>";
}
?>
        </ol>
    </section>
    <section id="srodkowy">
        <h2>Sprawdź cenę</h2>
        <form method="post" action="index.php">
            <select name="towar">
                <option>Gumka do mazania</option>
                <option>Cienkopis</option>
                <option>Pisaki 60 szt.</option>
                <option>Markery 4 szt.</option>
            </select>
            <input type="submit" value="SPRAWDŹ">
        </form>
        <section id="wynik">
<?php
if (isset($_POST['towar'])) {
    $nazwaTowaru = mysqli_real_escape_string($polaczenie, $_POST['towar']);
    $wynikCeny = mysqli_query($polaczenie, "SELECT cena FROM towary WHERE nazwa = '$nazwaTowaru'");
    while ($wiersz = mysqli_fetch_row($wynikCeny)) {
        $cenaRegularna = $wiersz[0];
        $cenaPromocyjna = round($cenaRegularna * 0.7, 2);
        echo "cena regularna: " . $cenaRegularna . "<br>";
        echo "cena w promocji 30%: " . $cenaPromocyjna;
    }
}
?>
        </section>
    </section>
    <section id="prawy">
        <h2>Kontakt</h2>
        <p>e-mail: <a href="mailto:bok@sklep.pl">bok@sklep.pl</a></p>
        <img src="promocja.png" alt="promocja">
    </section>
    <section id="stopka">
        <h4>Autor strony: 00000000000</h4>
    </section>
<?php
mysqli_close($polaczenie);
?>
</body>
</html>
