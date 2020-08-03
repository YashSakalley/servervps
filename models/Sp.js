const mongoose = require('mongoose');

let SpSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: String,
    password: String,
    father_name: String,
    phone: String,
    firs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'FIR'
        }
    ],
    id_proof: String
});

module.exports = mongoose.model('Sp', SpSchema);