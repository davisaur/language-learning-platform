# Web-based Language Learning Platform
 
Build Instructions

1. Clone the repository to your local computer
2. With Node.js & npm installed, type `npm i` to download all the packages
3. Create .env files with the following environment variables: `GEMINI_API_KEY`, `MONGO_URI`, `SESSION_SECRET` (session secret can be any string specified)
4. Create an API from [Google's AI Studio](https://ai.google.dev/gemini-api/docs/api-key) and insert it as the `GEMINI_API_KEY` in your environment.
5. Go to [mongodb.com](https://cloud.mongodb.com/) and make a cluster, and retrieve the URI it and insert it as the `MONGO_URI` in your environment.
6. You can now do `npm run start` to start the server.
