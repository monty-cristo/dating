"use strict";
const rooturl='https://scrumserver.tenobe.org/scrum/api';
document.getElementById('btnSubmit').addEventListener('click', function(e){
    let geslacht = document.getElementById('geslachtDetail').options[document.getElementById('geslachtDetail').selectedIndex].innerText; 
    let grootte = document.getElementById('grootteDetail').value; 
    let oogKleur = document.getElementById('oogDetail').value;
    let haarKleur= document.getElementById('haarkleurDetail').value;
    let gewicht = document.getElementById('gewichtDetail').value;
    let geboortedatum = document.getElementById('geboortedatumDetail').value;
    let geboordatumOperator= 'eq';
    let grootteOperator ='eq';
    let gewichtOperator= 'eq';
    let url=rooturl+'/profiel/search.php?sexe=' + geslacht + '&oogkleur=' + oogKleur + '&haarkleur=' + haarKleur +'&grootte=' + grootte +'&gewicht=' + gewicht+ '&geboortedatum=' + geboortedatum +'&geboortedatumOperator='+ geboordatumOperator +'&grootteOperator=' + grootteOperator +'&gewichtOperator=' + gewichtOperator;
    fetch(url)
    .then(function(resp) {return resp.json();})
    .then(function(data) {console.log(data);})
    .catch(function(error) {console.log(error);});
});

document.getElementById('btnSubmit2').addEventListener('click', function(e){
    let grootteOperator= operatorMaken(document.getElementById('grootteOperator').options[document.getElementById('grootteOperator').selectedIndex].innerText);
    let gewichtOperator= operatorMaken(document.getElementById('gewichtOperator').options[document.getElementById('gewichtOperator').selectedIndex].innerText);
    let geboordatumOperator= operatorMaken(document.getElementById('geboordatumOperator').options[document.getElementById('geboordatumOperator').selectedIndex].innerText);
    let grootte = document.getElementById('grootteGedetail').value;
    let gewicht = document.getElementById('gewichtGedetail').value;
    let geboortedatum = document.getElementById('geboortedatumGedetail').value;  
    let orderby=  document.getElementById('sorteerSelect').options[document.getElementById('sorteerSelect').selectedIndex].innerText.toLowerCase();
    let url=rooturl+'/profiel/search.php?grootte=' + grootte +'&gewicht=' + gewicht+ '&geboortedatum=' + geboortedatum +'&geboortedatumOperator='+ geboordatumOperator +'&grootteOperator=' + grootteOperator +'&gewichtOperator=' + gewichtOperator +'&orderBy=' +orderby;
    fetch(url)
    .then(function(resp) {return resp.json();})
    .then(function(data) {console.log(data);})
    .catch(function(error) {console.log(error);});
});
document.getElementById('btnSubmit3').addEventListener('click', function(e){
    let minGrootte=document.getElementById('grootteMin').value;
    let maxGrootte=document.getElementById('grootteMax').value;
    let minGewicht=document.getElementById('gewichtMin').value;
    let maxGewicht=document.getElementById('gewichtMax').value;
    let minGeboorte=document.getElementById('geboorteMin').value;
    let maxGeboorte=document.getElementById('geboorteMax').value;
    let orderby= document.getElementById('sorteerSelect2').options[document.getElementById('sorteerSelect').selectedIndex].innerText.toLowerCase();
    let url= rooturl+'/profiel/search.php?geboortedatumOperator=range&gewichtOperator=range&grootteOperator=range' +'&rangeMinGeboortedatum=' + minGeboorte + '&rangeMaxGeboortedatum=' + maxGeboorte + '&rangeMinGrootte=' + minGrootte +'&rangeMaxGrootte=' + maxGrootte +'&rangeMinGewicht=' +minGewicht + '&rangeMaxGewicht=' +maxGewicht + '&orderBy=' + orderby;
    fetch(url)
    .then(function(resp) {return resp.json();})
    .then(function(data) {console.log(data);})
    .catch(function(error) {console.log(error);});
});

function operatorMaken(operator){
    switch(operator) {
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
    }}
