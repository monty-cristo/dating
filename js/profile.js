"use strict";

window.onload = function () {

    let profielData;

    let profielId = '3';
    //let profielId = Math.floor(Math.random() * 7)+1; //random profiel van 0 - 7

    let url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + sessionStorage.getItem("user");

    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {

            profielData = data;

            document.getElementById('detailNick').value = profielData.nickname;
            document.getElementById('detailFnaam').value = profielData.familienaam;
            document.getElementById('detailVnaam').value = profielData.voornaam;
            document.getElementById('detailGeboortedatum').value = profielData.geboortedatum;
            document.getElementById('detailHaarkleur').value = profielData.haarkleur;
            document.getElementById('detailBeroep').value = profielData.beroep;
            document.getElementById('detailEmail').value = profielData.email;
            document.getElementById('detailFoto').setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + profielData.foto);
            document.getElementById('detailFoto').setAttribute('alt', 'foto van ' + profielData.voornaam + ' ' + profielData.familienaam);
            document.getElementById('profielVan').innerText = profielData.voornaam+ " " + profielData.familienaam;
            document.getElementById('detailSexe').value = profielData.sexe;
            document.getElementById('detailOogkleur').value = profielData.oogkleur;
            document.getElementById('detailGewicht').value = profielData.gewicht;
            document.getElementById('detailGrootte').value = profielData.grootte;
            document.getElementById('detailWachtWoord').value = profielData.wachtwoord;
            document.getElementById("lovecoin").innerText = profielData.lovecoins;


        })
        .catch(function (error) { console.log(error); });


    document.getElementById('btnSubmit').addEventListener('click', function (e) {
        let urlUpdate = 'https://scrumserver.tenobe.org/scrum/api/profiel/update.php';

        profielData.nickname = document.getElementById('detailNick').value;
        profielData.familienaam = document.getElementById('detailFnaam').value;
        profielData.voornaam = document.getElementById('detailVnaam').value;
        profielData.geboortedatum = document.getElementById('detailGeboortedatum').value;
        profielData.haarkleur = document.getElementById('detailHaarkleur').value;
        profielData.beroep = document.getElementById('detailBeroep').value;
        profielData.email = document.getElementById('detailEmail').value;
        profielData.lovecoins = document.getElementById('detailLovecoins').value;
        profielData.sexe = document.getElementById('detailSexe').value;
        profielData.oogkleur = document.getElementById('detailOogkleur').value;
        profielData.gewicht = document.getElementById('detailGewicht').value;
        profielData.grootte = document.getElementById('detailGrootte').value;
        profielData.wachtwoord = document.getElementById('detailWachtWoord').value;

        var request = new Request(urlUpdate, {
            method: 'PUT',
            body: JSON.stringify(profielData),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });

        fetch(request)
            .then(function (resp) { return resp.json(); })
            .then(function (data) { console.log(data); })
            .catch(function (error) { console.log(error); });

    });         
};