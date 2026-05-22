const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  moodScore: { type: Number, required: true, min: 1, max: 10 },
  moodLabel: { type: String, enum: ['Very Low', 'Low', 'Okay', 'Good', 'Great'] },
  aiAnalysis: {
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative', 'crisis'] },
    phq9Risk: { type: String, enum: ['low', 'moderate', 'high', 'crisis'], default: 'low' },
    keyThemes: [String],
    summary: String,
    suggestions: [String],
    crisisDetected: { type: Boolean, default: false }
  },
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Journal', journalSchema);
