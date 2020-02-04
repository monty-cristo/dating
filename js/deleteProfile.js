window.onload = () => {
  const btnDelete = document.getElementById("btnDelete");
  btnDelete.onclick = async () => {
    const wachtwoordPrompt = prompt("Voer uw wachtwoord in");

    try {
      const id = sessionStorage.getItem("user");
      let url = `https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=${id}`;

      let response = await fetch(url);
      let { wachtwoord } = await response.json();

      if (wachtwoord === wachtwoordPrompt) {
        const data = {
          id
        };

        url = "https://scrumserver.tenobe.org/scrum/api/profiel/delete.php";

        const request = new Request(url, {
          method: "DELETE",
          body: JSON.stringify(data),
          headers: new Headers({
            "Content-Type": "application/json"
          })
        });

        console.log(`Deleting user with id: ${id}`);

        response = await fetch(request);
        const message = await response.json();
        console.log(message);
        window.location.href = "/";
      }
    } catch ({ message }) {
      alert(message);
    }
  };
};
