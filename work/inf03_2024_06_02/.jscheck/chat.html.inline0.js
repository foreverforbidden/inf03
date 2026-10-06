
var odpowiedziKrzysztofa = [
"Świetnie!",
"Kto gra główną rolę?",
"Lubisz filmy Tego reżysera?",
"Będę 10 minut wcześniej",
"Może kupimy sobie popcorn?",
"Ja wolę Colę",
"Zaproszę jeszcze Grześka",
"Tydzień temu też byłem w kinie na Diunie",
"Ja funduję bilety"
];

function dodajWypowiedz(klasaAutora, plikObrazu, tekstAlternatywny, tekst) {
    var oknoChatu = document.getElementById("chat");
    var blokWypowiedzi = document.createElement("div");
    blokWypowiedzi.classList.add("wypowiedz");
    blokWypowiedzi.classList.add(klasaAutora);
    var obraz = document.createElement("img");
    obraz.src = plikObrazu;
    obraz.alt = tekstAlternatywny;
    var akapit = document.createElement("p");
    akapit.innerText = tekst;
    blokWypowiedzi.appendChild(obraz);
    blokWypowiedzi.appendChild(akapit);
    oknoChatu.appendChild(blokWypowiedzi);
    blokWypowiedzi.scrollIntoView();
}

function wyslijWiadomosc() {
    var poleWiadomosci = document.getElementById("wiadomosc");
    dodajWypowiedz("jolka", "Jolka.jpg", "Jolanta Nowak", poleWiadomosci.value);
}

function generujLosowaOdpowiedz() {
    var indeks = Math.floor(Math.random() * 9);
    dodajWypowiedz("krzysiek", "Krzysiek.jpg", "Krzysztof Łukasiński", odpowiedziKrzysztofa[indeks]);
}
