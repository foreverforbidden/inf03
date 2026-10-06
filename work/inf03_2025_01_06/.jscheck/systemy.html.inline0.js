
function przelicz() {
  var liczba = parseInt(document.getElementById("liczba").value);
  var wynik = document.getElementById("wynik");
  if (isNaN(liczba) || liczba < 0) { wynik.innerHTML = "Brak obliczeń"; return; }
  var binarny = "";
  do {
    binarny = (liczba % 2) + binarny;
    liczba = Math.floor(liczba / 2);
  } while (liczba > 0);
  var grupy = "";
  for (var i = binarny.length; i > 0; i -= 4) {
    grupy = binarny.substring(Math.max(0, i - 4), i) + (grupy ? " " + grupy : "");
  }
  wynik.innerHTML = grupy + "<sub>(2)</sub>";
}
