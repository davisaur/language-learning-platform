const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    stats: {
        type: [
            {
                streak: { type: Number, default: 0 },
                xp: { type: Number, default: 0 },
                streakStart: { type: Date, default: null },
                lastLessonDate: { type: Date, default: null }
            }
        ]
    },
    completedLessons: {
        type: [String],
        default: []
    },
    currentLanguage: {
        type: String,
        default: null
    },
    languages: {
        // Array of strings
        type: [String],
        default: []
    },
    customLessons: {
        type: [
            {
                lessonId: { type: String, required: true },
                title: { type: String, required: true },
                createdAt: { type: Date, default: Date.now }
            }
        ],
        default: []
    }
            
});

module.exports = mongoose.model('User', userSchema);