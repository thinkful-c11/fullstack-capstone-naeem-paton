const mongoose = require('mongoose');

const driverSchema = mongoose.Schema({
    truck: { 
        truckNum: {type: String},
        trailerNum: {type: Number},
        //required: true           //WHY DOES APP BREAK IF I UNCOMMENT LINES 7 AND 12?
    },
    driver: {
        firstName: {type: String},
        lastName: {type: String},
        //required: true
    },
    freight: {type: String},
    phoneNum: {type: Number},
    location: {type: String, default: " "}
});

driverSchema.virtual('driverFullName').get(function() {
    return `${this.driver.firstName} ${this.driver.lastName}`.trim();
});

driverSchema.virtual('truckInfo').get(function() {
    return `Uses truck #: ${this.truck.truckNum} and trailer #: ${this.truck.trailerNum}`.trim();
});

driverSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        name: this.driverFullName,
        truckInfo: this.truckInfo,
        freight: this.freight,
        phone: this.phoneNum,
        location: this.location
    };
};




const brokerShipperSchema = mongoose.Schema({
    companyName: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
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
        name: this.companyName,
        load: this.loadInfo,
        phone: this.phoneMessage
    };
};

brokerShipperSchema.virtual('loadInfo').get(function() {
    return `This ${this.load.freight}load p/u in ${this.load.puLocation}, ` +
    `${this.load.pudate} and del. to ${this.load.delLocation}`.trim();
});

brokerShipperSchema.virtual('phoneMessage').get(function() {
    return `Call us at ${this.phone} to pull this load!`.trim();
});

const Driver = mongoose.model('Driver', driverSchema);
const BrokerShipper = mongoose.model('BrokerShipper', brokerShipperSchema);

module.exports = {Driver, BrokerShipper}