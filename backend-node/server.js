const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Frontend ko connect hone dega
app.use(express.json()); // JSON data read karne ke liye

// Route: React frontend se data le kar Python agent ko bhejna
app.post('/api/run-command', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
    }

    try {
        console.log(`Forwarding to Python Agent: ${prompt}`);
        
        // Python FastAPI ko call karna (jo port 8000 par chal raha hai)
        const pythonResponse = await axios.post('http://127.0.0.1:8000/generate-command', {
            user_input: prompt
        });

        // Python ka result wapas React (frontend) ko bhej dena
        res.json(pythonResponse.data);

    } catch (error) {
        console.error("Error communicating with Python Agent:", error.message);
        res.status(500).json({ 
            error: "Failed to execute command via AI Agent",
            details: error.message
        });
    }
});

// Server Start karna
app.listen(PORT, () => {
    console.log(`Node.js Orchestrator running on http://localhost:${PORT}`);
});