// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { initializeRAG, queryRAG } from './rag.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = [
  'http://localhost:5173',
  'https://zetachua.github.io',
  'https://www.zetachua.github.io',
  'https://zetachua.github.io/MAGIC',
];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET','POST','OPTIONS'],
  allowedHeaders: ['Content-Type']
}));// Ensure preflight OPTIONS requests are handled
app.use(express.json());

// In-memory chat histories
const chatHistories = new Map();

// Initialize RAG at server startup
initializeRAG().catch(err => {
  console.error('❌ Failed to initialize RAG:', err);
  process.exit(1);
});

// Mentor chat endpoint
app.post('/api/mentor-chat', async (req, res) => {
  const { userInput, userId } = req.body;
  if (!userInput) return res.status(400).json({ error: 'Question is required' });

  try {
    const chatHistory = chatHistories.get(userId) || [];
    const answer = await queryRAG(userInput, chatHistory);

    // Update chat history (keep last 10 messages)
    chatHistory.push({ role: 'user', content: userInput }, { role: 'assistant', content: answer });
    if (chatHistory.length > 10) chatHistory.splice(0, chatHistory.length - 10);
    chatHistories.set(userId, chatHistory);


    const cleanedAnswer = cleanResponse(answer);
    res.json({ answer :cleanedAnswer});
  } catch (error) {
    console.error('❌ Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Optional: video generation endpoint (if you have HeyGen API)
app.post('/api/generate-video', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Text is required' });

  try {
    // Replace with your actual video generation service
    res.json({ videoUrl: 'https://example.com/video-placeholder.mp4' });
  } catch (error) {
    console.error('❌ Video generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


const cleanResponse = (content) => {
    let cleaned = content
    .replace(/<think>[\s\S]*?<\/think>/g, '')  // Remove <think>...</think> tags
    .trim();

    return cleaned;
  };