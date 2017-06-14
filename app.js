const {DATABASE_URL, PORT} = require('./config');

const appState = {
    search: '',
    availableDrivers: [],
    availableLoads: []
}



function fetchDrivers(callback, pageURL){
    console.log("fetch")
   
//`http://localhost:8080/${appState.search}`           BROKEN CODE ReferenceError: $ is not defined
    $.getJSON("http://localhost:8080/drivers"), (response) => {
        console.log(response)
    }
}
// fetchDrivers()

// function emptyState(state = appState){
//     state.search: '',
//     state.availableDrivers: [],
//     state.availableLoads: []
// }

function renderSearch(element){

}