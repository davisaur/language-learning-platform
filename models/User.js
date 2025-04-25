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
    streak: {
        type: Number,
        default: 0
    },
    lastLessonDate: {
        type: Date,
        default: null
    },
    completedLessons: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('User', userSchema);