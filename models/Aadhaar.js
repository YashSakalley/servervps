const mongoose = require('mongoose');

let AadhaarSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    uid: String,
    address: String,
    father_name: String,
    phone: String,
    email: String
});

module.exports = mongoose.model('Aadhaar', AadhaarSchema);