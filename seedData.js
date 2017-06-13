const faker = require('faker');
const {Driver, BrokerShipper} = require('./models');
const {DATABASE_URL} = require('./config');

function generateDriver() {
    return {
        truck: [{
            truckNum: faker.lorem.word(),
            trailerNum: faker.lorem.word(),
            location: faker.address.state(),
        }],
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
    return drivers.insertMany(seedData);
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
    return brokershippers.insertMany(seedData);
}


module.exports = {generateBrokerShipper, generateDriver, seedBrokerShipper, seedDriver};