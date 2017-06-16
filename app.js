'use strict';

const appState = {
   availableDrivers: [],
  availableLoads: []
};

////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
//////////////////                              ////////////////////////
//////////////////     MOD FUNCTIONS            //////////////////////// 
//////////////////                              ////////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
function addDrivers(state, response) {
  state.availableDrivers = response;
}

function addLoad(state, response) {
  state.availableLoads = response;
}

function emptyState(state = appState){
  state.search = '',
    state.availableDrivers = [],
    state.availableLoads = [];
}

function queryDriverByState (data, searchTerm){
  for(let i in data){
    if(searchTerm === "All"){
      addDrivers(appState, data)
    }
    else if(searchTerm == data[i].truckInfo[0].location){
      console.log(data[i], appState)
      appState.availableDrivers.push(data[i]);
    }

  }
}

function queryLoadByState (data, searchTerm){
  for(let i in data){
    if(searchTerm === "All"){
      addLoad(appState, data)
    }
    else if(searchTerm == data[i].load.puLocation){
      appState.availableLoads.push(data[i]);
    }


  }
}

function queryDataBase(search){
  
  emptyState();
  const queryState = $('#stateSelector').val();

  
  if($('#selectorId').val() === 'driver' && queryState !== " ") {

    fetch('/drivers').then(response => {
      return response.json();
    })
    .then(data =>{

        return queryDriverByState(data, queryState)
    })
        .then(function(){
          render(($('div.real-data')));
        });
  }else {
    fetch('/brokershippers').then(response => {
      return response.json();
    })
        .then(data =>{
         
          return queryLoadByState(data, queryState)
        })
        .then(function(){
          render(($('div.real-data')));
        });
  }
}

function postDriver(search){
    
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

  fetch(`/drivers`, {
    method: 'post', 
    headers: { 
      'Accept': 'application/json, text/plain, /', 
      'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json();
  });
}

function postBroker(search){
    
  let data = {
    companyName: $('#brokerName').val(),
    phone: $('#phone').val(),
    load: {
      puLocation: $('#puLocation').val(),
      delLocation: $('#delLocation').val(),
      pudate: $('#pudate').val(),
      freight: $('#freight').val()
    }
  };

  fetch(`/brokershippers`, {
    method: 'post', 
    headers: { 
      'Accept': 'application/json, text/plain, /', 
      'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(response => {
    return response.json();
  });
}



/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
//////////////////                              /////////////////////////
//////////////////     RENDER FUNCTIONS         ///////////////////////// 
//////////////////                              /////////////////////////
/////////////////////////////////////////////////////////////////////////
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
    html += `
        <div>Sorry, no information found. Please try another search.</div>
        `;
  }

  element.html(html);

}



////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
///////////////////                              ///////////////////////
///////////////////      EVENT LISTENERS         /////////////////////// 
///////////////////                              ///////////////////////
////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////

$(function(){

  $('form.search').submit(event => {
    event.preventDefault();
    queryDataBase();
    $('#stateSelector').val("")
  });

  $('#driver-post').submit(event => {
    event.preventDefault();
    postDriver();
  });

  $('#broker-post').submit(event => {
    event.preventDefault();
    postBroker();
  });

  $('')
});
