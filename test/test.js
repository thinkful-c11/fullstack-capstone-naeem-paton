'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const chaiMoment = require('chai-moment');
const faker = require('faker');
const mongoose = require('mongoose');

const {Driver, BrokerShipper} = require('../models');

const {DATABASE_URL, TEST_DATABASE_URL} = require('../config'); 
const {app, runServer, closeServer} = require('../server');

const should = chai.should();
chai.use(chaiHttp);
chai.use(chaiMoment);

function generateDriver() {
  return {
    truck: [{
      truckNum: faker.lorem.word(),
      trailerNum: faker.lorem.word(),
      location: faker.address.state(),
    }],
        //faker.company.companyName()
    driver: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName()
    },
    freight: faker.lorem.word(),
    phoneNum: faker.phone.phoneNumber()
  };
}

function seedDriver() {
  console.info('Seeding test data....');
    
  const seedData = [];
  for (let i = 0; i < 10; i++) {
    seedData.push(generateDriver());
  }
  return Driver.insertMany(seedData);
}

function generateBrokerShipper() {
  return {
    companyName: faker.company.companyName(),
    phone: faker.phone.phoneNumber(),
    load: {
      puLocation: faker.address.state(),
      delLocation: faker.address.state(),
      pudate: faker.date.future(),
      freight: faker.lorem.word()
    },
  };
}

function seedBrokerShipper() {
  console.info('Seeding test data....');
    
  const seedData = [];
  for (let i = 0; i < 20; i++) {
    seedData.push(generateBrokerShipper());
  }
  return BrokerShipper.insertMany(seedData);
}

function dropTestData() {
  return mongoose.connection.dropDatabase();
}

