// Importowanie potrzebnych modułów
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// Logowanie klucza API (tylko do testów, usuń po sprawdzeniu!)
console.log("API Key:", process.env.OPENAI_API_KEY);

// Inicjalizacja aplikacji Express
const app = express();
app.use(express.json());
app.use(cors());

// Pobranie klucza API OpenAI ze zmiennych środowiskowych
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Endpoint do generowania tekstów za pomocą OpenAI
app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: "Brak promptu do wygenerowania treści" });
    }

    try {
        // Wysłanie żądania do OpenAI API
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo", // Możesz zmienić na "gpt-4", jeśli masz dostęp
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500
            },
            {
                headers: {
                    "Authorization": `Bearer ${OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        // Zwrócenie odpowiedzi do klienta
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error("Błąd OpenAI:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        res.status(500).json({ error: "Błąd generowania treści AI" });
    }
});

// Endpoint domyślny na głównej stronie
app.get("/", (req, res) => {
    res.send("Hello! This is the AI App backend.");
});

// Start serwera
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

