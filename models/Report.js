const mongoose = require('mongoose');

let ReportSchema = new mongoose.Schema({
    crime: {
        type: String,
        required: true
    },
    answers: [String],
    questions: [String],
    user_id: {
        type: String,
        required: true
    },
    media_files: [String],
    signature: {
        type: String,
        required: true
    },
    image_id: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    reason: {
        type: String
    },
    time: {
        type: Date,
        default: Date.now
    }
});


module.exports = mongoose.model('Report', ReportSchema);