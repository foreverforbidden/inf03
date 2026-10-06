
    function dodajPotrawe(nazwa) {
      var element = document.createElement("li");
      element.innerHTML = nazwa;
      document.getElementById("listaZamowien").appendChild(element);
    }
    function wyczyscListe() {
      document.getElementById("listaZamowien").innerHTML = "";
    }
    function zatwierdzZamowienie() {
      alert("Zamówienie zostało przekazane do realizacji");
      wyczyscListe();
    }
  