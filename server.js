
const express = require('express');
const path = require('path');
const aiModel = require('@google/genai');
const fs = require('fs');

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Check if the required environment variable is set
if (!process.env.GEMINI_API_KEY) {
    console.error('Error: GEMINI_API_KEY environment variable is not set.');
    process.exit(1);
}

// --- Express Middleware ---

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to parse URL-encoded bodies (form data)
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));

// --- Google GenAI Client Initialization ---

// Initialize Google GenAI client
const ai = new aiModel.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Function to generate a greeting message
async function generateLesson(userPrompt, language) {
    const prompt = lessonPrompt.replace('[[LESSON_LANGUAGE]]', language).replace('[[LESSON_PROMPT]]', userPrompt);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt
    });
    return response.text;
}

// --- Loading prompt template ---
const lessonPromptPath = path.join(__dirname, 'prompts', 'create-lesson.txt');
const lessonPrompt = fs.readFileSync(lessonPromptPath, 'utf8');

// --- Routes ---

app.get('/', (req, res) => {
    res.render('create');

});

app.post('/api/create', (req, res) => {
    const prompt = req.body.prompt;
    const language = req.body.language;
    if (!prompt || !language) {
        return res.status(400).json({ error: 'Prompt and Language selection required' });
    }
    
    generateLesson(prompt, language)
        .then(lesson => {
            //remove backticks
            lesson = lesson.replace(/`/g, '');
            //remove word  'json' from first line
            lesson = lesson.replace(/json/g, '');

            res.render('lesson', { questions: lesson });
        })
        .catch(err => {
            console.error('Error generating lesson:', err);
            res.status(500).json({ error: 'Failed to generate lesson' });
        });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
