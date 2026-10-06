
var numerZdjecia = 1;
var liczbaZdjec = 7;
function pokazZdjecie() {
    document.getElementById("aktywneZdjecie").src = numerZdjecia + ".jpg";
}
function nastepneZdjecie() {
    numerZdjecia++;
    if (numerZdjecia > liczbaZdjec) {
        numerZdjecia = 1;
    }
    pokazZdjecie();
}
function poprzednieZdjecie() {
    numerZdjecia--;
    if (numerZdjecia < 1) {
        numerZdjecia = liczbaZdjec;
    }
    pokazZdjecie();
}