describe('Posts', function(){
  before(function(){
    return runServer(TEST_DATABASE_URL);
  });
    
  beforeEach(function() {
    return (seedDriver(), seedBrokerShipper());
  });
    
  afterEach(function() {
    return dropTestData();
  });

  after(function() {
    return closeServer();
  });
  describe('Drivers Test', function(){
    describe('GET', function() {
      it('This should get the drivers information', function () {

        return chai.request(app)
                .get('/drivers')
                .then(function(res) {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('array');
                  res.body.length.should.be.at.least(1);
        
                  const expectedKeys = ['id', 'name', 'truckInfo', 'freight', 'phone'];
                  res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                  });
                });
      });
    });

    describe('GET by ID', function () {
      it('This should get the drivers information by id', function () {
        let testDriver = {};
        return chai.request(app)
                .get('/drivers')
                .then(function(res) {    
                  testDriver = res.body[0];
                  return chai.request(app)
                    .get(`/drivers/${testDriver.id}`);
                })
                .then(function(res) {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.truckInfo[0].truckNum.should.equal(testDriver.truckInfo[0].truckNum);
                  res.body.truckInfo[0].trailerNum.should.equal(testDriver.truckInfo[0].trailerNum);
                  res.body.truckInfo[0].location.should.equal(testDriver.truckInfo[0].location);
                  res.body.phone.should.equal(testDriver.phone);
                  res.body.name.should.equal(testDriver.name);
                  res.body.freight.should.equal(testDriver.freight);
                
                });
      });

    });

    describe('POST', function() {
      it('should add an item on POST', function() {
        const newDriver = generateDriver();
         
        return chai.request(app)
                .post('/drivers')
                .send(newDriver)
                .then(function(res) {
                  res.body.should.be.a('object');
                  res.body.should.include.keys('id','name', 'truckInfo', 'freight', 'phone');
                  res.body.id.should.not.be.null;
                    
                  return Driver.findById(res.body.id).exec();
                })
                .then(function(res){
                  res.driver.firstName.should.equal(newDriver.driver.firstName);
                  res.driver.lastName.should.equal(newDriver.driver.lastName);
                  res.truck[0].truckNum.should.equal(newDriver.truck[0].truckNum);
                  res.truck[0].trailerNum.should.equal(newDriver.truck[0].trailerNum);
                  res.truck[0].location.should.equal(newDriver.truck[0].location);
                  res.freight.should.equal(newDriver.freight);
                  res.phoneNum.should.equal(newDriver.phoneNum);
                });
      });
    });

    describe('PUT', function() {
      it('should update items on PUT', function() {
        const updateDriver = generateDriver();
        
        return chai.request(app)
            .get('/drivers')
            .then(function(res) {
                
              updateDriver.id = res.body[0].id;
              return chai.request(app)
                    .put(`/drivers/${updateDriver.id}`)
                    .send(updateDriver);
            })
            .then(function(res) {
              res.should.have.status(201);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.truckInfo[0].truckNum.should.equal(updateDriver.truck[0].truckNum);
              res.body.truckInfo[0].trailerNum.should.equal(updateDriver.truck[0].trailerNum);
              res.body.truckInfo[0].location.should.equal(updateDriver.truck[0].location);
              res.body.phone.should.equal(updateDriver.phoneNum);
              res.body.name.should.equal(`${updateDriver.driver.firstName} ${updateDriver.driver.lastName}`);
              res.body.freight.should.equal(updateDriver.freight);
            });
      });
    });
    
    describe('DELETE', function() {
      it('should delete items on DELETE', function() { 
        return chai.request(app)
                .get('/drivers')
                .then(function(res) {
                  return chai.request(app)
                        .delete(`/drivers/${res.body[0].id}`);
                })
                .then(function(res) {
                  res.should.have.status(204);
                });
      });
    });
  });

  describe('Broker/Shipper Test', function (){
    describe('GET', function() {
      it('This should get the broker/shipper information', function () {

        return chai.request(app)
            .get('/brokershippers')
            .then(function(res) {
              res.should.have.status(200);
              res.should.be.json;
              res.body.should.be.a('array');
              res.body.length.should.be.at.least(1);
    
              const expectedKeys = ['id', 'companyName', 'load', 'phone'];
              res.body.forEach(function(item) {
                item.should.be.a('object');
                item.should.include.keys(expectedKeys);
              });
            });
      });
    });

    describe('GET by ID', function () {
      it('This should get the broker/shippers information by id', function () {
        let testBroker = {};
        return chai.request(app)
                .get('/brokershippers')
                .then(function(res) {    
                  testBroker = res.body[0];
                  return chai.request(app)
                    .get(`/brokershippers/${testBroker.id}`);
                })
                .then(function(res) {
                  res.should.have.status(200);
                  res.should.be.json;
                  res.body.should.be.a('object');
                  res.body.load.puLocation.should.equal(testBroker.load.puLocation);
                  res.body.load.delLocation.should.equal(testBroker.load.delLocation);
                  res.body.load.pudate.should.equal(testBroker.load.pudate);
                  res.body.load.freight.should.equal(testBroker.load.freight);
                  res.body.phone.should.equal(testBroker.phone);
                  res.body.companyName.should.equal(testBroker.companyName);
                
                });
      });

    });

    describe('POST', function() {
      it('should add an item on POST', function() {
        const newBroker = generateBrokerShipper();
         
        return chai.request(app)
                .post('/brokershippers')
                .send(newBroker)
                .then(function(res) {
                  console.log("LOOK ----->", newBroker)
                  res.body.should.be.a('object');
                  res.body.should.include.keys('id', 'companyName', 'load', 'phone');
                  res.body.id.should.not.be.null;
                    
                  return BrokerShipper.findById(res.body.id).exec();
                })
                .then(function(res){
                  console.log("HEEY=====>", res)
                  res.companyName.should.equal(newBroker.companyName);
                  res.load.puLocation.should.equal(newBroker.load.puLocation);
                  res.load.delLocation.should.equal(newBroker.load.delLocation);
                  res.load.pudate.should.be.sameMoment(newBroker.load.pudate);
                  res.load.freight.should.equal(newBroker.load.freight);
                  res.phone.should.equal(newBroker.phone);
                });
      });
    });

    describe('PUT', function() {
      it('should update items on PUT', function() {
        const updateBroker = generateBrokerShipper();
        
        return chai.request(app)
            .get('/brokershippers')
            .then(function(res) {
              updateBroker.id = res.body[0].id;
              return chai.request(app)
                    .put(`/brokershippers/${updateBroker.id}`)
                    .send(updateBroker);
            })
            .then(function(res) {
              res.should.have.status(201);
              res.should.be.json;
              res.body.should.be.a('object');
              res.body.companyName.should.equal(updateBroker.companyName);
              res.body.load.puLocation.should.equal(updateBroker.load.puLocation);
              res.body.load.delLocation.should.equal(updateBroker.load.delLocation);
              res.body.load.pudate.should.equal(updateBroker.load.pudate);
              res.body.load.freight.should.equal(updateBroker.load.freight);
              res.body.phone.should.equal(updateBroker.phone);
            });
      });
    });
    
    describe('DELETE', function() {
      it('should delete items on DELETE', function() { 
        return chai.request(app)
                .get('/brokershippers')
                .then(function(res) {
                  return chai.request(app)
                        .delete(`/brokershippers/${res.body[0].id}`);
                })
                .then(function(res) {
                  res.should.have.status(204);
                });
      });
    });
  });
  
});

