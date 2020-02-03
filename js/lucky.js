window.onload = () => {
  const btnLucky = document.getElementById("btnLucky");
  btnLucky.onclick = async () => {
    try {
      let url = "https://scrumserver.tenobe.org/scrum/api/profiel/read.php";

      let response = await fetch(url);
      const users = await response.json();

      let randomUserId = Math.floor(Math.random() * users.length);

      //check if we didn't just grab the current user, not if their not into that at least.
      while (randomUserId === sessionStorage.getItem("user")) {
        randomUserId = Math.floor(Math.random() * users.lenght);
      }

      //Should redirect to the random users profile page.
      //window.location.href = `/profile?id=${randomUserId}`;
      url = `https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=${randomUserId}`;
      response = await fetch(url);
      const user = await response.json();

      console.log(user);
    } catch (error) {
      alert(error);
    }
  };
};
