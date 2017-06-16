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
        location: {type: String, default: " ", required: true},
        trailerType: {type: String, default: " "},
    }]},
    fleetManager: {
        firstName: {type: String},
        lastName: {type: String},
    },
    
    phoneNum: {type: String},
    companyName: {type: String}
});

driverSchema.virtual('managerFullName').get(function() {
    return `${this.fleetManager.firstName} ${this.fleetManager.lastName}`.trim();
});


driverSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        companyName: this.companyName,
        name: this.managerFullName,
        truckInfo: this.truck,
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


const Driver = mongoose.model('Driver', driverSchema);
const BrokerShipper = mongoose.model('BrokerShipper', brokerShipperSchema);

module.exports = {Driver, BrokerShipper}