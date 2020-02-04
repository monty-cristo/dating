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
      const user = await response.json();

      if (user.message == "Authorized") {
        console.log("Reactie van backend API : Correcte gegevens");
        sessionStorage.setItem("user", user.id);
        window.location.href = "profile.html";
      }
    } catch ({ message }) {
      alert(message);
    }
  });
};
