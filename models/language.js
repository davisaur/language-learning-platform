const mongoose = require('mongoose');

const languageSchema = new mongoose.Schema({
    language: {
        type: String,
        required: true,
        unique: true
    },
    custom: {
        type: Boolean,
        default: true
    },
    course: {
        type: [
            {
                title: { type: String, required: true },
                description: { type: String, required: true },
                lessonId: { type: String, default: null }

            }
        ],
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Language', languageSchema);