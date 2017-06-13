const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {Driver, BrokerShipper} = require('../models');

const {DATABASE_URL, TEST_DATABASE_URL} = require('../config'); 
const {app, runServer, closeServer} = require('../server');

const should = chai.should();
chai.use(chaiHttp);


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
        phone: faker.random.number(),
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
        return seedDriver()  //NEED A WAY TO CALL seedBrokerShipper() TOO
    });
    
    afterEach(function() {
        return dropTestData();
    });

    after(function() {
        return closeServer();
    });
    
    describe('GET', function() {
        it('should list item on GET', function () {
            seedDriver();

        return chai.request(app)
            .get('/drivers')
            .then(function(res) {
                console.log("LOOK ==>",res.body)
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
                console.log("Hello", res.body, "LOOK ---->", updateDriver);
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