<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Rezerwacja</title>
</head>
<body>
<?php
mysqli_report(MYSQLI_REPORT_OFF);
$polaczenie = mysqli_connect('localhost', 'root', '', 'baza');

$data = $_POST['data'] ?? '';
$liczbaOsob = $_POST['osoby'] ?? '';
$telefon = $_POST['telefon'] ?? '';

$zapytanie = "INSERT INTO rezerwacje (data_rez, liczba_osob, telefon) VALUES ('$data', '$liczbaOsob', '$telefon')";
mysqli_query($polaczenie, $zapytanie);

echo "Dodano rezerwację do bazy";

mysqli_close($polaczenie);
?>
</body>
</html>
