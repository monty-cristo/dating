"use strict";

import getDropdownArray from "./js/methods/getDropdownArray.js";
import createDropdown from "./js/methods/createDropdown.js";

window.onload = async () => {
    const oogKleur = document.getElementById('oogKleur');
    const haarKleur = document.getElementById('haarkleur');

    const [haarkleuren, oogkleuren] = await getDropdownArray();
    createDropdown(haarkleuren, haarKleur);
    createDropdown(oogkleuren, oogKleur);
}

const rooturl = 'https://scrumserver.tenobe.org/scrum/api';
document.getElementById('btnSubmit').addEventListener('click', function (e) {
    console.log(document.getElementById('haarkleur').options[document.getElementById('haarkleur').selectedIndex])
    console.log(document.getElementById('haarkleur').options[0])
    let geslacht = document.getElementById('geslachtDetail').options[document.getElementById('geslachtDetail').selectedIndex].innerText;
    let oogKleur = document.getElementById('oogKleur').options[document.getElementById('oogKleur').selectedIndex].innerText;
    let haarKleur = document.getElementById('haarkleur').options[document.getElementById('haarkleur').selectedIndex].innerText;
    let grootte = document.getElementById('grootteDetail').value;
    let gewicht = document.getElementById('gewichtDetail').value;
    let geboortedatum = document.getElementById('geboortedatumDetail').value;
    let geboordatumOperator = operatorMaken(document.getElementById('datumOperator').options[document.getElementById('datumOperator').selectedIndex].innerText);
    let grootteOperator = operatorMaken(document.getElementById('grootteOperator').options[document.getElementById('grootteOperator').selectedIndex].innerText);
    let gewichtOperator = operatorMaken(document.getElementById('gewichtOperator').options[document.getElementById('gewichtOperator').selectedIndex].innerText);
    let minGrootte = document.getElementById('grootteMin').value;
    let maxGrootte = document.getElementById('grootteMax').value;
    let minGewicht = document.getElementById('gewichtMin').value;
    let maxGewicht = document.getElementById('gewichtMax').value;
    let minGeboorte = document.getElementById('geboorteMin').value;
    let maxGeboorte = document.getElementById('geboorteMax').value;
    let orderby = document.getElementById('sorteerSelect').options[document.getElementById('sorteerSelect').selectedIndex].innerText.toLowerCase();
    let url = rooturl + '/profiel/search.php?sexe=' + geslacht + '&oogkleur=' + oogKleur + '&haarkleur=' + haarKleur + '&orderBy=' + orderby;
    if (minGrootte == "" || maxGrootte == "") { grootteOperator = grootteOperator, url += '&grootte=' + grootte } else { url += '&rangeMinGrootte=' + minGrootte + '&rangeMaxGrootte=' + maxGrootte + '&grootteOperator=range'; }
    if (minGewicht == "" || maxGewicht == "") { gewichtOperator = gewichtOperator, url += '&gewicht=' + gewicht } else { url += '&rangeMinGewicht=' + minGewicht + '&rangeMaxGewicht=' + maxGewicht + '&gewichtOperator=range'; };
    if (minGeboorte == "" || maxGeboorte == "") { geboordatumOperator = geboordatumOperator, url += '&geboortedatum=' + geboortedatum } else { url += '&rangeMinGeboortedatum=' + minGeboorte + '&rangeMaxGeboortedatum=' + maxGeboorte + '&geboordatumOperator=' + geboordatumOperator };
    console.log(url);
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
            if (data.length > 0) {
                resultatenTonen(data), document.getElementById('foutmelding1').innerText = "";
                console.log(geslacht, grootte, gewicht, geboortedatum, geboordatumOperator, grootteOperator, gewichtOperator, minGrootte, maxGrootte, minGewicht, maxGewicht, minGeboorte, maxGeboorte);
            } else {
                document.getElementById('foutmelding1').innerText = 'Geen profielen gevonden';
            }
        })
        .catch(function (error) { console.log(error); });
});


document.getElementById('extraGrootteKnop').addEventListener('click', function (e) {
    document.getElementById("extraGrootteOperator").style.display = "";
    document.getElementById('minderGrootteKnop').style.display = "";
    document.getElementById('extraGrootteKnop').style.display = "none";
    document.getElementById('grootteMinimum').style.display = "";
})
document.getElementById('minderGrootteKnop').addEventListener('click', function (e) {
    document.getElementById("extraGrootteOperator").style.display = "none";
    document.getElementById('minderGrootteKnop').style.display = "none";
    document.getElementById('extraGrootteKnop').style.display = "";
    document.getElementById('grootteMinimum').style.display = "none";
})
document.getElementById('extraGewichtKnop').addEventListener('click', function (e) {
    document.getElementById("extraGewichtOperator").style.display = "";
    document.getElementById('minderGewichtKnop').style.display = "";
    document.getElementById('extraGewichtKnop').style.display = "none";
    document.getElementById('gewichtMinimum').style.display = "";
})
document.getElementById('minderGewichtKnop').addEventListener('click', function (e) {
    document.getElementById("extraGewichtOperator").style.display = "none";
    document.getElementById('minderGewichtKnop').style.display = "none";
    document.getElementById('extraGewichtKnop').style.display = "";
    document.getElementById('gewichtMinimum').style.display = "none";
})
document.getElementById('extraDatumKnop').addEventListener('click', function (e) {
    document.getElementById("extraDatumOperator").style.display = "";
    document.getElementById('minderDatumKnop').style.display = "";
    document.getElementById('extraDatumKnop').style.display = "none";
    document.getElementById('datumMin').style.display = "";
})
document.getElementById('minderDatumKnop').addEventListener('click', function (e) {
    document.getElementById("extraDatumOperator").style.display = "none";
    document.getElementById('minderDatumKnop').style.display = "none";
    document.getElementById('extraDatumKnop').style.display = "";
    document.getElementById('datumMin').style.display = "none";
})

function controleren(id){
if(document.getElementById(id).options[document.getElementById(id).selectedIndex]===(document.getElementById(id).options[0])){return "";}
}
function operatorMaken(operator) {
    switch (operator) {
        case '<':
            return 'st';
        case '<=':
            return 'steq';
        case '>':
            return 'gt';
        case '>=':
            return 'gteq';
        case '=':
            return 'eq';
        default:
            return '';
    }
}

function resultatenTonen(data) {
    const parent = document.getElementById('zoekResultaten');
    while (parent.childNodes[0]) {
        parent.childNodes[0].remove();
    }
    if (data.length > 10) {
        for (let teller = 0; teller < 10; teller++) {
            lijnVullen(teller, data);
        }
    } else {
        for (let teller = 0; teller < data.length; teller++) {
            lijnVullen(teller, data);
        }
    }
}

function lijnVullen(teller, data) {
    const tr = document.getElementById('zoekResultaten').insertRow();
    addCell(tr, data[teller].sexe);
    addCell(tr, data[teller].grootte);
    addCell(tr, data[teller].oogkleur);
    addCell(tr, data[teller].haarkleur);
    addCell(tr, data[teller].gewicht);
    addCell(tr, data[teller].geboortedatum);

    const tableCell = tr.insertCell();
    const link = document.createElement("a");
    link.innerText = "ga naar profiel";
    link.href = `/profielAnderePersoon.html?id=${data[teller].id}`;
    tableCell.appendChild(link);
}

function addCell(parent, cellCol) {
    const tableCell = parent.insertCell();
    const tableCellInput = cellCol;
    tableCell.innerText = tableCellInput;
    //tableCell.className = nameclass; 
}