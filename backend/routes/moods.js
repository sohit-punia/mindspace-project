const express = require('express');
const router = express.Router();
const Mood = require('../models/Mood');
const { protect } = require('../middleware/auth');

// POST /api/moods
router.post('/', protect, async (req, res) => {
  try {
    const { score, label, note } = req.body;
    const mood = await Mood.create({ user: req.user._id, score, label, note });
    res.status(201).json(mood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/moods?days=7
router.get('/', protect, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 7;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const moods = await Mood.find({ user: req.user._id, date: { $gte: since } }).sort({ date: 1 });
    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
