function podmienObraz(miniatura) {
    document.getElementById("obrazGlowny").src = miniatura.src;
}

function otworzOkno() {
    var okno = document.getElementById("okno");
    okno.style.display = "block";
    document.getElementById("obrazOkno").src = document.getElementById("obrazGlowny").src;
}

function zamknijOkno() {
    document.getElementById("okno").style.display = "none";
}
