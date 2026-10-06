
function wykonane(przycisk) {
    przycisk.parentNode.style.textDecoration = "line-through";
}
function dodajZadanie() {
    const pole = document.getElementById("poleZadania");
    const element = document.createElement("li");
    element.appendChild(document.createTextNode(pole.value));
    const przycisk = document.createElement("button");
    przycisk.innerText = "Wykonane";
    przycisk.onclick = function () { wykonane(przycisk); };
    element.appendChild(przycisk);
    document.getElementById("listaZadan").appendChild(element);
}
