# 🧠 MindSpace — AI-Powered Mental Wellness Companion

> A full-stack MERN + Claude AI college project for mental wellness tracking.

---

## 📁 Project Structure

```
mindspace/
├── backend/          ← Node.js + Express + MongoDB + Claude AI
│   ├── config/       ← Database connection
│   ├── middleware/   ← JWT auth
│   ├── models/       ← User, Journal, Mood, Chat schemas
│   ├── routes/       ← API routes
│   ├── server.js     ← Entry point
│   └── .env.example  ← Environment variables template
│
└── frontend/         ← React + Vite + Recharts
    └── src/
        ├── components/  ← AppShell (sidebar + mobile nav)
        ├── context/     ← Auth context
        ├── pages/       ← Dashboard, Journal, Chat, Breathe, Crisis, Profile
        └── utils/       ← Axios API client
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://cloud.mongodb.com) — free tier)
- Anthropic API key → [console.anthropic.com](https://console.anthropic.com)

---

### 1. Backend Setup

```bash
cd mindspace/backend
npm install
```

Create `.env` file (copy from `.env.example`):
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindspace
JWT_SECRET=any_long_random_string_here
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxx
NODE_ENV=development
```

> **MongoDB Atlas (cloud):** Replace MONGODB_URI with your Atlas connection string:
> `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/mindspace`

Start backend:
```bash
npm run dev
```
Backend runs at: http://localhost:5000

---

### 2. Frontend Setup

```bash
cd mindspace/frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:5173

---

### 3. Open the app

Visit **http://localhost:5173** in your browser.
Register a new account → start journaling!

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 📓 Daily Journal | Free-write + mood rating (1–10) |
| 🤖 AI Sentiment Analysis | Claude API analyzes PHQ-9 signals |
| 📊 Mood Dashboard | Recharts area graph + weekly stats |
| 💬 AI Companion (Mira) | Real-time chat powered by Claude |
| 🌿 Breathing Exercises | 4-7-8 breathing + grounding techniques |
| 🆘 Crisis Support | Indian helplines + safe word detection |
| 🔒 JWT Auth | Secure login + bcrypt password hashing |
| 📱 Fully Responsive | Works on phone, tablet, laptop, desktop |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + React Router |
| Styling | Custom CSS (no Tailwind needed) |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| AI/NLP | Claude API (claude-sonnet-4-20250514) |
| Auth | JWT + bcryptjs |
| HTTP | Axios |

---

## 🔌 API Endpoints

```
POST   /api/auth/register     → Register new user
POST   /api/auth/login        → Login
GET    /api/auth/me           → Get current user
PUT    /api/auth/profile      → Update profile

POST   /api/journals          → Create journal + AI analysis
GET    /api/journals          → Get all journals
GET    /api/journals/stats    → Get mood stats
GET    /api/journals/:id      → Get single journal

POST   /api/chat/message      → Send message to Mira (AI)
GET    /api/chat/history      → Get chat history
GET    /api/chat/insight      → Get weekly AI insight

POST   /api/moods             → Log mood
GET    /api/moods?days=7      → Get mood history
```

---

## 📱 Mobile Support

The app is fully responsive:
- **Mobile**: hamburger menu, touch-friendly chat, compact cards
- **Tablet**: adaptive sidebar
- **Desktop**: full sidebar layout

---

## 🔒 Privacy & Safety

- Journal entries are analyzed by AI only — never read by humans
- PHQ-9 depression screening runs automatically in the background
- Crisis detection triggers immediate helpline display
- Safe word feature (default: "HELP NOW") in AI chat
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens expire in 30 days

---

## 📋 College Demo Tips

1. Show the **register → journal → AI analysis** flow first
2. Demonstrate the **mood chart** building up over time
3. Show **Mira chatting** about anxiety or stress
4. Show **crisis detection** (type a distress phrase)
5. Show **mobile view** — resize browser or use DevTools

---

## 👨‍💻 Built With

- [Anthropic Claude API](https://anthropic.com)
- [MongoDB Atlas](https://cloud.mongodb.com)
- [Recharts](https://recharts.org)
- [React Router](https://reactrouter.com)
- [React Hot Toast](https://react-hot-toast.com)
