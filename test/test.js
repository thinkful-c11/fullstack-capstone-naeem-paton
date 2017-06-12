const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {Driver} = require('./models');
const {BrokerShipper} = require('./models');
//const {DATABASE_URL} = require('./config'); 

const {DATABASE_URL} = require('../config'); 
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
        phonNum: faker.phone.phoneNumber()
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
        phone: faker.phone.phoneNumber,
        load: {
            puLocation: faker.lorem.state(),
            delLocation: faker.lorem.state(),
            pudate: faker.date.future(),
            freight: faker.lorem.word()
        },
        phonNum: faker.phone.phoneNumber()
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

describe('Posts', function(){
    before(function(){
        return runServer(DATABASE_URL);
    });
    
    beforeEach(function() {
        return seedTestData();
    });
    
    afterEach(function() {
        return dropTestData();
    });

    after(function() {
        return closeServer();
    });
    
    describe('GET', function() {
        it('should list item on GET', function () {
        return chai.request(app)
            .get('/posts')
            .then(function(res) {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
    
                res.body.length.should.be.at.least(1);
    
                const expectedKeys = ['id', 'author', 'content', 'title', 'created'];
                res.body.forEach(function(item) {
                    item.should.be.a('object');
                    item.should.include.keys(expectedKeys);
                });
            });
        });
    });

    
    describe('POST', function() {
        it.only('should add an item on POST', function() {
            const newPost = generateTestData();
            return chai.request(app)
                .post('/posts')
                .send(newPost)
                .then(function(res) {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'author', 'content', 'title');
                    res.body.id.should.not.be.null;
                    return   BlogPost.findById(res.body.id).exec();
                })
                .then(function(res){
                    res.title.should.equal(newPost.title);
                })
        });
    });

    describe('PUT', function() {
        it('should update items on PUT', function() {
        const updateData = generateTestData();
        return chai.request(app)
            .get('/posts')
            .then(function(res) {
                updateData.id = res.body[0].id;
                return chai.request(app)
                    .put(`/posts/${updateData.id}`)
                    .send(updateData);
            })
            .then(function(res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.title.should.equal(updateData.title);
            });
        });
    });
    
    describe('DELETE', function() {
        it('should delete items on DELETE', function() { 
            return chai.request(app)
                .get('/posts')
                .then(function(res) {
                    return chai.request(app)
                        .delete(`/posts/${res.body[0].id}`);
                })
                .then(function(res) {
                    res.should.have.status(204);
                });
        });
    });
});