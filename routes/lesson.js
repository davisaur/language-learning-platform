const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const Lesson = require('../models/lesson');
const Language = require('../models/language');

const ai = require('../utils/aiService'); 
const aiService = require('../utils/aiService');

// // Load the lesson prompt template
// const lessonPromptPath = path.join(__dirname, '../prompts', 'create-lesson.txt');
// const lessonPrompt = fs.readFileSync(lessonPromptPath, 'utf8');


// // Function to generate a lesson
// async function generateLesson(userPrompt, language) {
//     const prompt = lessonPrompt.replace('[[LESSON_LANGUAGE]]', language).replace('[[LESSON_PROMPT]]', userPrompt);
//     const response = await aiService.generateResponse(prompt);
//     return response;
// }

// // POST /lesson route
// router.post('/', (req, res) => {
//     const { prompt, language } = req.body;
//     if (!prompt || !language) {
//         return res.status(400).json({ error: 'Prompt and Language selection required' });
//     }

//     generateLesson(prompt, language)
//         .then(lesson => {
//             // Remove backticks and "json" from the response
//             lesson = lesson.replace(/`/g, '').replace(/json/g, '');
//             res.render('lesson', { questions: lesson });
//         })
//         .catch(err => {
//             console.error('Error generating lesson:', err);
//             res.status(500).json({ error: 'Failed to generate lesson' });
//         });
// });

router.get('/:lessonId', async (req, res) => {
    const lessonId = req.params.lessonId;
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
    }

    console.log(lesson);
    res.render('lesson', { lesson });
});

module.exports = router;