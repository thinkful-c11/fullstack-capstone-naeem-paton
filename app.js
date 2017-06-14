'use strict';


//const {DATABASE_URL, PORT} = require('./config');



//App State
const appState = {
    search: '',
    availableDrivers: [],
    availableLoads: []
};

///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//////////////////                              //////////////////////////
///////////////////    MOD FUNCTIONS            ////////////////////////// 
//////////////////                               ///////////////////////////
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function addDrivers(state, response) {
  state.availableDrivers = response;
}

function addLoad(state, response) {
  state.availableLoads = response;
}

function addSearch(state, response) {
  state.search = response;
}

function emptyState(state = appState){
    state.search = '',
    state.availableDrivers = [],
    state.availableLoads = []
}

function queryDataBase(search, pageURL = "http://localhost:8080/"){

   if($('#selectorId').val() === 'driver') {

        $.getJSON(`http://localhost:8080/drivers`, (response) => {
            addDrivers(appState, response);
            console.log(response);
        });
   }else {
        $.getJSON(`http://localhost:8080/brokershippers`, (response) => {
            addLoad(state, response);
            console.log(response);
        });
   }
}



///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//////////////////                              //////////////////////////
///////////////////   RENDER FUNCTIONS         ////////////////////////// 
//////////////////                               ///////////////////////////
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function render(element){
    let html = '';

    if(appState.availableDrivers.length > 0) {
     
            appState.availableDrivers.forEach(driver => {
                html += `
                    <div class='real-data'>
                        <h3>${appState.availableDrivers.companyName}</h3>
                        <p>Currently in: ${appState.availableDrivers.truckInfo[0].location}</p>
                        <p>${appState.availableDrivers.truckInfo[0].trailerType}</p>
                        <p>Contact: ${appState.availableDrivers.name} S</p>
                        <p>Phone: ${appState.availableDrivers.phone}</p>
                    </div>`
            });
        
    } else if(appState.availableLoads.length >0) {
        html 
    } else {
        //(no results found entry)
    }

    element.html(html);
	//element.removeClass("hidden");

}



function renderSearch(element){

}

///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//////////////////                              //////////////////////////
///////////////////    EVENT LISTENERS            ////////////////////////// 
//////////////////                               ///////////////////////////
///////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

$(function(){

    $('form.search').submit(event => {
        console.log("HIT")
		event.preventDefault();

	    queryDataBase();
        render($("div.real-data"));
		
	})


})