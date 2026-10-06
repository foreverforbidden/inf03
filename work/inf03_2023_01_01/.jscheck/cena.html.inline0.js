
        function policz() {
            var powierzchnia = document.getElementById("powierzchnia").value;
            var puszki = Math.ceil(powierzchnia / 4);
            document.getElementById("wynik").innerHTML = "Liczba potrzebnych puszek: " + puszki;
        }
    