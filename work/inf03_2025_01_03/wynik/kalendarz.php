<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Kalendarz</title>
<link rel="stylesheet" href="styl.css">
</head>
<body>
<header>
<h1>Dni, miesiące, lata...</h1>
</header>
<section id="napis">
<p>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'kalendarz');
mysqli_set_charset($polaczenie, 'utf8');
$dniTygodnia = [1 => 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela'];
$dzisiajMD = date('m-d');
$wynik = mysqli_query($polaczenie, "SELECT imiona FROM imieniny WHERE data = '$dzisiajMD'");
$wiersz = mysqli_fetch_row($wynik);
echo "Dzisiaj jest " . $dniTygodnia[date('N')] . ", " . date('d-m-Y') . ", imieniny: " . $wiersz[0];
?>
</p>
</section>
<main>
<section id="lewy">
<table>
<tr><th>liczba dni</th><th>miesiąc</th></tr>
<tr><td rowspan="7">31</td><td>styczeń</td></tr>
<tr><td>marzec</td></tr>
<tr><td>maj</td></tr>
<tr><td>lipiec</td></tr>
<tr><td>sierpień</td></tr>
<tr><td>październik</td></tr>
<tr><td>grudzień</td></tr>
<tr><td rowspan="4">30</td><td>kwiecień</td></tr>
<tr><td>czerwiec</td></tr>
<tr><td>wrzesień</td></tr>
<tr><td>listopad</td></tr>
<tr><td>28 lub 29</td><td>luty</td></tr>
</table>
</section>
<section id="srodkowy">
<h2>Sprawdź kto ma urodziny</h2>
<form method="post" action="kalendarz.php">
<input type="date" name="data" min="2024-01-01" max="2024-12-31" required>
<input type="submit" value="wyślij">
</form>
<?php
if (isset($_POST['data'])) {
    $dataFormularza = $_POST['data'];
    $dataMD = date('m-d', strtotime($dataFormularza));
    $wynik2 = mysqli_query($polaczenie, "SELECT imiona FROM imieniny WHERE data = '$dataMD'");
    $wiersz2 = mysqli_fetch_row($wynik2);
    echo "<p>Dnia " . htmlspecialchars($dataFormularza) . " są imieniny: " . $wiersz2[0] . "</p>";
}
mysqli_close($polaczenie);
?>
</section>
<section id="prawy">
<a href="https://pl.wikipedia.org/wiki/Kalendarz_Majów" target="_blank"><img src="kalendarz.gif" alt="Kalendarz Majów"></a>
<h2>Rodzaje kalendarzy</h2>
<ol>
<li>słoneczny
<ul>
<li>kalendarz Majów</li>
<li>juliański</li>
<li>gregoriański</li>
</ul></li>
<li>księżycowy
<ul>
<li>starogrecki</li>
<li>babiloński</li>
</ul></li>
</ol>
</section>
</main>
<footer>
<p>Stronę opracował(a): 00000000000</p>
</footer>
</body>
</html>
