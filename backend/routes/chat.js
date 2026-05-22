const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const Chat = require('../models/Chat');
const { protect } = require('../middleware/auth');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const MIRA_SYSTEM = `You are Mira, a compassionate AI mental wellness companion inside the MindSpace app. Your role is to:
- Listen non-judgmentally and validate feelings
- NEVER give medical diagnoses or prescribe medication
- Gently suggest professional help when appropriate
- Detect crisis signals (self-harm, suicide ideation) and immediately provide helpline numbers
- Keep responses warm, concise (2-4 sentences), and supportive
- Use the user's name when you know it
- For crisis: immediately say "I'm really concerned about your safety. Please contact iCall at 9152987821 or Vandrevala Foundation at 1860-2662-345 right now. You matter."
Crisis triggers: "end my life", "hurt myself", "suicide", "kill myself", "don't want to live", "self harm"`;

// POST /api/chat/message
router.post('/message', protect, async (req, res) => {
  try {
    const { message, history = [] } = req.body;

    // Check for safe word / crisis
    const safeWordTriggered = message.toUpperCase().includes(req.user.safeWord || 'HELP NOW');
    const crisisKeywords = ['end my life', 'hurt myself', 'suicide', 'kill myself', "don't want to live", 'self harm', 'self-harm'];
    const crisisDetected = safeWordTriggered || crisisKeywords.some(kw => message.toLowerCase().includes(kw));

    // Build messages for Claude
    const messages = [
      ...history.slice(-10).map(m => ({ role: m.role, content: m.content })),
      { role: 'user', content: message }
    ];

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 300,
      system: MIRA_SYSTEM,
      messages
    });

    const reply = response.content[0].text;

    // Save to DB
    let chat = await Chat.findOne({ user: req.user._id, date: { $gte: new Date().setHours(0,0,0,0) } });
    if (!chat) {
      chat = new Chat({ user: req.user._id, messages: [] });
    }
    chat.messages.push({ role: 'user', content: message });
    chat.messages.push({ role: 'assistant', content: reply });
    if (crisisDetected) chat.crisisDetected = true;
    await chat.save();

    res.json({ reply, crisisDetected });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/chat/history
router.get('/history', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ date: -1 }).limit(5);
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/chat/insight - weekly AI insight
router.get('/insight', protect, async (req, res) => {
  try {
    const Journal = require('../models/Journal');
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const journals = await Journal.find({ user: req.user._id, date: { $gte: sevenDaysAgo } });

    if (journals.length < 2) {
      return res.json({ insight: 'Keep journaling daily! After a few entries, I\'ll generate personalized insights for you. 💚' });
    }

    const summary = journals.map(j => `Mood: ${j.moodScore}/10 - ${j.content.substring(0, 100)}`).join('\n');

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 150,
      messages: [{
        role: 'user',
        content: `Based on this week's journal entries, give a warm 2-sentence personalized wellness insight. Be specific and encouraging:\n${summary}`
      }]
    });

    res.json({ insight: response.content[0].text });
  } catch (error) {
    res.json({ insight: 'You\'re doing great by taking care of your mental health. Keep up the journaling habit! 💚' });
  }
});

module.exports = router;
