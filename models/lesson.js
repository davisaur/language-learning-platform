const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    content: {
        type: [
            {
                type: mongoose.Schema.Types.Mixed
            }
        ],
        required: true
    }
});

module.exports = mongoose.model('Lesson', lessonSchema);