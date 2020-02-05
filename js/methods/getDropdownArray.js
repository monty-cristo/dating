"use strict";

async function getDropdownList(property) {
    const url = "https://scrumserver.tenobe.org/scrum/api/profiel/read.php";
    
    try {
        const response = await fetch(url);
        const users = await response.json();

        const properties = users.map(user => user[property]);
        const uniqueProperties = [...new Set(properties)];

        return uniqueProperties;
    } catch ({ message }) {
        console.log(message);
    }
}

export default getDropdownList;