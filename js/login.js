"use strict";
window.onload = function() {
  document.getElementById("btnLogin").addEventListener("click", async () => {
    const nickname = document.getElementById("loginNick").value;
    const wachtwoord = document.getElementById("loginPas").value;

    const url =
      "https://scrumserver.tenobe.org/scrum/api/profiel/authenticate.php";

    const data = {
      nickname,
      wachtwoord
    };

    const request = new Request(url, {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });

    try {
      const response = await fetch(request);
      const { message, id } = await response.json();

      if (message == "Authorized") {
        console.log("Reactie van backend API : Correcte gegevens");
        sessionStorage.setItem("user", id);
        window.location.href = `zoekpagina.html`;
      }
    } catch ({ message }) {
      alert(message);
    }
  });
};
