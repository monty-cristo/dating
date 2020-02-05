"use strict";

function getDropdownList(array, property) {
  const properties = array.map(user => user[property]);
  const uniqueProperties = [...new Set(properties)];

  return uniqueProperties;
}

async function getDropdownArray() {
  const url = "https://scrumserver.tenobe.org/scrum/api/profiel/read.php";

  try {
    const response = await fetch(url);
    const users = await response.json();

    const haarkleuren = getDropdownList(users, "haarkleur");
    const oogkleuren = getDropdownList(users, "oogkleur");

    return [ haarkleuren, oogkleuren ];
  } catch ({ message }) {
    console.log(message);
  }
}

export default getDropdownArray;
