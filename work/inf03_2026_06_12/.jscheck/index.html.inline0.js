
function przepiszWzrost() {
  document.getElementById("wzrost").value = document.getElementById("suwak").value;
}
function obliczRozmiarRamy() {
  var wzrost = document.getElementById("wzrost").value;
  var wspolczynnik = 0.26;
  if (document.getElementById("szosa").checked) {
    wspolczynnik = 0.3;
  } else if (document.getElementById("trekking").checked) {
    wspolczynnik = 0.28;
  }
  var rozmiar = Math.round(wzrost * wspolczynnik / 2.54);
  document.getElementById("wynik").innerHTML = "Zalecany rozmiar ramy to: " + rozmiar + " cali";
}
function pokazDate() {
  var dzis = new Date();
  var dzien = String(dzis.getDate()).padStart(2, "0");
  var miesiac = String(dzis.getMonth() + 1).padStart(2, "0");
  document.getElementById("data").innerHTML = dzien + "." + miesiac + "." + dzis.getFullYear();
}
window.onload = pokazDate;
