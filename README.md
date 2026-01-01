# MindMate Frontend

Professional, minimalist voice-first mental health therapy application.

## 🎨 Design Philosophy

- **Deep Black Theme** - Calm, serious, privacy-focused
- **Emerald Green Accents** - Trust, growth, healing
- **Glassmorphism** - Modern, premium feel
- **Voice-First** - Meeting-style interface, not chat
- **Minimalist** - Clean, functional, professional

## 🚀 Quick Start

### Install Dependencies

```bash
cd frontend
npm install
```

### Run Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── LoginPage.jsx          # Google Sign-In
│   │   ├── Dashboard.jsx          # Session overview
│   │   └── TherapySession.jsx     # Voice therapy interface
│   ├── styles/
│   │   └── global.css             # Design system
│   ├── App.jsx                    # Main app routing
│   └── main.jsx                   # Entry point
├── public/
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎯 Features

### ✅ Implemented

- **Google OAuth Sign-In** - Secure authentication
- **Voice Therapy Sessions** - Web Speech API integration
- **Mood Tracking** - Before/after session  
- **Live Transcription** - Optional transcript panel
- **Session Timer** - Track therapy duration
- **Waveform Visualization** - Calm audio feedback
- **Session History** - View past sessions
- **Glassmorphism UI** - Premium, modern design

### 📋 Core Components

**LoginPage**
- Google Sign-In button
- Phone number input
- Minimalist branding
- Floating background gradients

**Dashboard**
- Session statistics
- Quick start therapy
- Recent sessions list
- Crisis resources access

**TherapySession**
- Large microphone control (meeting-style)
- Real-time waveform animation
- Session timer and mood display
- Optional transcript panel
- Voice input/output with Web Speech API

---

## 🎨 Design System

### Colors

```css
--bg-primary: #0a0a0a         /* Deep black */
--bg-secondary: #141414        /* Charcoal */
--accent-primary: #34d399      /* Emerald green */
--text-primary: #f5f5f5        /* White */
--text-secondary: #a3a3a3      /* Gray */
```

### Typography

- **Font:** Inter (Google Fonts)
- **Sizes:** 12px - 48px (responsive scale)
- **Weight:** 300-700 (emphasis on 400, 500, 600)

### Components

- **Glass Cards** - Frosted blur, subtle borders
- **Buttons** - Rounded, minimal, state-aware
- **Icons** - Lucide React (outline style)

---

## 🔌 API Integration

Backend: `http://localhost:8000`

### Endpoints Used

```javascript
POST  /api/auth/google-signin      // Login
GET   /api/chat/sessions/:userId   // Get sessions
POST  /api/chat/start-session      // Start therapy
POST  /api/chat/send-message       // Send voice message
POST  /api/chat/end-session        // End session
```

---

## 🎙️ Voice Features

### Web Speech API

**Speech Recognition (Input)**
```javascript
const recognition = new webkitSpeechRecognition()
recognition.continuous = true
recognition.lang = 'en-IN'
```

**Speech Synthesis (Output)**
```javascript
const utterance = new SpeechSynthesisUtterance(text)
utterance.lang = 'en-IN'
window.speechSynthesis.speak(utterance)
```

### Supported Languages
- English (India) - `en-IN`
- Extensible to Tamil, Hindi

---

## 🏗️ Build for Production

```bash
npm run build
```

Output: `dist/` folder

Deploy to:
- **Vercel** - `vercel --prod`
- **Netlify** - `netlify deploy --prod`
- **Firebase Hosting** - `firebase deploy`

---

## ⚙️ Configuration

### Google OAuth Setup

1. Get Client ID from [Google Cloud Console](https://console.cloud.google.com)
2. Add to `src/App.jsx`:

```javascript
<GoogleOAuthProvider clientId="YOUR_CLIENT_ID">
```

3. Authorized origins:
   - `http://localhost:3000`
   - `https://yourdomain.com`

### Backend Proxy

Configured in `vite.config.js`:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8000'
  }
}
```

---

## 📱 Responsive Design

- **Desktop:** Full features, side-by-side layout
- **Tablet:** Stacked layout, optimized touch targets
- **Mobile:** Single-column, mobile-first controls

---

## 🎯 User Flow

```
1. Login Page
   ↓ Google Sign-In + Phone
2. Dashboard
   ↓ Start Session
3. Mood Input (1-10)
   ↓ Submit Mood
4. Therapy Session
   ↓ Voice Conversation
5. End Session
   ↓ Return to Dashboard
```

---

##  🔒 Privacy & Security

- **No Data Storage** - Client-side only
- **HTTPS Required** - Production deployment
- **JWT Tokens** - Secure API authentication
- **No Audio Recording** - Real-time processing only

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Google Sign-In works
- [ ] Phone number validation
- [ ] Dashboard loads sessions
- [ ] Voice input activates
- [ ] Speech recognition works
- [ ] AI response plays audio
- [ ] Transcript updates
- [ ] Session timer runs
- [ ] End session saves data
- [ ] Logout clears storage

---

## 🐛 Troubleshooting

### Issue: Google Sign-In not working
**Solution:** Check Client ID and authorized origins

### Issue: Microphone not working
**Solution:**
- Chrome: Allow microphone permission
- HTTPS required in production
- Check browser console for errors

### Issue: API calls failing
**Solution:**
- Ensure backend is running on `http://localhost:8000`
- Check CORS configuration
- Verify JWT token is valid

---

## 📦 Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "@react-oauth/google": "^0.12.1",
  "axios": "^1.6.5",
  "lucide-react": "^0.303.0"
}
```

---

## 🎨 Design Credits

- **Inspiration:** Premium health-tech platforms
- **Icons:** Lucide React
- **Fonts:** Inter (Google Fonts)
- **Colors:** Custom palette (deep black + emerald green)

---

## 📄 License

MIT License - Built for MindMate POC

---

**Built with ❤️ for mental health awareness**
