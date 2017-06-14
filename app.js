'use strict';

const {DATABASE_URL, PORT} = require('./config');

const appState = {
    search: '',
    availableDrivers: [],
    availableLoads: []
}



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