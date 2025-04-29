const aiModel = require('@google/genai');

// Initialize Google GenAI client
const ai = new aiModel.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const aiService = {
    async generateResponse(prompt) {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: prompt
        });
        return response.text;
    }
}

module.exports = aiService;