
function oblicz() {
    var szerokosc = parseFloat(document.getElementById("szerokosc").value);
    var dlugosc = parseFloat(document.getElementById("dlugosc").value);
    var typ = document.querySelector('input[name="typ"]:checked');
    var wynik = document.getElementById("wynik");
    if (!isNaN(szerokosc) && !isNaN(dlugosc) && typ) {
        var pole = szerokosc * dlugosc;
        var koszt = pole * parseFloat(typ.value);
        wynik.innerHTML = "Pole powierzchni pomieszczenia: " + pole + ", koszt montażu " + koszt;
    } else {
        wynik.innerHTML = "Wprowadź poprawne dane.";
    }
}
