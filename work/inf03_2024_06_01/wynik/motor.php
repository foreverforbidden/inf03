<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Motocykle</title>
<link rel="stylesheet" href="styl.css">
</head>
<body>
<img src="motor.png" alt="motocykl">
<header><h1>Motocykle - moja pasja</h1></header>
<nav>
<h2>Gdzie pojechać?</h2>
<dl>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'motory');
$wynikWycieczek = mysqli_query($polaczenie, "SELECT wycieczki.nazwa, wycieczki.opis, wycieczki.poczatek, zdjecia.zrodlo FROM wycieczki JOIN zdjecia ON wycieczki.zdjecia_id = zdjecia.id;");
while ($wycieczka = mysqli_fetch_array($wynikWycieczek)) {
    echo "<dt>$wycieczka[0], rozpoczyna się w $wycieczka[2], <a href=\"$wycieczka[3].jpg\">zobacz zdjęcie</a></dt>";
    echo "<dd>$wycieczka[1]</dd>";
}
?>
</dl>
</nav>
<aside>
<h2>Co kupić?</h2>
<ol>
<li>Honda CBR125R</li>
<li>Yamaha YBR125</li>
<li>Honda VFR800i</li>
<li>Honda CBR1100XX</li>
<li>BMW R1200GS LC</li>
</ol>
</aside>
<section>
<h2>Statystyki</h2>
<p>Wpisanych wycieczek: 
<?php
$wynikLiczby = mysqli_query($polaczenie, "SELECT COUNT(*) FROM wycieczki;");
$liczbaWycieczek = mysqli_fetch_row($wynikLiczby);
echo $liczbaWycieczek[0];
mysqli_close($polaczenie);
?>
</p>
<p>Użytkowników forum: 200</p>
<p>Przesłanych zdjęć: 1300</p>
</section>
<footer><p>Stronę wykonał: 00000000000</p></footer>
</body>
</html>
