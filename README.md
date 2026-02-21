# 🌈 Mood Internet v2 — Your Personal Digital Friend

> A mood-based interactive web application that acts as your digital companion — guiding you with personalized content, AI chat, and community connection based on how you feel.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🎭 **7 Mood Modes** | Bored, Sad, Productive, Relaxed, Confused, Anxious, Excited |
| 🤖 **AI Chat (Claude)** | Real-time conversation with Claude AI based on your current mood |
| ✅ **Do's & Don'ts** | Practical, mood-specific advice for every emotion |
| 💬 **Quote Carousel** | 5 rotating motivational quotes per mood with prev/next navigation |
| 🔗 **Share Mood** | Share on WhatsApp, Twitter, or copy link — viral loop built in |
| 📊 **Mood History** | Track your mood patterns across sessions (Firebase stored) |
| 📈 **Mood Graph** | Visual bar chart of your most frequent moods |
| 🌤️ **Weather Mood Suggestion** | Location-based mood recommendation using OpenWeather API |
| 🎲 **Surprise Button** | Floating button with random interesting facts & crazy websites |
| 👥 **Community Counter** | Shows how many users share your current mood — "You are not alone!" |
| 🔥 **Daily Streak** | Tracks consecutive daily visits, shows on navbar & profile |
| 🏆 **Achievement Badges** | 8 unlockable badges based on usage milestones |
| 👤 **User Profile** | Unique profile page with stats, mood history, bio, favorite emoji |
| 🔐 **Auth System** | Email/Password + Google OAuth login via Firebase |
| 🌙☀️ **Dark/Light Theme** | Smooth theme toggle with persistent localStorage preference |
| 📱 **PWA Support** | Installable as a mobile app from the browser |
| 🎵 **Sound Effects** | Satisfying click/ding sounds using Web Audio API |
| ✨ **Particle Background** | Canvas-based animated particles that change color with mood |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React.js 18, React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth (Email + Google OAuth) |
| **AI** | Anthropic Claude API (claude-sonnet-4-20250514) |
| **Weather** | OpenWeather API (optional) |
| **Animations** | CSS Animations + Canvas API |
| **Fonts** | Baloo 2 + Nunito + Sora (Google Fonts) |
| **Notifications** | React Hot Toast |

---

## 📁 Project Structure

```
mood-internet-v2/
├── backend/
│   ├── server.js              # Express API — mood data, AI proxy, weather
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── public/
│   │   ├── index.html         # PWA meta tags + favicon
│   │   └── manifest.json      # PWA manifest
│   ├── src/
│   │   ├── App.js             # Router setup
│   │   ├── index.js           # App entry with providers
│   │   ├── context/
│   │   │   ├── AuthContext.js # Firebase auth + profile management
│   │   │   └── ThemeContext.js
│   │   ├── firebase/
│   │   │   └── config.js      # Firebase initialization
│   │   ├── hooks/
│   │   │   └── useMoodState.js
│   │   ├── pages/
│   │   │   ├── HomePage.js    # Main mood experience
│   │   │   ├── AuthPage.js    # Login / Register
│   │   │   └── ProfilePage.js # User profile + achievements
│   │   ├── components/
│   │   │   ├── Navbar/        # Professional navbar with dropdown
│   │   │   ├── Mood/
│   │   │   │   ├── MoodSelector.js   # 7-card mood grid
│   │   │   │   ├── MoodDashboard.js  # Content + share + quotes
│   │   │   │   ├── AIChat.js         # AI conversation widget
│   │   │   │   ├── WeatherBanner.js  # Weather-based suggestion
│   │   │   │   ├── MoodHistory.js    # Session/Firebase history
│   │   │   │   ├── MoodGraph.js      # Visual mood frequency
│   │   │   │   └── SurpriseButton.js # Floating FAB
│   │   │   └── Shared/
│   │   │       ├── ParticlesBg.js    # Canvas particles
│   │   │       └── Footer.js
│   │   └── styles/
│   │       └── global.css     # Full theme system + utilities
│   └── package.json
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v16+
- npm or yarn
- Firebase project (free tier works)
- Anthropic API key (for AI chat — optional, fallback works without it)

---

## 🔧 Local Development Setup

### 1. Clone / Extract
```bash
cd mood-internet-v2
```

### 2. Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Authentication** → Sign-in methods → Enable **Email/Password** and **Google**
4. Create **Firestore Database** (start in test mode, then add rules)
5. Go to **Project Settings** → **Your Apps** → Add Web App → Copy config

### 3. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your keys
npm run dev
# Runs on: http://localhost:5000
```

