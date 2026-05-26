const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: function(origin, callback) {
    if (!origin || 
        origin.endsWith('.vercel.app') || 
        origin === 'http://localhost:5173') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
// Keep alive ping
setInterval(() => {
  fetch('https://mindspace-backend-gk8v.onrender.com')
    .catch(() => {});
}, 840000); // every 14 minutes

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
