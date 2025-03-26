const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;

// Groq API configuration
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = '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';

// CORS configuration
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3002'],
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        console.log('Received request:', req.body);

        const response = await axios.post(GROQ_API_URL, {
            model: "llama3-groq-70b-8192-tool-use-preview",
            messages: req.body.messages,
            temperature: 0.7,
            max_tokens: 8192
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('Groq response received');
        res.json(response.data);
        
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({
            error: 'Failed to process request',
            details: error.message
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Using Groq API with model: llama3-groq-70b-8192-tool-use-preview');
});