var szerokoscPaska = 4;

function aktywujZakladke(numerZakladki) {
    var zakladki = document.getElementsByClassName("zakladka");
    for (var i = 0; i < zakladki.length; i++) {
        zakladki[i].style.display = "none";
    }
    zakladki[numerZakladki].style.display = "block";
}

function zwiekszPasek() {
    var pasek = document.getElementById("pasek");
    szerokoscPaska += 12;
    if (szerokoscPaska > 100) {
        szerokoscPaska = 100;
    }
    pasek.style.width = szerokoscPaska + "%";
}

function zatwierdzDane() {
    var pola = document.querySelectorAll(".zakladka input");
    var wartosci = [];
    for (var i = 0; i < pola.length; i++) {
        if (pola[i].type == "checkbox") {
            wartosci.push(pola[i].checked ? "on" : "off");
        } else {
            wartosci.push(pola[i].value);
        }
    }
    console.log(wartosci.join(", "));
}
