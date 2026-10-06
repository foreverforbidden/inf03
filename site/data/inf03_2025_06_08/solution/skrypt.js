function pokazSekcje(numer) {
    for (var i = 1; i <= 3; i++) {
        document.getElementById("blok" + i).style.backgroundColor = "#FFAEA5";
        document.getElementById("sekcja" + i).style.display = "none";
    }
    document.getElementById("blok" + numer).style.backgroundColor = "MistyRose";
    document.getElementById("sekcja" + numer).style.display = "block";
}
