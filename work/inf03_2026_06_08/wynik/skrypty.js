function licznik() {
    var liczbaWejsc = localStorage.getItem("liczbaWejsc");
    if (liczbaWejsc === null) {
        liczbaWejsc = 0;
    }
    liczbaWejsc = parseInt(liczbaWejsc) + 1;
    localStorage.setItem("liczbaWejsc", liczbaWejsc);
    document.getElementById("licznik").innerHTML = "Liczba wejść na stronę: " + liczbaWejsc;
}
