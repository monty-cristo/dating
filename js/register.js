"use strict";
window.onload = () => {
    const form = document.getElementById("registerForm");
    const nickname = document.getElementById("nickname");
    const familienaam = document.getElementById("familienaam");
    const voornaam = document.getElementById("voornaam");
    const geboortedatum = document.getElementById("geboortedatum");
    const haarkleur = document.getElementById("haarkleur");
    const oogkleur = document.getElementById("oogkleur");
    const gewicht = document.getElementById("gewicht");
    const grootte = document.getElementById("grootte");
    const beroep = document.getElementById("beroep");
    const email = document.getElementById("email");
    const wachtwoord = document.getElementById("wachtwoord");
    const wachtwoord2 = document.getElementById("wachtwoord2");
    const sex = document.querySelector('input[name="sex"]:checked');
  
    document.getElementById("btnSubmit").onclick = async e => {
      wachtwoord2.setCustomValidity("");
      if (form.checkValidity()) {
        if (wachtwoord.value === wachtwoord2.value) {
          e.preventDefault();
  
          const data = {
            familienaam: familienaam.value,
            voornaam: voornaam.value,
            geboortedatum: geboortedatum.value,
            email: email.value,
            nickname: nickname.value,
            beroep: beroep.value,
            haarkleur: haarkleur.value,
            oogkleur: oogkleur.value,
            grootte: grootte.value,
            gewicht: gewicht.value,
            wachtwoord: wachtwoord.value,
            sexe: sex.value,
            foto: "no_picture.jpg",
            lovecoins: "3"
          };
  
          const url =
            "https://scrumserver.tenobe.org/scrum/api/profiel/create.php";
  
          const request = new Request(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
              "Content-Type": "application/json"
            })
          });
  
          try {
            const response = await fetch(request);
            const { id } = await response.json();
            sessionStorage.setItem("user", id);
            window.location.href = "/";
          } catch ({ message }) {
            alert(message);
          }
        } else {
          wachtwoord2.setCustomValidity("Wachtwoorden moeten hetzelfde zijn.");
        }
      }
    };
  };
  