"use strict";
const rooturl = 'https://scrumserver.tenobe.org/scrum/api';

document.getElementById('btnSubmit').addEventListener('click', function (e) { //specifiek zoeken
    let geslacht = document.getElementById('geslachtDetail').options[document.getElementById('geslachtDetail').selectedIndex].innerText;
    let grootte = document.getElementById('grootteDetail').value;
    let oogKleur = document.getElementById('oogDetail').value;
    let haarKleur = document.getElementById('haarkleurDetail').value;
    let gewicht = document.getElementById('gewichtDetail').value;
    let geboortedatum = document.getElementById('geboortedatumDetail').value;
    let geboordatumOperator = 'eq';
    let grootteOperator = 'eq';
    let gewichtOperator = 'eq';
    let url = rooturl + '/profiel/search.php?sexe=' + geslacht + '&oogkleur=' + oogKleur + '&haarkleur=' + haarKleur + '&grootte=' + grootte + '&gewicht=' + gewicht + '&geboortedatum=' + geboortedatum + '&geboortedatumOperator=' + geboordatumOperator + '&grootteOperator=' + grootteOperator + '&gewichtOperator=' + gewichtOperator;
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) { if (data.length > 0) {
            resultatenTonen(data)
        } else {
            document.getElementById('foutmelding1').innerText = 'Geen profielen gevonden';
        } })
        .catch(function (error) { console.log(error); });
});

document.getElementById('btnSubmit2').addEventListener('click', function (e) { //gedetailleerd zoeken
    let grootteOperator = operatorMaken(document.getElementById('grootteOperator').options[document.getElementById('grootteOperator').selectedIndex].innerText);
    let gewichtOperator = operatorMaken(document.getElementById('gewichtOperator').options[document.getElementById('gewichtOperator').selectedIndex].innerText);
    let geboordatumOperator = operatorMaken(document.getElementById('geboordatumOperator').options[document.getElementById('geboordatumOperator').selectedIndex].innerText);
    let grootte = document.getElementById('grootteGedetail').value;
    let gewicht = document.getElementById('gewichtGedetail').value;
    let geboortedatum = document.getElementById('geboortedatumGedetail').value;
    let orderby = document.getElementById('sorteerSelect').options[document.getElementById('sorteerSelect').selectedIndex].innerText.toLowerCase();
    let url = rooturl + '/profiel/search.php?grootte=' + grootte + '&gewicht=' + gewicht + '&geboortedatum=' + geboortedatum + '&geboortedatumOperator=' + geboordatumOperator + '&grootteOperator=' + grootteOperator + '&gewichtOperator=' + gewichtOperator + '&orderBy=' + orderby;
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) {
            if (data.length > 0) {
                resultatenTonen(data)
            } else {
                document.getElementById('foutmelding2').innerText = 'Geen profielen gevonden';
            }
        })
        .catch(function (error) { console.log(error); });
});

document.getElementById('btnSubmit3').addEventListener('click', function (e) { //zoeken met range
    let minGrootte = document.getElementById('grootteMin').value;
    let maxGrootte = document.getElementById('grootteMax').value;
    let minGewicht = document.getElementById('gewichtMin').value;
    let maxGewicht = document.getElementById('gewichtMax').value;
    let minGeboorte = document.getElementById('geboorteMin').value;
    let maxGeboorte = document.getElementById('geboorteMax').value;
    let orderby = document.getElementById('sorteerSelect2').options[document.getElementById('sorteerSelect').selectedIndex].innerText.toLowerCase();
    let url = rooturl + '/profiel/search.php?geboortedatumOperator=range&gewichtOperator=range&grootteOperator=range' + '&rangeMinGeboortedatum=' + minGeboorte + '&rangeMaxGeboortedatum=' + maxGeboorte + '&rangeMinGrootte=' + minGrootte + '&rangeMaxGrootte=' + maxGrootte + '&rangeMinGewicht=' + minGewicht + '&rangeMaxGewicht=' + maxGewicht + '&orderBy=' + orderby;
    fetch(url)
        .then(function (resp) { return resp.json(); })
        .then(function (data) { if (data.length > 0) {
            resultatenTonen(data)
        } else {
            document.getElementById('foutmelding3').innerText = 'Geen profielen gevonden';
        } })
        .catch(function (error) { console.log(error); });
});

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
            //parent.inserRow().insertCell().innerText='z';
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
    link.innerText = "ga naar porfiel";
    link.href = `/profielAnderePersoon.html?id=${data[teller].id}`;
    tableCell.appendChild(link);
}

function addCell(parent, cellCol) {
    const tableCell = parent.insertCell();
    const tableCellInput = cellCol;
    tableCell.innerText = tableCellInput;
    //tableCell.className = nameclass; 
}

//Navigatie
window.onload = function () {

    let profielData;

    let url = 'https://scrumserver.tenobe.org/scrum/api/profiel/read_one.php?id=' + sessionStorage.getItem("user");

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


document.getElementById("naarProfiel").onclick = function() {
    const url = "/profielAnderePersoon.html?id=" + sessionStorage.getItem('user');
    this.setAttribute("href", url);
}