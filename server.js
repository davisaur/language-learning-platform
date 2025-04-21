const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check if the required environment variable is set
if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
}

// --- Express Middleware ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- Routes ---
const indexRoutes = require('./routes/index');
const lessonRoutes = require('./routes/lesson');
const userRoutes = require('./routes/user');

app.use('/', indexRoutes);
app.use('/lesson', lessonRoutes);
app.use('/user', userRoutes);

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});