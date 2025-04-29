const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Language = require('../../models/language');
const User = require('../../models/User');
const aiService = require('../../utils/aiService');


const languagePromptPath = path.join(__dirname, '../../prompts', 'create-course.txt');
let languagePrompt = fs.readFileSync(languagePromptPath, 'utf8');


// TODO: input should validated
router.post('/language', async (req, res) => {
    const { language } = req.body;
    if (!language) {
        return res.status(400).json({ message: 'Language is required' });
    }

    // check if language exists in database 
    const existingLanguage = await Language.findOne({ language: language.toLowerCase() });
    if (!existingLanguage) {
        
        const newLanguage = new Language({ language: language.toLowerCase(), custom: false });
    
        const prompt = languagePrompt.replace('[[LANGUAGE]]', language).replace('[[NUMBER_OF_LESSONS]]', '10');
        const response = await aiService.generateResponse(prompt);

        if(response) {
            try {
                console.log(response);
                const parsedResponse = JSON.parse(response);
                newLanguage.course = parsedResponse;
            } catch (e) {
                return res.status(400).json({ message: 'Invalid JSON response from AI service' });
            }
    
            await newLanguage.save();
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
    
    
});

module.exports = router;