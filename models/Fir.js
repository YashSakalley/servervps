const mongoose = require('mongoose');

let FirSchema = new mongoose.Schema({
    crime: String,
    answers: [String],
    questions: [String],
    user_id: String,
    media_files: String,
    signature: String,
    status: String
});

module.exports = mongoose.model('Fir', FirSchema);