const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const Journal = require('../models/Journal');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Analyze journal with Claude AI
async function analyzeJournal(content, moodScore) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 600,
      messages: [{
        role: 'user',
        content: `You are a compassionate mental wellness AI. Analyze this journal entry and respond ONLY with valid JSON (no markdown, no backticks).

Journal entry: "${content}"
Mood score: ${moodScore}/10

Respond with this exact JSON structure:
{
  "sentiment": "positive|neutral|negative|crisis",
  "phq9Risk": "low|moderate|high|crisis",
  "keyThemes": ["theme1", "theme2"],
  "summary": "2-sentence empathetic summary",
  "suggestions": ["suggestion1", "suggestion2"],
  "crisisDetected": false
}

Crisis keywords to watch: suicide, self-harm, hopeless, end my life, don't want to live, hurt myself.
Be warm, non-clinical, and supportive in the summary and suggestions.`
      }]
    });

    const text = response.content[0].text.trim();
    return JSON.parse(text);
  } catch (err) {
    return {
      sentiment: moodScore >= 7 ? 'positive' : moodScore >= 4 ? 'neutral' : 'negative',
      phq9Risk: 'low',
      keyThemes: ['reflection'],
      summary: 'Your entry has been saved. Keep journaling regularly for best results.',
      suggestions: ['Continue journaling daily', 'Try a breathing exercise today'],
      crisisDetected: false
    };
  }
}

// POST /api/journals
router.post('/', protect, async (req, res) => {
  try {
    const { content, moodScore, moodLabel } = req.body;

    if (!content || !moodScore) {
      return res.status(400).json({ message: 'Content and mood score required' });
    }

    const aiAnalysis = await analyzeJournal(content, moodScore);

    const journal = await Journal.create({
      user: req.user._id,
      content,
      moodScore,
      moodLabel,
      aiAnalysis
    });

    // Update streak
    const user = await User.findById(req.user._id);
    const today = new Date();
    const lastJournal = user.lastJournalDate;
    if (lastJournal) {
      const dayDiff = Math.floor((today - lastJournal) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) user.journalStreak += 1;
      else if (dayDiff > 1) user.journalStreak = 1;
    } else {
      user.journalStreak = 1;
    }
    user.lastJournalDate = today;
    await user.save();

    res.status(201).json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/journals
router.get('/', protect, async (req, res) => {
  try {
    const journals = await Journal.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    res.json(journals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/journals/stats
router.get('/stats', protect, async (req, res) => {
  try {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const journals = await Journal.find({
      user: req.user._id,
      date: { $gte: sevenDaysAgo }
    }).sort({ date: 1 });

    const avgMood = journals.length
      ? (journals.reduce((sum, j) => sum + j.moodScore, 0) / journals.length).toFixed(1)
      : 0;

    const user = await User.findById(req.user._id);

    res.json({
      avgMood,
      streak: user.journalStreak,
      totalEntries: await Journal.countDocuments({ user: req.user._id }),
      weeklyMoods: journals.map(j => ({
        date: j.date,
        score: j.moodScore,
        label: j.moodLabel
      })),
      riskLevel: journals.length ? journals[journals.length - 1].aiAnalysis?.phq9Risk : 'low'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/journals/:id
router.get('/:id', protect, async (req, res) => {
  try {
    const journal = await Journal.findOne({ _id: req.params.id, user: req.user._id });
    if (!journal) return res.status(404).json({ message: 'Journal not found' });
    res.json(journal);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
