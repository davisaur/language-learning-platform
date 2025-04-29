const express = require('express');
const router = express.Router();
const Language = require('../models/language');

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

// GET / route
router.get('/', checkUserSession, checkIfUserHasLanguage, async (req, res) => {
    
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
    const languages = await Language.find({}).select('language');
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