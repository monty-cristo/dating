"use strict";
async function addFavorite() {
const url = "https://scrumserver.tenobe.org/scrum/api/favoriet/like.php";

  const favoriteId = new URL(window.location.href).searchParams.get("id");

  const data = {
    mijnId: sessionStorage.getItem("user"),
    anderId: favoriteId
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
    const { message } = await response.json();

    console.log(message);
  } catch ({ message }) {
    alert(message);
  }
}

export default addFavorite;
