const express = require('express');
const router = express.Router();
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

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

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

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }


        // Save the user
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Store the hashed password
            const newUser = new User({
                username,
                password: hash
            });
            newUser.save()
                .then(() => {
                    console.log('User registered successfully');
                })
                .catch(err => {
                    console.error('Error saving user:', err);
                    return res.status(500).json({ error: 'Internal server error' });
                });
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
        

module.exports = router;