function wyslij() {
    var imie = document.getElementById("imie").value;
    var nazwisko = document.getElementById("nazwisko").value;
    var zgloszenie = document.getElementById("zgloszenie").value;
    var zaznaczone = document.getElementById("regulamin").checked;
    var komunikat = document.getElementById("komunikat");
    if (!zaznaczone) {
        komunikat.style.color = "red";
        komunikat.innerHTML = "Musisz zapoznać się z regulaminem";
    } else {
        komunikat.style.color = "Navy";
        komunikat.innerHTML = imie.toUpperCase() + " " + nazwisko.toUpperCase() + "<br>Treść Twojej sprawy: " + zgloszenie;
    }
}
