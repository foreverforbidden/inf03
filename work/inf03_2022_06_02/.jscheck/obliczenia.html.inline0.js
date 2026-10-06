
function oblicz() {
  var rodzaj = Number(document.getElementById("rodzaj").value);
  var litry = Number(document.getElementById("litry").value);
  var koszt = 0;
  if (rodzaj == 1) { koszt = 4 * litry; }
  else if (rodzaj == 2) { koszt = 3.5 * litry; }
  document.getElementById("wynik").innerHTML = "koszt paliwa: " + koszt + " zł";
}
