import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    try {
        const { messages } = req.body;
        
        if (!messages || !Array.isArray(messages)) {
            return res.status(400).json({ 
                error: 'Messages array is required' 
            });
        }

        if (!process.env.GROQ_API_KEY) {
            return res.status(500).json({
                error: 'Server configuration error',
                details: 'GROQ_API_KEY is not configured'
            });
        }

        console.log('Request body:', JSON.stringify(messages, null, 2));
        console.log('Using API Key:', process.env.GROQ_API_KEY.substring(0, 10) + '...');

        const response = await fetch('https://api.groq.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY.trim()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: messages,
                model: "mixtral-8x7b-32768",
                temperature: 0.7,
                max_tokens: 2048,
                top_p: 1,
            })
        });

        const responseText = await response.text();
        console.log('Raw API Response:', responseText);

        if (!response.ok) {
            console.error('Response not OK:', response.status, responseText);
            throw new Error(`Groq API error: ${responseText}`);
        }

        const completion = JSON.parse(responseText);
        console.log('Parsed response:', completion);
        
        res.json({
            content: completion.choices[0].message.content
        });
        
    } catch (error) {
        console.error('Server error details:', {
            message: error.message,
            stack: error.stack,
            type: error.constructor.name
        });
        
        if (error.message.includes('Invalid API Key')) {
            return res.status(401).json({
                error: 'Authentication failed',
                details: 'Invalid API key. Please check your GROQ_API_KEY configuration.'
            });
        }

        res.status(500).json({ 
            error: 'Request failed', 
            details: error.message 
        });
    }
});

app.listen(3002, () => {
    console.log('Server is running on port 3002');
    console.log('API Key loaded:', !!process.env.GROQ_API_KEY);
    console.log('API Key (first few chars):', process.env.GROQ_API_KEY.substring(0, 10) + '...');
});