const express = require('express');
const router = express.Router();

// GET and POST /user routes
router
    .route('/')
    .get((req, res) => {
        res.render('user');
    })
    .post((req, res) => {
        const { user } = req.body;
        if (!user) {
            return res.status(400).json({ error: 'User name required' });
        }
        res.render('user', { user });
    });

module.exports = router;