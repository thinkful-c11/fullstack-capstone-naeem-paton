'use strict';

//const {DATABASE_URL, PORT} = require('./config');


//App State
const appState = {
    search: '',
    availableDrivers: [],
    availableLoads: []
};

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


function queryDataBase(search, pageURL = "http://localhost:8080/"){
   
//`http://localhost:8080/${appState.search}`           BROKEN CODE ReferenceError: $ is not defined
    $.getJSON(`${pageURL}drivers`, (response) => {
        addDrivers(appState, response);
        console.log(response);
    });
}
queryDataBase();
console.log('This is our app state', appState);

//Render Functions

function render(element){
    let html = '';

    if(appState.availableDrivers.length > 0) {
        function(){
            appState.availableDrivers.forEach(driver => {
                html += `
                    <div class='entry'>
                        <h3>${appState.availableDrivers.companyName}</h3>
                        <p>Currently in: ${appState.availableDrivers.truckInfo[0].location}</p>
                        <p>${appState.availableDrivers.truckInfo[0].trailerType}</p>
                        <p>Contact: ${appState.availableDrivers.name} S</p>
                        <p>Phone: ${appState.availableDrivers.phone}</p>
                    </div>`
            });
        }
    } else if(appState.availableLoads.length >0) {
        html +=
    } else {
        //(no results found entry)
    }
}

// function emptyState(state = appState){
//     state.search: '',
//     state.availableDrivers: [],
//     state.availableLoads: []
// }

function renderSearch(element){

}