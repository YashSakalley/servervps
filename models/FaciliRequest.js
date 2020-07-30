const mongoose = require('mongoose');

let FacilityRequestSchema = new mongoose.Schema({
    phone: String,
    lat: Number,
    lng: Number,
    time: {
        type: Date,
        default: Date.now
    },
    status: String
});

module.exports = mongoose.model('FacilityRequest', FacilityRequestSchema);