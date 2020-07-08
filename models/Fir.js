const mongoose = require('mongoose');

let FirSchema = new mongoose.Schema({
    crime: {
        type: String,
        required: true
    },
    report_id: {
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
    officer_id: {
        type: String,
        required: true
    },
    officer_role: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Fir', FirSchema);