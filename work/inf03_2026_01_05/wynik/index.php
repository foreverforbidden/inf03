<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>ZGŁOSZENIA</title>
<link rel="stylesheet" href="styl.css">
</head>
<body>
<header><h1>Zgłoszenia wydarzeń</h1></header>
<main>
<section id="lewy">
<h2>Personel</h2>
<form method="post" action="index.php">
<input type="radio" name="status" id="policjant" value="policjant" checked><label for="policjant">Policjant</label>
<input type="radio" name="status" id="ratownik" value="ratownik"><label for="ratownik">Ratownik</label>
<button type="submit">Pokaż</button>
</form>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'zgloszenia');
$opcja = 'policjant';
if (isset($_POST['status']) && $_POST['status'] === 'ratownik') {
    $opcja = 'ratownik';
}
echo "<h3>Wybrano opcję: $opcja</h3>";
echo "<table><tr><th>Id</th><th>Imię</th><th>Nazwisko</th></tr>";
$wynik = mysqli_query($polaczenie, "SELECT id, imie, nazwisko FROM personel WHERE status = '$opcja'");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<tr><td>$wiersz[0]</td><td>$wiersz[1]</td><td>$wiersz[2]</td></tr>";
}
echo "</table>";
?>
</section>
<section id="prawy">
<h2>Nowe zgłoszenie</h2>
<ol>
<?php
$wynik = mysqli_query($polaczenie, "SELECT id, nazwisko FROM personel WHERE id NOT IN (SELECT id_personel FROM rejestr)");
while ($wiersz = mysqli_fetch_row($wynik)) {
    echo "<li>$wiersz[0] $wiersz[1]</li>";
}
?>
</ol>
<form method="post" action="index.php">
<label for="idosoby">Wybierz id osoby z listy: </label>
<input type="number" name="idosoby" id="idosoby">
<button type="submit">Dodaj zgłoszenie</button>
</form>
<?php
if (isset($_POST['idosoby']) && $_POST['idosoby'] !== '') {
    $idOsoby = (int)$_POST['idosoby'];
    mysqli_query($polaczenie, "INSERT INTO rejestr (id_personel, id_pojazd, data) VALUES ($idOsoby, 14, CURDATE())");
}
mysqli_close($polaczenie);
?>
</section>
</main>
<footer><p>Stronę wykonał: 00000000000</p></footer>
</body>
</html>
