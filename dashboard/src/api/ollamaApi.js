import axios from 'axios';

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;  // Using Vite env variable
const GROQ_API_URL = import.meta.env.VITE_GROQ_API_URL;

const chat = async (messages) => {
    try {
        const response = await axios.post(GROQ_API_URL, {
            model: "llama3-groq-70b-8192-tool-use-preview",
            messages: messages,
            temperature: 0.7,  // You can adjust this value
            max_tokens: 8192   // Maximum context length for this model
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Log the response data to see its structure
        console.log('Response Data:', response.data);

        return response.data;

    } catch (error) {
        console.error('API Error:', error.message);
        throw error;
    }
};

// You might want to rename this to groqApi
export const groqApi = {
    chat
};
