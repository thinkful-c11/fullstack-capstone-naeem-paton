'use strict';

//const {DATABASE_URL, PORT} = require('./config');


//App State
const appState = {
    search: '',
    availableDrivers: [],
    availableLoads: []
};
console.log(appState);

//Mod Functions
function addDrivers(state, response) {
  state.availableDrivers = response;
}

function addLoad(state, response) {
  state.availableLoads = response;
}

function addSearch(state, response) {
  state.search = response;
}


const pageURL = 'http://localhost:8080/';



function fetchDrivers(search, pageURL = "http://localhost:8080/"){
    console.log("fetch")
   
//`http://localhost:8080/${appState.search}`           BROKEN CODE ReferenceError: $ is not defined
    $.getJSON(`${pageURL}${appState.search}`, (response) => {
        console.log(response)
    })
}
fetchDrivers("drivers")

// function emptyState(state = appState){
//     state.search: '',
//     state.availableDrivers: [],
//     state.availableLoads: []
// }

function renderSearch(element){

}