"use strict";

const profielId = new URL(window.location.href).searchParams.get("id");

window.onload = function() {
  let profielData;

  let url =
    "https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=" +
    sessionStorage.getItem("user");

  fetch(url)
    .then(function(resp) {
      return resp.json();
    })
    .then(function(data) {
      profielData = data;

      document
        .getElementById("navigatieFoto")
        .setAttribute(
          "src",
          "https://scrumserver.tenobe.org/scrum/img/" + profielData.foto
        );
      document.getElementById("naarProfiel").innerText = profielData.nickname;
      console.log(profiel);
    })
    .catch(function(error) {
      console.log(error);
    });
};

document.getElementById("naarProfiel").onclick = function() {
  const url = "/profielAnderePersoon.html?id=" + sessionStorage.getItem("user");
  this.setAttribute("href", url);
};

document.getElementById("afmelden").onclick = function() {
  sessionStorage.removeItem("user");
};
