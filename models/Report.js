const mongoose = require('mongoose');

let ReportSchema = new mongoose.Schema({
    crime: {
        type: String,
        required: true
    },
    is_facilitator_filled: {
        type: Boolean,
        default: false
    },
    work: {
        type: [String],
        default: []
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
        type: String
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