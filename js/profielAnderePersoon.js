"use strict";
import addFavorite from './methods/addFavorite.js';

//let profielId = 3 //Math.floor(Math.random() * 4)+1; random profiel van 0 - 4
const profielId = new URL(window.location.href).searchParams.get("id");
let profielData = [];
let lovecoins = 0;
let included = false;
let favorites = [];

if(!sessionStorage.getItem("user")) {
    location.href = "/";
}

//velden invullen
window.onload = async function () {
    //check lock
    try {
        let url = 'https://scrumserver.tenobe.org/scrum/api/ontgrendeling/wieIsVoorMijOntgrendeld.php?profielId=' + sessionStorage.getItem("user");
        let response = await fetch(url);
        const unlocks = await response.json();

        url = `https://scrumserver.tenobe.org/scrum/api/favoriet/read.php?profielId=${profielId}`;
        response = await fetch(url);
        favorites = await response.json();

        included = favorites.map(favorite => favorite.mijnId).includes(profielId);

        if (included) {
            document.getElementById('sterFavoriet').innerText = '★';
        }


        url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + profielId;


        response = await fetch(url);
        profielData = await response.json();

        if (profielId == sessionStorage.getItem("user")) {
            showData(profielData);
            document.getElementById("bericht").style.display = "none";
        } else {

            console.log("foo");

            if (unlocks.includes(profielId)) {
                console.log("showing unlocked user")
                showData(profielData);
            } else {
                //check the lovecoins
                console.log("showing locked user")
                url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + sessionStorage.getItem("user");
                response = await fetch(url);
                let LoggedInUser = await response.json();
                lovecoins = LoggedInUser.lovecoins;

                if (lovecoins <= "0") {
                    //hide lovecoin button
                    document.getElementById("lovecoinButton").style.display = "none";
                }

                document.querySelector("title").innerText = "*****";
                document.getElementById('detailNick').innerText = "*****";
                document.getElementById('detailFnaam').innerText = "*****";
                document.getElementById('detailVnaam').innerText = "*****";
                document.getElementById('detailGeboortedatum').innerText = "*****";
                document.getElementById('detailHaarkleur').innerText = "*****";
                document.getElementById('detailBeroep').innerText = "*****";
                document.getElementById('detailEmail').innerText = "*****";
                document.getElementById('detailFoto').setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + profielData.foto);
                document.getElementById('detailFoto').setAttribute('alt', 'foto van ' + "*****" + ' ' + "*****");
                document.getElementById('profielVan').innerText = "*****";
                document.getElementById('detailSexe').innerText = "*****";
                document.getElementById('detailOogkleur').innerText = "*****";
                document.getElementById('detailGewicht').innerText = "*****";
                document.getElementById('detailGrootte').innerText = "*****";
                document.getElementById('detailSterrenbeeld').innerText = "*****";

            }
        }
    } catch (error) {
        console.log(error.message);
    }

    //favorieten teovoegen
    document.getElementById('buttonLike').onclick = async function (e) {
        e.preventDefault();
        try {
            e.preventDefault();

            console.log(favorites);

            included = favorites.map(favorite => favorite.mijnId).includes(profielId);

            if (included || added) {
                //Delete favorite
                const url = `https://scrumserver.tenobe.org/scrum/api/favoriet/delete.php`;

                const id = favorites.find(favorite => favorite.mijnId == profielId).id;
                console.log(id);

                const data = {
                    id
                }

                const request = new Request(url, {
                    method: "DELETE",
                    body: JSON.stringify(data),
                    headers: new Headers({
                        "Content-Type": "application/json"
                    })
                });

                await fetch(request);

                document.getElementById('sterFavoriet').innerText = '☆';
                //location.reload();
            } else {
                console.log("adding favorite");

                await addFavorite();
                document.getElementById('sterFavoriet').innerText = '★';
            }
        } catch (error) {
            console.log(error.message);
        }
    };

    const url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + sessionStorage.getItem("user");

    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {

            profielData = data;

            document.getElementById('navigatieFoto').setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + profielData.foto);
            document.getElementById("naarProfiel").innerText = profielData.nickname;


        })
        .catch(function (error) { console.log(error); });
}

document.getElementById("afmelden").onclick = function () {
    sessionStorage.removeItem("user");

}

document.getElementById("naarProfiel").onclick = function () {
    const url = "/profielAnderePersoon.html?id=" + sessionStorage.getItem('user');
    this.setAttribute("href", url);
}

