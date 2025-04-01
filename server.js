import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function fetchGeminiResponse(message) {
    const chatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "You are Taurus, a friendly financial assistant who works for FinBotX..." }],
            },
            {
                role: "model",
                parts: [{ text: "Okay, I understand. I am Taurus, FinBotX's friendly financial assistant..." }],
            },
        ],
    });

    const result = await chatSession.sendMessage(message);
    return result.response.text();
}

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) return res.status(400).json({ error: "Message is required" });

        const response = await fetchGeminiResponse(message);
        res.json({ response });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
