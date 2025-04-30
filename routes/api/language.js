const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Language = require('../../models/language');
const User = require('../../models/user');
const Lesson = require('../../models/lesson');
const aiService = require('../../utils/aiService');

// Load the language prompt template

const languagePromptPath = path.join(__dirname, '../../prompts', 'create-course.txt');
let languagePrompt = fs.readFileSync(languagePromptPath, 'utf8');

// Load the lesson prompt template
const lessonPromptPath = path.join(__dirname, '../../prompts', 'create-lesson.txt');
const lessonPrompt = fs.readFileSync(lessonPromptPath, 'utf8');

// Function to generate a lesson
async function generateLesson(userPrompt, language) {
    const prompt = lessonPrompt.replace('[[LESSON_LANGUAGE]]', language).replace('[[LESSON_PROMPT]]', userPrompt);
    const response = await aiService.generateResponse(prompt);
    return response;
}

// TODO: input should validated
router.post('/language', async (req, res) => {
    let { language, otherLanguage } = req.body;
    if (!language) {
        return res.status(400).json({ message: 'Language is required' });
    }

    if (language === 'other') {
        if (!otherLanguage) {
            return res.status(400).json({ message: 'Other language is required' });
        }
        language = otherLanguage;
        language = language.trim();
    }

    language = language.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    // check if language exists in database 
    const existingLanguage = await Language.findOne({ language });
    if (!existingLanguage) {
        const newLanguage = new Language({ language: language, custom: true });
    
        const prompt = languagePrompt.replace('[[LANGUAGE]]', language).replace('[[NUMBER_OF_LESSONS]]', '10');
        const response = await aiService.generateResponse(prompt);

        if(response) {
            try {
                console.log(response);
                const parsedResponse = JSON.parse(response);
                newLanguage.course = parsedResponse;
                await newLanguage.save();
            } catch (e) {
                return res.status(400).json({ message: 'Invalid JSON response from AI service' });
            }
    
        } else {
            res.status(500).json({ message: 'Error generating lessons' });
        }
    }

    // add language to user
    const user = await User.findOne({ username: req.session.user.username });
    if (user) {
        user.currentLanguage = language;
        // if users languages array doesnt contain the new language, add it
        if (!user.languages.some(lang => lang === language)) {
            user.languages.push(language);
        }
        await user.save();
        req.session.user = user; 
        res.redirect('/');
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
    
});

router.post('/generate', async (req, res) => {
    const { prompt } = req.body;
    if (!prompt) {
        return res.status(400).json({ message: 'Prompt is required' });
    }

    // Retry logic for generating a lesson
    const tryGenerateLesson = async (retries = 2) => {
        try {
            // Attempt to generate the lesson
            let lesson = await generateLesson(prompt, req.session.user.currentLanguage);

            // Remove backticks and "json" from the response
            lesson = lesson.replace(/`/g, '').replace(/json/g, '');
            lesson = JSON.parse(lesson);

            // Save the lesson to the database
            const newLesson = new Lesson({
                language: req.session.user.currentLanguage,
                content: lesson.questions,
            });
            await newLesson.save();

            // Update the user's customLessons array with the lesson
            const user = await User.findOne({ username: req.session.user.username });
            if (user) {
                user.customLessons.push({ lessonId: newLesson._id, title: prompt });
                await user.save();
                req.session.user = user;

                // Redirect to the newly created lesson
                res.redirect(`/lesson/${newLesson._id}`);
            } else {
                return res.status(400).json({ message: 'User not found' });
            }
        } catch (err) {
            console.error('Error generating lesson:', err);

            // Retry if retries are left
            if (retries > 0) {
                console.log(`Retrying... (${2 - retries + 1} attempt)`);
                await tryGenerateLesson(retries - 1);
            } else {
                // If all retries fail, send an error response
                res.status(500).json({ error: 'Failed to generate lesson after multiple attempts' });
            }
        }
    };

    // Start the retry logic
    await tryGenerateLesson();
});

router.get('/lesson/:index', async (req, res) => {
    const { index } = req.params;
    const language = await Language.findOne({ language: req.session.user.currentLanguage });
    if (!language) {
        return res.status(404).json({ message: 'Language not found' });
    }

    const lesson = language.course[index];
    if (!lesson.lessonId || lesson.lessonId === "") {
        // Retry logic for generating a lesson
        const tryGenerateLesson = async (retries = 2) => {
            try {
                // Attempt to generate the lesson
                let generatedLesson = await generateLesson(lesson.title, req.session.user.currentLanguage);

                // Remove backticks and "json" from the response
                generatedLesson = generatedLesson.replace(/`/g, '').replace(/json/g, '');
                generatedLesson = JSON.parse(generatedLesson);

                // Save the lesson to the database
                const newLesson = new Lesson({
                    language: req.session.user.currentLanguage,
                    content: generatedLesson.questions,
                });

                await newLesson.save();

                // Update the language course with the lesson ID
                language.course[index].lessonId = newLesson._id;
                await language.save();

                // Redirect to the newly created lesson
                res.redirect(`/lesson/${newLesson._id}`);
            } catch (err) {
                console.error('Error generating lesson:', err);

                // Retry if retries are left
                if (retries > 0) {
                    console.log(`Retrying... (${2 - retries + 1} attempt)`);
                    await tryGenerateLesson(retries - 1);
                } else {
                    // If all retries fail, send an error response
                    res.status(500).json({ error: 'Failed to generate lesson after multiple attempts' });
                }
            }
        };

        // Start the retry logic
        await tryGenerateLesson();
    } else {
        // Lesson already exists, redirect to lesson page
        const lessonId = lesson.lessonId;
        res.redirect(`/lesson/${lessonId}`);
    }
});

router.post('/complete', async (req, res) => {
    const { lessonId } = req.body;
    if (!lessonId) {
        return res.status(400).json({ message: 'Lesson ID is required' });
    }
    // Add lessonId to the user's completedLessons array
    const user = await User.findOne({ username: req.session.user.username });
    const lesson = await Lesson.findById(lessonId);
    if (user) {

        if(!user.completedLessons.includes(lessonId)) {
            user.completedLessons.push(lessonId);
        }

        user.stats.xp += lesson.content.length * 2;
        // if users last lesson wasn't today, increase streak
        const today = new Date();
        if (user.stats.lastLessonDate) {
            const lastLessonDate = new Date(user.stats.lastLessonDate);
            if (lastLessonDate.getDate() !== today.getDate()) {
                user.stats.streak += 1;
                user.stats.streakPaused = false;
            }
        } else {
            user.stats.streak += 1;
            user.stats.streakPaused = false;

        }
        user.stats.lastLessonDate = today;
        await user.save();
        req.session.user = user; 
    } else {
        return res.status(400).json({ message: 'User not found' });
    }
    res.redirect('/');
});

module.exports = router;