
const express = require('express');
const path = require('path');
const aiModel = require('@google/genai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check if the required environment variable is set
if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
}

// Initialize Google GenAI client
const ai = new aiModel.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Function to generate a greeting message
async function generateGreeting(name) {
    const prompt = `Generate a friendly and creative greeting message for ${name}. Only respond with the greeting message.`;
    const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        temperature: 1,
        contents: prompt
    });
    return response.text;
}

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
    
    generateGreeting(name)
        .then(greeting => {
            const jsonResponse = {
                text: greeting
            };
            res.json(jsonResponse);
        })
        .catch(err => {
            console.error('Error generating greeting:', err);
            res.status(500).json({ error: 'Failed to generate greeting' });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
