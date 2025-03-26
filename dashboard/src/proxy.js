const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3002;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  
  // Log the incoming message for debugging
  console.log("Received messages:", messages);

  if (!messages) {
    return res.status(400).json({ error: "Message content is required." });
  }

  try {
    const response = await axios.post('http://localhost:11434/api/chat', {
      model: "llama3.2",
      messages: messages,
      stream: false
    });
    res.json(response.data);
  } catch (error) {
    console.error('Proxy Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to process request',
      details: error.message,
      stack: error.stack  // This will include the full stack trace for deeper debugging
    });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
