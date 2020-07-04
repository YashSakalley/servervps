const mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    uid: String,
    address: String,
    father_name: String,
    phone: String,
    email: String,
    reports: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Report'
        }
    ]
});

module.exports = mongoose.model('User', UserSchema);