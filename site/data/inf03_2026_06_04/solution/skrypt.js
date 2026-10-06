var obrazy = ["1.jpg", "2.jpg", "3.jpg"];
var miejsca = ["Barcelona", "Rzym", "Londyn"];
var aktualny = 0;

function ustawKontrolki(sekcjaId, nieaktywne) {
    var kontrolki = document.querySelectorAll("#" + sekcjaId + " input, #" + sekcjaId + " select");
    for (var i = 0; i < kontrolki.length; i++) {
        kontrolki[i].disabled = nieaktywne;
    }
}

function funkcjaUczestnika() {
    document.getElementById("uczestnik").style.backgroundColor = "DodgerBlue";
    document.getElementById("rezerwacja").style.backgroundColor = "SkyBlue";
    ustawKontrolki("klient", false);
    ustawKontrolki("rezerwacje", true);
}

function funkcjaRezerwacji() {
    document.getElementById("uczestnik").style.backgroundColor = "SkyBlue";
    document.getElementById("rezerwacja").style.backgroundColor = "DodgerBlue";
    ustawKontrolki("klient", true);
    ustawKontrolki("rezerwacje", false);
}

function pokazWycieczke() {
    document.getElementById("zdjecie").src = obrazy[aktualny];
    document.getElementById("miejsce").innerHTML = miejsca[aktualny];
}

function poprzedniaWycieczka() {
    aktualny = (aktualny + obrazy.length - 1) % obrazy.length;
    pokazWycieczke();
}

function nastepnaWycieczka() {
    aktualny = (aktualny + 1) % obrazy.length;
    pokazWycieczke();
}

document.getElementById("uczestnik").style.backgroundColor = "DodgerBlue";
