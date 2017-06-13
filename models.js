const mongoose = require('mongoose');

// const fleetSchema = new mongoose.Schema({
//   truckNum: {type: String},
//   trailerNum: {type: String},
//   location: {type: String, default: " "}
// });

const driverSchema = mongoose.Schema({
    truck: {type: Array, 'default': [{
        truckNum: {type: String, default: " ", required: true},
        trailerNum: {type: String, default: " ", required: true},
        location: {type: String, default: " ", required: true}
    }]},
    //need to update driver to fleet manager
    driver: {
        firstName: {type: String},
        lastName: {type: String},
    },
    freight: {type: String},
    phoneNum: {type: String}
});

driverSchema.virtual('driverFullName').get(function() {
    return `${this.driver.firstName} ${this.driver.lastName}`.trim();
});

// driverSchema.virtual('truckInfo').get(function() {
//     return `Uses truck #: ${this.truck[0].truckNum} and trailer #: ${this.truck[0].trailerNum}`.trim();
// });

driverSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        name: this.driverFullName,
        truckInfo: this.truck,
        freight: this.freight,
        phone: this.phoneNum || "98990877889",      //CHECK OUT THE HACK, RESEARCH MONGOOSE DROPPING THE undefined 
    };
};



const brokerShipperSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    load:{
        puLocation: {type: String, required: true},
        delLocation: {type: String, required: true},
        pudate: {type: Date, required: true},
        freight: {type: String, required: true}
    }
});

brokerShipperSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        companyName: this.companyName,
        load: this.load,
        phone: this.phone || "98990877889",
    };
};

// brokerShipperSchema.virtual('loadInfo').get(function() {
//     return `This ${this.load.freight}load p/u in ${this.load.puLocation}, ` +
//     `${this.load.pudate} and del. to ${this.load.delLocation}`.trim();
// });

// brokerShipperSchema.virtual('phoneMessage').get(function() {
//     return `Call us at ${this.phone} to pull this load!`.trim();
// });

const Driver = mongoose.model('Driver', driverSchema);
const BrokerShipper = mongoose.model('BrokerShipper', brokerShipperSchema);

module.exports = {Driver, BrokerShipper}