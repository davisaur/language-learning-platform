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
        streak: { type: Number, default: 0 },
        xp: { type: Number, default: 0 },
        streakStart: { type: Date, default: null },
        lastLessonDate: { type: Date, default: null },
        streakPaused: { type: Boolean, default: true }
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

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
