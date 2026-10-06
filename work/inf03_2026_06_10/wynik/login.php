<?php
session_start();
if (isset($_POST['login']) && isset($_POST['haslo'])) {
    if ($_POST['login'] == 'admin' && $_POST['haslo'] == 'TajneHaslo321*') {
        $_SESSION['uzytkownik'] = $_POST['login'];
        header("Location: wyniki.php");
        exit;
    }
}
?>
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <title>Zaloguj się</title>
    <link rel="stylesheet" href="styl.css">
</head>
<body>
    <header>
        <h1>Portal laboratorium</h1>
    </header>
    <main class="logowanie">
        <h2>Zaloguj się do systemu</h2>
        <form method="post" action="login.php">
            <label for="login">Login:</label>
            <input type="text" name="login" id="login"><br>
            <label for="haslo">Hasło:</label>
            <input type="password" name="haslo" id="haslo"><br>
            <input type="submit" value="Zaloguj">
        </form>
    </main>
    <footer>
        <p>Wykonał: 00000000000</p>
    </footer>
</body>
</html>
