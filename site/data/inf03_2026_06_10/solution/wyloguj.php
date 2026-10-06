<?php
session_start();
if (isset($_SESSION['uzytkownik'])) {
    unset($_SESSION['uzytkownik']);
}
session_destroy();
header("Location: login.php");
exit;
