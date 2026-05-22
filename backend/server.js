const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: [
    'https://mindspace-project-vrkx-b7ricf50a-sohit-punias-projects.vercel.app',
    'https://mindspace-project-vrkx.vercel.app',
    'http://localhost:5173'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/journals', require('./routes/journals'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/moods', require('./routes/moods'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'MindSpace API running ✅' }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 MindSpace server running on port ${PORT}`));
