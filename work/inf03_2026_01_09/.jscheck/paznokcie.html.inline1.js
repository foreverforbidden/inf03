
function pokazSekcje(numer) {
  for (var i = 1; i <= 3; i++) {
    var sekcja = document.getElementById("sekcja" + i);
    var przycisk = document.getElementById("przycisk" + i);
    if (i === numer) {
      sekcja.style.display = "block";
      przycisk.style.backgroundColor = "Salmon";
    } else {
      sekcja.style.display = "none";
      przycisk.style.backgroundColor = "Crimson";
    }
  }
}
