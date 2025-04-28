const express = require('express');
const router = express.Router();

const languages = [{
    "language": "Spanish",
    "lessons": {
        "A1": [
            { 
                "id": "1",
                "title": "Greetings and Introductions", 
                "description": "Learning basic greetings and farewells." 
            },
            { 
                "id": "2",
                "title": "Talking about yourself", 
                "description": "Describing yourself and where you're from." 
            },
            { 
                "id": "3",
                "title": "Talking about yourself", 
                "description": "Describing yourself and where you're from." 
            },
            { 
                "id": "4",
                "title": "Talking about yourself", 
                "description": "Describing yourself and where you're from." 
            },
            { 
                "id": "5",
                "title": "Talking about yourself", 
                "description": "Describing yourself and where you're from." 
            }
        ]
    }
}];

// Check if the user session exists
const checkUserSession = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// GET / route
router.get('/', checkUserSession, (req, res) => {
    
    // get users current language from database
    // const userLanguage = req.session.user.language;
    // const userLanguage = "Spanish";
    const userLanguage = languages[0].language;
    const userLanguageLevel = "A1";
    const lessons = languages.find(lang => lang.language === userLanguage).lessons[userLanguageLevel];


    res.render('create', { user: req.session.user, languages, lessons });
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/register', (req, res) => {
    res.render('register');
});

module.exports = router;