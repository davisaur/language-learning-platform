const express = require('express');
const router = express.Router();

// Check if the user session exists
const checkUserSession = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/auth/login');
    }
    next();
};

// GET / route
router.get('/', checkUserSession, (req, res) => {
    res.render('create');
});

module.exports = router;