const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// Check if the required environment variable is set
if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
}

if(!process.env.MONGO_URI) {
    console.error('Error: MONGO_URI environment variable is not set.');
    process.exit(1);
}

if(!process.env.SESSION_SECRET) {
    console.error('Error: SESSION_SECRET environment variable is not set.');
    process.exit(1);
}
// --- MongoDB Connection ---

mongoose.connect(process.env.MONGO_URI, { dbName: 'dbconnect'});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('MongoDB connected successfully');
});

// --- Express Middleware ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Session Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));

// --- Routes ---
const indexRoutes = require('./routes/index');
const lessonRoutes = require('./routes/lesson');
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');

app.use('/', indexRoutes);
app.use('/lesson', lessonRoutes);
app.use('/user', userRoutes);
app.use('/auth', authRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});