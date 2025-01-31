// Importujemy wymagane moduły
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// Inicjalizacja aplikacji Express
const app = express();

// Używamy middleware do parsowania JSON oraz obsługi CORS
app.use(express.json());
app.use(cors());

// Pobieramy klucze API z zmiennych środowiskowych
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

/*
  Endpoint korzystający z OpenAI API
  Aby wysłać zapytanie, należy zrobić POST na /generate-openai z ciałem JSON zawierającym "prompt".
*/
app.post("/generate-openai", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Brak promptu do generowania treści" });
  }
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo", // Możesz zmienić na "gpt-4", jeśli masz dostęp
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.json({ response: response.data.choices[0].message.content });
  } catch (error) {
    console.error(
      "Błąd OpenAI:",
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
    res.status(500).json({ error: error.response ? error.response.data : "Błąd generowania treści AI (OpenAI)" });
  }
});

/*
  Endpoint korzystający z Hugging Face API
  Aby wysłać zapytanie, należy zrobić POST na /generate-hf z ciałem JSON zawierającym "prompt".
  W tym przykładzie używamy modelu "google/flan-t5-xl".
*/
app.post("/generate-hf", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Brak promptu do generowania treści" });
  }
  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/google/flan-t5-xl",
      { inputs: prompt },
      {
        headers: { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` },
      }
    );
    res.json({ response: response.data });
  } catch (error) {
    console.error(
      "Błąd Hugging Face:",
      error.response ? JSON.stringify(error.response.data, null, 2) : error.message
    );
    res.status(500).json({ error: error.response ? error.response.data : "Błąd generowania treści AI (Hugging Face)" });
  }
});

// Uruchomienie serwera na porcie określonym w zmiennej PORT lub domyślnie na 10000
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