document.getElementById("bericht").onclick = e => {
    e.preventDefault();
    location.href = "/chat.html?id=" + profielId;
}

//lovecoins spenderen om extra informatie te krijgen
document.getElementById("lovecoinButton").onclick = async function (e) {
    e.preventDefault();
    try {
        //Unlock user
        let url = 'https://scrumserver.tenobe.org/scrum/api/ontgrendeling/ontgrendel.php?profielId=' + sessionStorage.getItem("user");

        let data = {
            mijnId: sessionStorage.getItem("user"),
            anderId: profielId
        }

        let request = new Request(url, {
            method: "POST",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });

        await fetch(request);

        //Update new coin value
        url = 'https://scrumserver.tenobe.org/scrum/api/profiel/update.php';

        data = {
            ...profielData,
            lovecoins: lovecoins - 1
        }

        request = new Request(url, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: new Headers({
                "Content-Type": "application/json"
            })
        });

        await fetch(request);

        location.reload();
    } catch (error) {
        console.log(error.message);
    }
}


function getSterrenBeeld(geboorteDatum) {
    let sterrenbeeld = "";
    const arrayDatum = geboorteDatum.split("-");
    let maand = parseInt(arrayDatum[1]);
    let dag = parseInt(arrayDatum[2]);

    switch (maand) {
        case 1: if (dag <= 19) {
            sterrenbeeld += "Steenbok"
        } else sterrenbeeld += "Waterman"
            break;
        case 2: if (dag <= 18) {
            sterrenbeeld += "Waterman"
        } else sterrenbeeld += "Vissen"
            break;
        case 3: if (dag <= 20) {
            sterrenbeeld += "Vissen"
        } else sterrenbeeld += "Ram"
            break;
        case 4: if (dag <= 19) {
            sterrenbeeld += "Ram"
        } else sterrenbeeld += "Stier"
            break;
        case 5: if (dag <= 20) {
            sterrenbeeld += "Stier"
        } else sterrenbeeld += "Tweelingen"
            break;
        case 6: if (dag <= 20) {
            sterrenbeeld += "Tweelingen"
        } else sterrenbeeld += "Kreeft"
            break;
        case 7: if (dag <= 22) {
            sterrenbeeld += "Kreeft"
        } else sterrenbeeld += "Leeuw"
            break;
        case 8: if (dag <= 22) {
            sterrenbeeld += "Leeuw"
        } else sterrenbeeld += "Maagd"
            break;
        case 9: if (dag <= 22) {
            sterrenbeeld += "Maagd"
        } else sterrenbeeld += "Weegschaal"
            break;
        case 10: if (dag <= 22) {
            sterrenbeeld += "Weegschaal"
        } else sterrenbeeld += "Schorpioen"
            break;
        case 11: if (dag <= 21) {
            sterrenbeeld += "Schorpioen"
        } else sterrenbeeld += "Boogschutter"
            break;
        case 12: if (dag <= 21) {
            sterrenbeeld += "Boogschutter"
        } else sterrenbeeld += "Steenbok"
            break;
        default: sterrenbeeld += "Foute input"
            break;
    }

    return sterrenbeeld;
}

function showData(profielData) {
    const sterrenbeeld = getSterrenBeeld(profielData.geboortedatum);

    //Already unlocked so just show data
    document.querySelector("title").innerText = profielData.nickname;
    document.getElementById('detailNick').innerText = profielData.nickname;
    document.getElementById('detailFnaam').innerText = profielData.familienaam;
    document.getElementById('detailVnaam').innerText = profielData.voornaam;
    document.getElementById('detailGeboortedatum').innerText = profielData.geboortedatum;
    document.getElementById('detailHaarkleur').innerText = profielData.haarkleur;
    document.getElementById('detailBeroep').innerText = profielData.beroep;
    document.getElementById('detailEmail').innerText = profielData.email;
    document.getElementById('detailFoto').setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + profielData.foto);
    document.getElementById('detailFoto').setAttribute('alt', 'foto van ' + profielData.voornaam + ' ' + profielData.familienaam);
    document.getElementById('profielVan').innerText = profielData.nickname;
    document.getElementById('detailSexe').innerText = profielData.sexe;
    document.getElementById('detailOogkleur').innerText = profielData.oogkleur;
    document.getElementById('detailGewicht').innerText = profielData.gewicht;
    document.getElementById('detailGrootte').innerText = profielData.grootte;
    document.getElementById('detailSterrenbeeld').innerText = sterrenbeeld;

    //Hide coinbutton
    document.getElementById("lovecoinButton").style.display = "none";
}