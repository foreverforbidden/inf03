<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Firma Przewozowa</title>
<link rel="stylesheet" href="styles.css">
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'przewozy');
if (isset($_GET['usun'])) {
    $idUsun = intval($_GET['usun']);
    mysqli_query($polaczenie, "DELETE FROM zadania WHERE id_zadania = $idUsun");
}
if (isset($_POST['zadanie']) && isset($_POST['data'])) {
    $zadanie = mysqli_real_escape_string($polaczenie, $_POST['zadanie']);
    $data = mysqli_real_escape_string($polaczenie, $_POST['data']);
    mysqli_query($polaczenie, "INSERT INTO zadania (zadanie, data, osoba_id) VALUES ('$zadanie', '$data', 1)");
}
?>
<header><h1>Firma przewozowa Półdarmo</h1></header>
<nav>
<a href="kw1.png">kwerenda1</a>
<a href="kw2.png">kwerenda2</a>
<a href="kw3.png">kwerenda3</a>
<a href="kw4.png">kwerenda4</a>
</nav>
<main>
<section id="lewa">
<h2>Zadania do wykonania</h2>
<table>
<tr><th>Zadanie do wykonania</th><th>Data realizacji</th><th>Akcja</th></tr>
<?php
$wynik = mysqli_query($polaczenie, "SELECT id_zadania, zadanie, data FROM zadania");
while ($wiersz = mysqli_fetch_array($wynik)) {
    echo "<tr><td>{$wiersz['zadanie']}</td><td>{$wiersz['data']}</td><td><a href=\"przewozy.php?usun={$wiersz['id_zadania']}\">Usuń</a></td></tr>";
}
mysqli_close($polaczenie);
?>
</table>
<form action="przewozy.php" method="post">
<label>Zadanie do wykonania: <input type="text" name="zadanie"></label><br>
<label>Data realizacji: <input type="date" name="data"></label>
<input type="submit" value="Dodaj">
</form>
</section>
<section id="prawa">
<img src="auto.png" alt="auto firmowe">
<h3>Nasza specjalność</h3>
<ul>
<li>Przeprowadzki</li>
<li>Przewóz mebli</li>
<li>Przesyłki gabarytowe</li>
<li>Wynajem pojazdów</li>
<li>Zakupy towarów</li>
</ul>
</section>
</main>
<footer><p>Stronę wykonał: 00000000000</p></footer>
</body>
</html>
