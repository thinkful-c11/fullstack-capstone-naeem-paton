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

    fetch(`http://localhost:8080/drivers`).then(response => {
       return response.json()
     })
        .then(data =>{
          return addDrivers(appState, data)
        })
        .then(function(){
          render(($("div.real-data")));
        });
  }else {
      fetch(`http://localhost:8080/brokershippers`).then(response => {
       return response.json()
     })
        .then(data =>{
          return addLoad(appState, data)
        })
        .then(function(){
          render(($("div.real-data")));
        });
  }
}

function postDriver(search, pageURL = "http://localhost:8080/"){
    
    let data = {
        companyName: $('#companyName').val(),
        fleetManager: {
            firstName: $('#firstName').val(),
            lastName: $('#lastName').val()
        },
        phoneNum: $('#phoneNum').val(),
        truck: {
            truckNum: $('#truckNum').val(),
            trailerNum: $('#trailerNum').val(),
            trailerType: $('#trailerType').val(),
            location: $('#location').val()
        }
    };

    fetch(`http://localhost:8080/drivers`, {
        method: 'post', 
        headers: { 
            'Accept': 'application/json, text/plain, /', 
            'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }).then(response => {
       return response.json()
     })
        .then(data =>{
            console.log(data);
            queryDataBase();
        })
        .then(function(){
          render(($("div.real-data")));
        });
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
                    <div class='entry'>
                        <h3><u>${driver.companyName}</u></h3>
                        <p>Contact: ${driver.name}</p>
                        <p>Phone: ${driver.phone}</p>
                        <h4>Truck Information</h4>
                        <p>Currently in: ${driver.truckInfo[0].location}</p>
                        <p>Trailer Type: ${driver.truckInfo[0].trailerType}, Number: ${driver.truckInfo[0].trailerNum}</p>
                        <p>Truck Number: ${driver.truckInfo[0].truckNum}</p>
                    </div>`;
      });
        
  } else if(appState.availableLoads.length >0) {
      appState.availableLoads.forEach(job => {
        let date = new Date(job.load.pudate);
        html +=`
            <div class='entry'>
                <h3><u>${job.companyName}</u></h3>
                <p>Phone: ${job.phone}</p>
                <h4>Load Information</h4>
                <p>Freight: ${job.load.freight}</p>
                <p>Pick-up Date: ${date.toDateString()}</p>
                <p>Pick-up Location: ${job.load.puLocation}</p>
                <p>Delivery Location: ${job.load.delLocation}</p>
            </div>`;
        
      }); 
    } else {
      console.log("whelp it's empty");
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
    event.preventDefault();
	queryDataBase();
  })

   $('#driver-post').submit(event => {
    event.preventDefault();
	postDriver();
  })


})