**Backend `.env` variables:**
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-...       # From console.anthropic.com
OPENWEATHER_API_KEY=...             # From openweathermap.org (optional)
```

### 4. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env with your Firebase config
npm start
# Runs on: http://localhost:3000
```

**Frontend `.env` variables:**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123:web:abc
```

---

## 🚂 Deploy Backend on Railway

1. Go to [railway.app](https://railway.app) → Sign in with GitHub
2. **New Project** → **Deploy from GitHub repo**
3. Set **Root Directory** to `backend`
4. Add **Environment Variables** in Railway dashboard:
   ```
   PORT=5000
   FRONTEND_URL=https://your-app.vercel.app
   ANTHROPIC_API_KEY=your_key
   OPENWEATHER_API_KEY=your_key
   ```
5. Copy your Railway URL (e.g., `https://mood-backend.railway.app`)

---

## ▲ Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. **Add New Project** → Import your repo
3. Set **Root Directory** to `frontend`
4. Add **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-railway-backend.railway.app
   REACT_APP_FIREBASE_API_KEY=AIza...
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=...
   REACT_APP_FIREBASE_APP_ID=...
   ```
5. Click **Deploy** → Done!

---

## 🔥 Firebase Firestore Security Rules

Add these rules in **Firebase Console → Firestore → Rules**:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🔗 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/mood/:mood` | Get mood content + quotes + fact |
| POST | `/api/mood/:mood/count` | Increment community counter |
| GET | `/api/counters` | All mood counters |
| GET | `/api/surprise` | Random surprise fact |
| GET | `/api/moods/list` | List all available moods |
| POST | `/api/ai/chat` | AI chat via Claude API |
| GET | `/api/weather-mood` | Weather-based mood suggestion |

---

## 🎨 Design System

### Color Palette (per mood)
| Mood | Color |
|------|-------|
| Bored 😴 | `#FF6B6B` |
| Sad 😢 | `#74B9FF` |
| Productive ⚡ | `#00B894` |
| Relaxed 😌 | `#FDCB6E` |
| Confused 🤔 | `#A29BFE` |
| Anxious 😰 | `#FD79A8` |
| Excited 🤩 | `#FFD93D` |

### Typography
- **Display**: Baloo 2 (headings, labels)
- **Body**: Nunito (paragraphs, UI text)
- **Accent**: Sora (special elements)

---

## 📱 Responsive Breakpoints

| Breakpoint | Layout |
|-----------|--------|
| `> 900px` | Full desktop — 4-column mood grid, side-by-side panels |
| `700–900px` | Tablet — 2-column grid, stacked panels |
| `< 700px` | Mobile — 2-column mood grid, single column |
| `< 400px` | Small mobile — compact everything |

---

## 🏆 Achievements System

| Badge | Requirement |
|-------|-------------|
| 🌟 First Step | Check mood for the first time |
| 🔥 3 Day Streak | Use app 3 days in a row |
| 💎 Week Warrior | 7-day streak |
| 📊 Mood Explorer | Check 10 different moods |
| ⚡ Go-Getter | Use Productive mood |
| 🌈 Rainbow Soul | Try 5 different moods |
| 🏆 Regular | Visit 10 times |
| 👑 Mood Master | Visit 50 times |

---

## 📝 License

MIT License — Free to use, modify, and distribute.

---

<div align="center">

**Made with ❤️ in India 🇮🇳**

*"Aaj ka din tera hai — Mood Internet ke saath!" 🌈*

</div>
