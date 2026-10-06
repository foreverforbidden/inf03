function wyslij() {
    var imie = document.getElementById("imie").value;
    var nazwisko = document.getElementById("nazwisko").value;
    var email = document.getElementById("email").value.toLowerCase();
    var usluga = document.getElementById("usluga").value;
    document.getElementById("komunikat").innerHTML =
        imie + " " + nazwisko + "<br>" + email + "<br>Usługa: " + usluga;
}
