const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint do generowania treści
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Brak promptu do wygenerowania treści" });
    }

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-4", // Możesz zmienić na "gpt-3.5-turbo" jeśli chcesz tańszą opcję
                messages: [{ role: "system", content: "Jesteś pomocnym asystentem do generowania treści." }, { role: "user", content: prompt }],
                max_tokens: 500
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
    if (error.response) {
        console.error("Błąd OpenAI:", JSON.stringify(error.response.data, null, 2));
        res.status(error.response.status).json(error.response.data);
    } else {
        console.error("Błąd serwera:", error.message);
        res.status(500).json({ error: error.message });
    }
}

// Start serwera
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
