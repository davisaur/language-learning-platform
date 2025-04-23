const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
let users = {};

// Login Route

router.use((req, res, next) => {
    console.log(users);
    next();
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Check if user exists
    const user = users[username];
    if (!user || bcrypt.compareSync(password, user.password) === false) {
        // Invalid username or password
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Successful login
    req.session.user = user;
    res.status(200).json({ message: 'Login successful' });
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
        if (users[username]) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Save the user
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).json({ error: 'Internal server error' });
            }
            // Store the hashed password
            users[username] = { username, password: hash };
        });
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
        

module.exports = router;