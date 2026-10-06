
        var aktualnyGracz = "kółko";
        function ruch(obraz) {
            if (!obraz.src.endsWith("nic.png")) {
                return;
            }
            var lewa = document.getElementById("lewa");
            var prawa = document.getElementById("prawa");
            if (aktualnyGracz === "kółko") {
                obraz.src = "o.png";
                lewa.style.visibility = "hidden";
                prawa.style.visibility = "visible";
                aktualnyGracz = "krzyżyk";
            } else {
                obraz.src = "x.png";
                lewa.style.visibility = "visible";
                prawa.style.visibility = "hidden";
                aktualnyGracz = "kółko";
            }
        }
    