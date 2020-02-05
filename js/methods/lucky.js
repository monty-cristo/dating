"use strict";
async function lucky() {
  try {
    let url = "https://scrumserver.tenobe.org/scrum/api/profiel/read.php";

    let response = await fetch(url);
    const users = await response.json();

    let randomUserId = Math.floor(Math.random() * users.length);

    //check if we didn't just grab the current user
    while (randomUserId === sessionStorage.getItem("user")) {
      randomUserId = Math.floor(Math.random() * users.lenght);
    }

    //Should redirect to the random users profile page.
    window.location.href = `/profile?id=${randomUserId}`;
  } catch ({ message }) {
    alert(message);
  }
}

export default lucky;
