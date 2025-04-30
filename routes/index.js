const express = require('express');
const router = express.Router();
const Language = require('../models/language');
const User = require('../models/User');

// Check if the user session exists
const checkUserSession = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

const checkIfUserHasLanguage = (req, res, next) => {
    if (!req.session.user.currentLanguage) {
        // TODO: welcome screen
        return res.redirect('/languages');
    }
    next();
};

const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const checkIfUserStreakPaused = async (req, res, next) => {
    const today = new Date();
    const lastLessonDate = new Date(req.session.user.stats.lastLessonDate);

    const todayNormalized = normalizeDate(today);
    const lastLessonDateNormalized = normalizeDate(lastLessonDate);

    if (lastLessonDateNormalized.getDate() !== todayNormalized.getDate()) {
        const user = await User.findOne({ username: req.session.user.username });
        if (!user.stats.streakPaused) {
            user.stats.streakPaused = true;
        } 
        if ((todayNormalized - lastLessonDateNormalized) / (1000 * 60 * 60 * 24) > 1) {
            user.stats.streakPaused = true;
            user.stats.streak = 0;
            
        }
        await user.save();
        req.session.user = user;
    }
    next();
};

// GET / route
router.get('/', checkUserSession, checkIfUserHasLanguage, checkIfUserStreakPaused, async (req, res) => {
    
    // get users current language from database
    const language = await Language.findOne({ language: req.session.user.currentLanguage });
    if (!language) {
        return res.status(404).json({ message: 'Language not found' });
    }
    console.log(req.session.user);
    console.log(language);
    res.render('create', { user: req.session.user, language });
});

router.get('/languages', checkUserSession, async (req, res) => {

    // get languages from database
    const languages = await Language.find({}).select('language custom');
    console.log(languages);

    res.render('language-selector', { user: req.session.user, languages });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;