
function dodajWzor() {
    var sciezka = document.getElementById("plik").value;
    var kolor = document.getElementById("kolor").value;
    var cena = document.getElementById("cena").value;
    var nazwaPliku = sciezka.substring(sciezka.lastIndexOf("\\") + 1);
    alert("Wzór: " + nazwaPliku + ", kolor " + kolor + " w cenie " + cena + " zł");
    var obraz = document.createElement("img");
    obraz.src = nazwaPliku;
    obraz.alt = nazwaPliku;
    obraz.className = "miniatura";
    document.getElementById("galeria").appendChild(obraz);
}
