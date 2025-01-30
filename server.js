const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

// Endpoint do generowania tekstów
app.post("/generate-text", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Brak promptu do wygenerowania treści" });
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct",
            { inputs: prompt },
            {
                headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }
            }
        );

        res.json({ response: response.data });
    } catch (error) {
        console.error("Błąd Hugging Face:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Błąd generowania treści AI" });
    }
});

// Start serwera
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
