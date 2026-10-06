
function dodajDoKoszyka() {
  var kopie = parseInt(document.getElementById("kopie").value);
  if (isNaN(kopie)) { kopie = 0; }
  var cenaJednostkowa = document.getElementById("matowy").checked ? 2 : 1.5;
  var cena = kopie * cenaJednostkowa;
  var sciezka = document.getElementById("plik").value;
  var nazwaPliku = sciezka.substring(Math.max(sciezka.lastIndexOf("\\"), sciezka.lastIndexOf("/")) + 1);
  var koszyk = document.getElementById("koszyk");
  var obraz = document.createElement("img");
  obraz.src = nazwaPliku;
  var paragrafKopie = document.createElement("p");
  paragrafKopie.innerHTML = "Liczba kopii: " + kopie;
  var paragrafCena = document.createElement("p");
  paragrafCena.innerHTML = "Cena: " + cena;
  koszyk.appendChild(obraz);
  koszyk.appendChild(paragrafKopie);
  koszyk.appendChild(paragrafCena);
}
