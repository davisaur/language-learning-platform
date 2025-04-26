const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const saltRounds = 10;

// Login Route

router.use((req, res, next) => {
    console.log();
    next();
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .escape(),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .escape()
],async (req, res) => {
    const { username, password } = req.body;  
    const errors = validationResult(req);

    // Check if there are validation errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            // Invalid username
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare passwords asynchronously
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            // Invalid password
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Successful login
        req.session.user = user;
        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Register Routes

router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required')
        .isLength({ min: 3, max: 32 }).withMessage('Username must be at least 3 characters long')
        .isAlphanumeric().withMessage('Username must be alphanumeric')
        .escape(),
    body('password')
        .trim()
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6, max: 32 }).withMessage('Password must be at least 6 characters long')
        .escape()
], async (req, res) => {
    const { username, password } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ error: errors.array().at(0).msg });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }


        // Save the user
        try {
            const hash = await bcrypt.hash(password, saltRounds);
            // Store the hashed password
            const newUser = new User({
                username,
                password: hash
            });
            await newUser.save();
            console.log('User registered successfully');
            res.status(201).json({ message: 'User registered successfully' });
        } catch (err) {
            console.error('Error during user registration:', err);
            res.status(500).json({ error: 'Internal server error' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/logout', (req, res) => {
    // Destroy the session
    req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        res.redirect('/auth/login');
    });
});
        

module.exports = router;