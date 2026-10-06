
        function odkryjPromocje() {
            var opcje = document.getElementsByName("dlugosc");
            for (var i = 0; i < opcje.length; i++) {
                if (opcje[i].checked) {
                    var cenaPromocyjna = Number(opcje[i].value) - 10;
                    document.getElementById("wynik").innerHTML = "cena promocyjna: " + cenaPromocyjna;
                }
            }
        }
    