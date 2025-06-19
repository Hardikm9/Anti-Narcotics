import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Smart, keyword-based chatbot
app.post('/api/chatbot', (req, res) => {
  const userMessage = req.body.message.toLowerCase();
  let reply = "I'm here to help you recover. Let's talk more about how you're feeling.";

  if (userMessage.includes("relapse")) {
    reply = "Relapses happen — they don’t define you. Want to talk about what led to it?";
  } else if (
    userMessage.includes("sad") || 
    userMessage.includes("depressed") || 
    userMessage.includes("bad") || 
    userMessage.includes("low")
  ) {
    reply = "I'm sorry you're feeling this way. You're not alone — want to talk about what's going on?";
  } else if (
    userMessage.includes("happy") || 
    userMessage.includes("good") || 
    userMessage.includes("better")
  ) {
    reply = "That's great to hear! Every step forward counts. How can we build on that today?";
  } else if (
    userMessage.includes("hi") || 
    userMessage.includes("hello")
  ) {
    reply = "Hey! I'm your AI support buddy — how are you feeling today?";
  } else if (userMessage.includes("thank")) {
    reply = "You're very welcome. I'm always here to support you.";
  } else if (userMessage.includes("bye")) {
    reply = "Take care. You're not alone on this path. Come back anytime.";
  } else if (
    userMessage.includes("help") || 
    userMessage.includes("support")
  ) {
    reply = "Of course. Tell me what you’re struggling with — I’m here to guide you.";
  } else if (
    userMessage.includes("no") || 
    userMessage.includes("nah")
  ) {
    reply = "That's okay. When you're ready to talk, I’m here.";
  } else if (
    userMessage.includes("addicted") || 
    userMessage.includes("can't stop") || 
    userMessage.includes("craving")
  ) {
    reply = "Acknowledging addiction is a brave step. Let's work through this together. What usually triggers it for you?";
  } else if (
    userMessage.includes("ok") || 
    userMessage.includes("fine")
  ) {
    reply = "Okay. Want to talk more about your recovery today?";
  }

  res.json({ reply });
});

// Anonymous report system
app.post('/api/report', (req, res) => {
  const reportData = req.body;
  const filePath = path.join(__dirname, 'reports.json');

  fs.readFile(filePath, 'utf8', (err, data) => {
    let reports = [];
    if (!err && data) {
      try {
        reports = JSON.parse(data);
      } catch (parseErr) {
        console.error('Failed to parse reports.json');
      }
    }

    reports.push({ ...reportData, time: new Date().toISOString() });

    fs.writeFile(filePath, JSON.stringify(reports, null, 2), (err) => {
      if (err) {
        console.error('Error saving report:', err);
        return res.status(500).json({ message: 'Failed to save report' });
      }
      res.status(200).json({ message: 'Report submitted successfully' });
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
