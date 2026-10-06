
function wybierz(numer) {
  document.getElementById("duzy").src = numer + "d.bmp";
}
function oblicz() {
  var a = parseFloat(document.getElementById("bok").value);
  var b = parseFloat(document.getElementById("wys").value);
  var obraz = document.getElementById("duzy").getAttribute("src");
  var pole;
  if (obraz == "2d.bmp") {
    pole = a * b;
  } else {
    pole = 0.5 * a * b;
  }
  document.getElementById("wynik").innerHTML = pole;
}
