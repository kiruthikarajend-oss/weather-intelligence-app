import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// API routes FIRST
app.post("/api/recommendations", async (req, res) => {
  try {
    const { locationName, date, maxTemp, minTemp, weatherCode, precipitationProb } = req.body;
    const prompt = `You are a helpful travel and daily planning assistant. Based on the following weather forecast for ${locationName} on ${date}:
    - High: ${maxTemp}°C
    - Low: ${minTemp}°C
    - Weather Code: ${weatherCode} (WMO code)
    - Precipitation Probability: ${precipitationProb}%
    
    Provide 2-3 brief, practical recommendations for activities or preparations. Keep the tone helpful, encouraging, and concise. No more than 3 bullet points. Do not include markdown formatting for the bullets, just plain text with dashes.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    res.json({ recommendations: response.text });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
