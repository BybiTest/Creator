import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Google GenAI
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set in environment.");
    }
    genAIClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    app: "CreatorFlow",
    version: "1.0.0",
    developer: "سیدحمیدموسوی زاده",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Chat endpoint with multi-turn context
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, language } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const ai = getGenAI();

    // Default system prompt for CreatorFlow
    const defaultInstruction = `You are the official AI Assistant for CreatorFlow - the premier AI Creator & Growth Studio for YouTube and Social Media Creators.
Your developer is سیدحمیدموسوی زاده (Seyed Hamid Mousavizadeh).
You are an elite expert in YouTube algorithms, Shorts, viral hooks, retention psychology, content pacing, high-converting CTAs, SEO titles, descriptions, audience engagement, thumbnail concepting, and channel monetization.
You give natural, professional, insightful, and highly actionable advice.
Language preference: Respond in ${language === "fa" ? "Persian (فارسی)" : "English"} unless the user speaks or requests another language.
Maintain context seamlessly: If the user says "same hook", "change that script", or refers to earlier points, recognize and build upon the previous context accurately.
Do NOT output fake placeholders or generic clichés like "As an AI...". Give direct, high-value, tactical advice.`;

    const effectiveInstruction = systemInstruction || defaultInstruction;

    // Convert messages to Gemini contents format
    // Map messages: role "user" or "model"
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents,
      config: {
        systemInstruction: effectiveInstruction,
        temperature: 0.7,
        topP: 0.95,
      },
    });

    const reply = response.text || "No response generated.";
    return res.json({ reply });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate AI chat response.",
    });
  }
});

// Content Ideas Generator endpoint
app.post("/api/ai/generate-ideas", async (req, res) => {
  try {
    const { niche, topic, targetAudience, format, language } = req.body;

    const ai = getGenAI();
    const prompt = `Act as an elite YouTube growth strategist. Generate 5 highly clickable, viral-potential content ideas for:
Niche / Industry: ${niche || "General Creator"}
Specific Topic: ${topic || "Trending topics in the niche"}
Target Audience: ${targetAudience || "Broad interested viewers"}
Format: ${format || "Both Shorts and Long-form"}
Language: ${language === "fa" ? "Persian (فارسی)" : "English"}

Respond in JSON format matching this structure:
[
  {
    "id": "idea-1",
    "title": "Engaging, high-CTR title",
    "hook": "First 3-5 seconds opening hook",
    "format": "Shorts" or "Long-form",
    "targetAudience": "Audience description",
    "viralScore": 92,
    "keyTalkingPoints": ["Point 1", "Point 2", "Point 3"],
    "cta": "Compelling call to action"
  }
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || "[]");
    } catch {
      data = [];
    }

    return res.json({ ideas: data });
  } catch (error: any) {
    console.error("Content Ideas API error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate content ideas.",
    });
  }
});

// Hook & Script Studio Generator endpoint
app.post("/api/ai/generate-script", async (req, res) => {
  try {
    const { title, topic, videoType, tone, duration, language } = req.body;

    const ai = getGenAI();
    const prompt = `You are an elite video scriptwriter for top YouTube creators. Write a complete, high-retention video script package for:
Title: ${title}
Topic: ${topic}
Video Type: ${videoType || "YouTube Video"}
Tone: ${tone || "Engaging, Energetic, Authoritative"}
Target Length: ${duration || "3-5 minutes"}
Language: ${language === "fa" ? "Persian (فارسی)" : "English"}

Respond in JSON format matching this structure:
{
  "optimizedTitles": ["Title Option 1", "Title Option 2", "Title Option 3"],
  "hooks": [
    { "type": "Curiosity Gap", "script": "..." },
    { "type": "Contrarian / Shock", "script": "..." },
    { "type": "Story / Problem", "script": "..." }
  ],
  "fullScript": {
    "hook": "...",
    "intro": "...",
    "sections": [
      { "heading": "Part 1: The Foundation", "voiceover": "...", "visualCue": "B-roll of..." },
      { "heading": "Part 2: The Core Secret", "voiceover": "...", "visualCue": "On-screen motion graphic..." },
      { "heading": "Part 3: Common Pitfalls", "voiceover": "...", "visualCue": "Face to camera..." }
    ],
    "climax": "...",
    "cta": "..."
  },
  "descriptionSEO": "Optimized YouTube description with timestamps and keywords",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || "{}");
    } catch {
      data = {};
    }

    return res.json({ result: data });
  } catch (error: any) {
    console.error("Script generator error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate script.",
    });
  }
});

// YouTube Growth & Monetization strategy endpoint
app.post("/api/ai/growth-strategy", async (req, res) => {
  try {
    const { channelNiche, currentSubscribers, currentWatchHours, mainGoal, language } = req.body;

    const ai = getGenAI();
    const prompt = `Act as an expert YouTube channel manager and consultant. Analyze this channel profile and build a customized, realistic growth & monetization roadmap:
Channel Niche: ${channelNiche || "Tech / Education"}
Current Subscribers: ${currentSubscribers || 0}
Current Watch Hours: ${currentWatchHours || 0}
Main Goal: ${mainGoal || "Reach YouTube Partner Program (1,000 subs & 4,000 watch hours)"}
Language: ${language === "fa" ? "Persian (فارسی)" : "English"}

Respond in JSON format matching this structure:
{
  "monetizationStatus": "Progress assessment and realistic timeline",
  "recommendedCadence": "Upload schedule recommendation (e.g., 2 long-form + 4 shorts / week)",
  "phases": [
    {
      "phaseName": "Phase 1: Foundation & Authority",
      "target": "First 500 loyal subscribers",
      "actionItems": ["Action 1", "Action 2", "Action 3"]
    },
    {
      "phaseName": "Phase 2: Viral Multiplication & Retention",
      "target": "Surpassing 1,000 subscribers & 4,000 watch hours",
      "actionItems": ["Action 1", "Action 2", "Action 3"]
    },
    {
      "phaseName": "Phase 3: Monetization & Beyond",
      "target": "Revenue diversification, sponsors, affiliate programs",
      "actionItems": ["Action 1", "Action 2", "Action 3"]
    }
  ],
  "retentionChecklist": [
    "Checklist item 1",
    "Checklist item 2",
    "Checklist item 3",
    "Checklist item 4"
  ],
  "shortsStrategy": "Strategic integration of Shorts to feed the long-form funnel"
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    let data;
    try {
      data = JSON.parse(response.text || "{}");
    } catch {
      data = {};
    }

    return res.json({ strategy: data });
  } catch (error: any) {
    console.error("Growth strategy API error:", error);
    return res.status(500).json({
      error: error?.message || "Failed to generate growth strategy.",
    });
  }
});

// Vite middleware in development, static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CreatorFlow server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
