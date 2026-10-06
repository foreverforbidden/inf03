
var pacjenci = {
    "id": "1",
    "imie": "Agnieszka",
    "nazwisko": "Nowak",
    "wystawca": "lek. Marian Kowal",
    "numer": "4387203",
    "recepty": [
        {"id": "0",  "data": "8.03.2025", "kod": "1220", "lek1": "Witamina C", "lek2": "Potas", "lek3": "Syrop prawoślazowy"},
        {"id": "1",  "data": "23.04.2025", "kod": "4634", "lek1": "APAP", "lek2": "Witamina B", "lek3": ""},
        {"id": "2",  "data": "13.05.2025", "kod": "2913", "lek1": "Melatonina", "lek2": "", "lek3": ""},
        {"id": "3",  "data": "30.10.2025", "kod": "1105", "lek1": "Witamina C", "lek2": "Calcium", "lek3": "Sinupret"}
    ]
};

var blokPrawa2 = document.getElementById("prawa2");
for (var i = 0; i < pacjenci.recepty.length; i++) {
    var recepta = pacjenci.recepty[i];
    var blok = document.createElement("div");
    blok.classList.add("recepty");

    var data = document.createElement("p");
    data.innerText = "Data wystawienia: " + recepta.data;
    blok.appendChild(data);

    var lista = document.createElement("ol");
    var leki = [recepta.lek1, recepta.lek2, recepta.lek3];
    for (var j = 0; j < leki.length; j++) {
        if (leki[j] && leki[j] !== "") {
            var pozycja = document.createElement("li");
            pozycja.innerText = leki[j];
            lista.appendChild(pozycja);
        }
    }
    blok.appendChild(lista);

    var kod = document.createElement("h4");
    kod.innerText = "Kod: " + recepta.kod;
    blok.appendChild(kod);

    blokPrawa2.appendChild(blok);
}
