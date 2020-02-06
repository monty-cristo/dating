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

            if (profielData.id === sessionStorage.getItem("user")) {
                document.getElementById("updateButton").style.display = "";
            } 

        })
        .catch(function (error) { console.log(error); });


    //favorieten teovoegen
    let favorietPersoon = false;
    document.getElementById('buttonLike').onclick = async function (e) {
        e.preventDefault();
        await addFavorite();
        favorietPersoon = true;
        if (favorietPersoon) { document.getElementById('sterFavoriet').innerText = '★'; }
        else document.getElementById('sterFavoriet').innerText = '☆';
    };

    url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + sessionStorage.getItem("user");

    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {

            profielData = data;

            document.getElementById('navigatieFoto').setAttribute('src', 'https://scrumserver.tenobe.org/scrum/img/' + profielData.foto);
            document.getElementById("naarProfiel").innerText = profielData.nickname;

            


        })
        .catch(function (error) { console.log(error); });
        
}



document.getElementById("afmelden").onclick = function() {
    sessionStorage.removeItem("user");

}

document.getElementById("updateButton").onclick = function() {
    
}

document.getElementById("naarProfiel").onclick = function() {
    const url = "/profielAnderePersoon.html?id=" + sessionStorage.getItem('user');
    this.setAttribute("href", url);
}





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
