
function pokazBlokDrugi() {
    document.getElementById("blok1").style.visibility = "hidden";
    document.getElementById("blok2").style.visibility = "visible";
}
function pokazBlokTrzeci() {
    document.getElementById("blok2").style.visibility = "hidden";
    document.getElementById("blok3").style.visibility = "visible";
}
function zatwierdzFormularz() {
    var haslo = document.getElementById("haslo1").value;
    var hasloPowtorzone = document.getElementById("haslo2").value;
    if (haslo !== hasloPowtorzone) {
        alert("Podane hasła różnią się");
    }
    var imie = document.getElementById("imie").value;
    var nazwisko = document.getElementById("nazwisko").value;
    console.log("Witaj " + imie + " " + nazwisko);
}
