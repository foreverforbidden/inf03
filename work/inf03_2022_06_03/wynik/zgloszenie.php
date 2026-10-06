<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Zgłoszenie</title>
</head>
<body>
<?php
$polaczenie = mysqli_connect('localhost', 'root', '', 'wedkarstwo');
if (isset($_POST['lowisko']) && isset($_POST['data']) && isset($_POST['sedzia'])) {
    $lowisko = (int)$_POST['lowisko'];
    $data = mysqli_real_escape_string($polaczenie, $_POST['data']);
    $sedzia = mysqli_real_escape_string($polaczenie, $_POST['sedzia']);
    $zapytanie = "INSERT INTO zawody_wedkarskie (Karty_wedkarskie_id, Lowisko_id, data_zawodow, sedzia) VALUES (0, $lowisko, '$data', '$sedzia')";
    if (mysqli_query($polaczenie, $zapytanie)) {
        echo "<p>Zawody zostały dodane</p>";
    } else {
        echo "<p>Błąd: " . mysqli_error($polaczenie) . "</p>";
    }
}
mysqli_close($polaczenie);
?>
</body>
</html>
