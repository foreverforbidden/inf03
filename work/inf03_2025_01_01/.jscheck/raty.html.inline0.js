
        function obliczRate() {
            var kwota = 0;
            if (document.getElementById("react").checked) kwota += 5000;
            if (document.getElementById("javascript").checked) kwota += 3000;
            var liczbaRat = document.getElementById("liczbaRat").value;
            var miasto = document.getElementById("miasto").value;
            var rata = kwota / liczbaRat;
            document.getElementById("wynik").innerHTML = "Kurs odbędzie się w " + miasto + ". Koszt całkowity: " + kwota + " zł. Płacisz " + liczbaRat + " rat po " + rata + " zł";
        }
    