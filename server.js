const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.send('Welcome to the Language Learning App!');
});

app.get('/lesson', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'lesson.html'));
});

app.get('/greet', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'greet.html'));
});

app.post('/api/greet', (req, res) => {
    const name = req.body.name;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    const jsonResponse = { "text": `Hello ${name}!` };

    res.json(jsonResponse);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
