
            function obliczCene() {
                var suma = 0;
                if (document.getElementById("peeling").checked) suma += 45;
                if (document.getElementById("maska").checked) suma += 30;
                if (document.getElementById("masaz").checked) suma += 20;
                if (document.getElementById("makijaz").checked) suma += 50;
                document.getElementById("wynik").innerHTML = "Cena zabiegów: " + suma;
            }
        