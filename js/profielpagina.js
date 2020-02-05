"use strict";
import addFavorite from './methods/addFavorite.js';

//let profielId = 3 //Math.floor(Math.random() * 4)+1; random profiel van 0 - 4
const profielId = new URL(window.location.href).searchParams.get("id");

//velden invullen
window.onload = function () {

    let profielData;

    let url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + profielId;

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
            document.getElementById('detailLovecoins').value = profielData.lovecoins;
            document.getElementById('detailFoto').setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + profielData.foto);
            document.getElementById('detailFoto').setAttribute('alt', 'foto van ' + profielData.voornaam + ' ' + profielData.familienaam);
            document.getElementById('profielVan').innerText = 'Details van ' + profielData.voornaam + ' ' + profielData.familienaam;
            document.getElementById('detailSexe').value = profielData.sexe;
            document.getElementById('detailOogkleur').value = profielData.oogkleur;
            document.getElementById('detailGewicht').value = profielData.gewicht;
            document.getElementById('detailGrootte').value = profielData.grootte;
            document.getElementById('detailWachtWoord').value = profielData.wachtwoord;


        })
        .catch(function (error) { console.log(error); });


    }

//favorieten teovoegen
let ingelogdId = 7;
let favorietPersoon = false;
let rooturl = 'https://scrumserver.tenobe.org/scrum/api';
console.log(ingelogdId, profielId, 1, rooturl)
document.getElementById('buttonLike').onclick = async function (e){
    e.preventDefault();
    await addFavorite();
    favorietPersoon = true;

};
console.log(favorietPersoon)
if (favorietPersoon) {document.getElementById('buttonLike').innerText= "Je hebt deze persoon een like gegeven."};


//lovecoins spenderen om extra informatie te krijgen

/*berichten sturen

document.getElementById('knop22').addEventListener('click', function (e) {  
    let vanId =  document.getElementById('input22_1').value; 
    let naarId =  document.getElementById('input22_2').value; 
    let bericht =  document.getElementById('input22_3').value; 

    let url=rooturl+'/bericht/post.php';
    //LET OP : rooturl = https://scrumserver.tenobe.org/scrum/api
    let data = {
        vanId:vanId,
        naarId:naarId,
        bericht:bericht,
        status:"verzonden"
    }

    var request = new Request(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({
            'Content-Type': 'application/json'
        })
    });

    fetch(request)
        .then( function (resp)  { return resp.json(); })
        .then( function (data)  { console.log(data);  })
        .catch(function (error) { console.log(error); });
});
*/
