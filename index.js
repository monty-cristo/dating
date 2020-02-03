"use strict";
window.onload = function() {
    document
      .getElementById("btnLogin")
      .addEventListener("click", async function(e) {
        console.log("Je hebt op de Login-knop geklikt");
        const nickname = document.getElementById("loginNick").value;
        const wachtwoord = document.getElementById("loginPas").value;

        console.log("nickname = " + nickname);
        console.log("wachtwoord = " + wachtwoord);

        const url =
          "https://scrumserver.tenobe.org/scrum/api/profiel/authenticate.php";

        console.log("Backend API url = " + url);

        const data = {
          nickname,
          wachtwoord
        };

        console.log("Deze data wordt verstuurd : ");
        console.log(data);

        const request = new Request(url, {
          method: "POST",
          body: JSON.stringify(data),
          headers: new Headers({
            "Content-Type": "application/json"
          })
        });

        console.log("Deze request wordt verstuurd : ");
        console.log(request);

        const response = await fetch(request);
        const foo = await response.json();

        if (foo.message == "Authorized") {
          console.log("Reactie van backend API : Correcte gegevens");
          window.location.href = "profile.html";
        }
      });
  };