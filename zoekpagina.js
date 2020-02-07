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

    // I FEEL LUCKY
    
const rooturl = 'https://scrumserver.tenobe.org/scrum/api';
document.getElementById('lucky').addEventListener('click', function (e) {
    document.getElementById('foutmelding1').innerText = "";
    const parent = document.getElementById('zoekResultaten');
    const geslacht=controleren("geslachtDetail");
    while (parent.childNodes[0]) {
        parent.childNodes[0].remove();
        }
    let url= rooturl+ '/profiel/search.php?sexe=' +geslacht;
        fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {const luckyFriend= Math.floor(Math.random() * data.length);
            lijnVullen(luckyFriend, data);
        })
        .catch(function (error) { console.log(error); });
        
});

document.getElementById('btnSubmit').addEventListener('click', function (e) {

    //ontzettend veel constanten declaren
    const geslacht = controleren("geslachtDetail");
    const oogKleur = controleren("oogKleur");
    const haarKleur = controleren("haarkleur");
    const grootte = document.getElementById('grootteDetail').value;
    const gewicht = document.getElementById('gewichtDetail').value;
    const geboortedatum = document.getElementById('geboortedatumDetail').value;
    const geboordatumOperator = operatorMaken(document.getElementById('datumOperator').options[document.getElementById('datumOperator').selectedIndex].innerText);
    const grootteOperator = operatorMaken(document.getElementById('grootteOperator').options[document.getElementById('grootteOperator').selectedIndex].innerText);
    const gewichtOperator = operatorMaken(document.getElementById('gewichtOperator').options[document.getElementById('gewichtOperator').selectedIndex].innerText);
    const minGrootte = document.getElementById('grootteMin').value;
    const maxGrootte = document.getElementById('grootteMax').value;
    const minGewicht = document.getElementById('gewichtMin').value;
    const maxGewicht = document.getElementById('gewichtMax').value;
    const minGeboorte = document.getElementById('geboorteMin').value;
    const maxGeboorte = document.getElementById('geboorteMax').value;
    const orderby = document.getElementById('sorteerSelect').options[document.getElementById('sorteerSelect').selectedIndex].innerText.toLowerCase();

    //url samenstellen
    let url = rooturl + '/profiel/search.php?sexe=' + geslacht + '&oogkleur=' + oogKleur + '&haarkleur=' + haarKleur + '&orderBy=' + orderby;
    if (minGrootte == "" || maxGrootte == "") {
        url += '&grootte=' + grootte +'&grootteOperator=' + grootteOperator;} else {
            url += '&rangeMinGrootte=' + minGrootte + '&rangeMaxGrootte=' + maxGrootte + '&grootteOperator=range'; }
    if (minGewicht == "" || maxGewicht == "") {
        url += '&gewicht=' + gewicht +'&gewichtOperator=' + gewichtOperator;} else {
         url += '&rangeMinGewicht=' + minGewicht + '&rangeMaxGewicht=' + maxGewicht + '&gewichtOperator=range'; }
    if (minGeboorte == "" || maxGeboorte == "") {
        url += '&geboortedatum=' + geboortedatum +'&geboortedatumOperator=' + geboordatumOperator;} else {
             url += '&rangeMinGeboortedatum=' + minGeboorte + '&rangeMaxGeboortedatum=' + maxGeboorte + '&geboortedatumOperator=' + geboordatumOperator };
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
            if (data.length > 0) {
                resultatenTonen(data); 
                document.getElementById('foutmelding1').innerText = "";
                console.log(data);
            } else {
                document.getElementById('foutmelding1').innerText = 'Geen profielen gevonden';
                const parent = document.getElementById('zoekResultaten');
                while (parent.childNodes[0]) {
                parent.childNodes[0].remove();
                }
            }
        })
        .catch(function (error) { console.log(error); });
});

function controleren(id) {
    if (document.getElementById(id).options[document.getElementById(id).selectedIndex] === (document.getElementById(id).options[0])) {
        return "";
    }
    else {
        return document.getElementById(id).options[document.getElementById(id).selectedIndex].innerText;
    }
}

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

