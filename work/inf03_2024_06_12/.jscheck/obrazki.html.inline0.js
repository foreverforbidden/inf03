
        document.getElementById("zastosuj1").onclick = function () {
            var obraz = document.getElementById("obraz1");
            if (document.getElementById("blur").checked) {
                obraz.style.filter = "blur(6px)";
            } else if (document.getElementById("sepia").checked) {
                obraz.style.filter = "sepia(100%)";
            } else if (document.getElementById("negatyw").checked) {
                obraz.style.filter = "invert(100%)";
            }
        };
        document.getElementById("kolorowy").onclick = function () {
            document.getElementById("obraz2").style.filter = "grayscale(0%)";
        };
        document.getElementById("czarnoBialy").onclick = function () {
            document.getElementById("obraz2").style.filter = "grayscale(100%)";
        };
        document.getElementById("zastosuj3").onclick = function () {
            var wartosc = document.getElementById("suwakPrzezroczystosc").value;
            document.getElementById("obraz3").style.filter = "opacity(" + wartosc + "%)";
        };
        document.getElementById("zastosuj4").onclick = function () {
            var wartosc = document.getElementById("suwakJasnosc").value;
            document.getElementById("obraz4").style.filter = "brightness(" + wartosc + "%)";
        };
    