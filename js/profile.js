"use strict";
if (sessionStorage.getItem("user") = null) {
    window.location.href = `/register.html`;
}
import getDropdownArray from "./methods/getDropdownArray.js";
import createDropdown from "./methods/createDropdown.js";
window.onload = async function () {

    const oogKleur = document.getElementById('detailOogkleur');
    const haarKleur = document.getElementById('detailHaarkleur');

    const [haarkleuren, oogkleuren] = await getDropdownArray();
    createDropdown(haarkleuren, haarKleur);
    createDropdown(oogkleuren, oogKleur);

    let profielData;

    let url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + sessionStorage.getItem("user");

    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {

            profielData = data;

            document.getElementById('detailFnaam').value = profielData.familienaam;
            document.getElementById('detailVnaam').value = profielData.voornaam;
            document.getElementById('detailGeboortedatum').value = profielData.geboortedatum;
            document.getElementById('detailHaarkleur').value = profielData.haarkleur;
            document.getElementById('detailBeroep').value = profielData.beroep;
            document.getElementById('detailEmail').value = profielData.email;
            document.getElementById('detailFoto').setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + profielData.foto);
            document.getElementById('detailFoto').setAttribute('alt', 'foto van ' + profielData.voornaam + ' ' + profielData.familienaam);
            document.getElementById('profielVan').innerText = profielData.voornaam + " " + profielData.familienaam;
            document.getElementById('detailSexe').value = profielData.sexe;
            document.getElementById('detailOogkleur').value = profielData.oogkleur;
            document.getElementById('detailGewicht').value = profielData.gewicht;
            document.getElementById('detailGrootte').value = profielData.grootte;
            document.getElementById('detailWachtWoord').value = profielData.wachtwoord;



        })
        .catch(function (error) { console.log(error); });

    const datum = document.getElementById('detailGeboortedatum');

    const currentDate = new Date();

    const max = new Date();
    max.setFullYear(currentDate.getFullYear() - 18);
    max.setMonth(currentDate.getMonth());
    max.setDate(currentDate.getDate());
    datum.max = max.toISOString().slice(0, 10);

    const min = new Date();
    min.setFullYear(currentDate.getFullYear() - 105);
    min.setMonth(currentDate.getMonth());
    min.setDate(currentDate.getDate());
    datum.min = min.toISOString().slice(0, 10);

    document.getElementById("form").addEventListener("submit", async e => {
        e.preventDefault();

        let urlUpdate = 'https://scrumserver.tenobe.org/scrum/api/profiel/update.php';

        profielData.familienaam = document.getElementById('detailFnaam').value;
        profielData.voornaam = document.getElementById('detailVnaam').value;
        profielData.haarkleur = document.getElementById('detailHaarkleur').value;
        profielData.beroep = document.getElementById('detailBeroep').value;
        profielData.email = document.getElementById('detailEmail').value;
        profielData.sexe = document.getElementById('detailSexe').value;
        profielData.oogkleur = document.getElementById('detailOogkleur').value;
        profielData.gewicht = document.getElementById('detailGewicht').value;
        profielData.grootte = document.getElementById('detailGrootte').value;
        profielData.wachtwoord = document.getElementById('detailWachtWoord').value;


        const request = new Request(urlUpdate, {
            method: 'PUT',
            body: JSON.stringify(profielData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        try {
            await fetch(request);

            window.location.href = `/profielAnderePersoon.html?id=${sessionStorage.getItem("user")}`;
        } catch (error) {
            console.log(error.message);
        }
    })

    // document.getElementById("btnDelete").onclick = function () {
    //     window.location.href = "/index.html";
    // }
};