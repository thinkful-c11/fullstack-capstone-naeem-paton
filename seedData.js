'use strict';
const faker = require('faker');
const {Driver, BrokerShipper} = require('./models');
const {DATABASE_URL} = require('./config');
const {app, runServer, closeServer} = require('./server');
const mongoose = require('mongoose');   //SEE IF THIS WORKS WHILE COMMENTED OUT AND FIX BUG IN runServer() not
//                                        NOT A FUNCTION ERROR LINE 9


//UNCOMMENTING THE FOLLOWING LINES OF CODE WILL BREAK THE APP. BUT IT WORKED FINE EARLIER WTW?
// runServer(DATABASE_URL)
//     .then( () => {
  
//       Driver
//             .find()
//             .then(function(drivers){
//               if(drivers.length === 0){
//                 return seedDriver();
//               }else{console.log('You got drivers ===>', drivers.length);}
//             });                                                                    

//       BrokerShipper
//             .find()
//             .then( (brokershippers) =>{
//               if(brokershippers.length === 0){
//                 return seedBrokerShipper();
//               }else{console.log('You got brokers ===>', brokershippers.length);}
//             });
            
//     });



function generateDriver() {
  return {
    truck: [{
        truckNum: faker.lorem.word(),
        trailerNum: faker.lorem.word(),
        location: faker.address.state(),
        trailerType: faker.lorem.word(),

      }],
    fleetManager: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName()
      },
    phonNum: faker.phone.phoneNumber(),
    companyName: faker.company.companyName()
  };
}

function seedDriver() {
  console.info('Seeding test data....');
    
  const seedData = [];
  for (let i = 0; i < 100; i++) {
    seedData.push(generateDriver());
  }
  return Driver.insertMany(seedData);
}

function generateBrokerShipper() {
  return {
    companyName: faker.company.companyName(),
    phone: faker.phone.phoneNumber,
    load: {
        puLocation: faker.address.state(),
        delLocation: faker.address.state(),
        pudate: faker.date.future(),
        freight: faker.lorem.word()
      },
    phonNum: faker.phone.phoneNumber()
  };
}

function seedBrokerShipper() {
  console.info('Seeding test data....');
    
  const seedData = [];
  for (let i = 0; i < 10; i++) {
    seedData.push(generateBrokerShipper());
  }
  return BrokerShipper.insertMany(seedData);
}


module.exports = {generateBrokerShipper, generateDriver, seedBrokerShipper, seedDriver};