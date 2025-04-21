const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const aiModel = require('@google/genai');

// Load the lesson prompt template
const lessonPromptPath = path.join(__dirname, '../prompts', 'create-lesson.txt');
const lessonPrompt = fs.readFileSync(lessonPromptPath, 'utf8');

// Initialize Google GenAI client
const ai = new aiModel.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

// Function to generate a lesson
async function generateLesson(userPrompt, language) {
    const prompt = lessonPrompt.replace('[[LESSON_LANGUAGE]]', language).replace('[[LESSON_PROMPT]]', userPrompt);
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-preview-04-17',
        contents: prompt
    });
    return response.text;
}

// POST /lesson route
router.post('/', (req, res) => {
    const { prompt, language } = req.body;
    if (!prompt || !language) {
        return res.status(400).json({ error: 'Prompt and Language selection required' });
    }

    generateLesson(prompt, language)
        .then(lesson => {
            // Remove backticks and "json" from the response
            lesson = lesson.replace(/`/g, '').replace(/json/g, '');
            res.render('lesson', { questions: lesson });
        })
        .catch(err => {
            console.error('Error generating lesson:', err);
            res.status(500).json({ error: 'Failed to generate lesson' });
        });
});

module.exports = router;