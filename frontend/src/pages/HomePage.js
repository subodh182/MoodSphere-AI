import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import MoodSelector from '../components/Mood/MoodSelector';
import MoodDashboard from '../components/Mood/MoodDashboard';
import WeatherBanner from '../components/Mood/WeatherBanner';
import MoodHistory from '../components/Mood/MoodHistory';
import AIChat from '../components/Mood/AIChat';
import MoodGraph from '../components/Mood/MoodGraph';
import Footer from '../components/Shared/Footer';
import './HomePage.css';

const API_BASE = process.env.REACT_APP_API_URL || '';

export default function HomePage() {
  const { user, userProfile } = useAuth();
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodContent, setMoodContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [counters, setCounters] = useState({});
  const [sessionHistory, setSessionHistory] = useState([]);
  const [greeting, setGreeting] = useState('');
  const { updateMoodHistory } = useAuth() || {};

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Subah ki shubhkamnaayein! ☀️');
    else if (h < 17) setGreeting('Dopahar ko namaste! 🌤️');
    else if (h < 21) setGreeting('Shaam ko kaise ho? 🌆');
    else setGreeting('Raat ko kya chal raha hai? 🌙');
    fetchCounters();
  }, []);

  const fetchCounters = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/counters`);
      setCounters(res.data);
    } catch { setCounters({ bored: 1247, sad: 834, productive: 2156, relaxed: 1089, confused: 673, anxious: 421, excited: 987 }); }
  };

  const handleMoodSelect = async (mood) => {
    setLoading(true);
    setSelectedMood(mood);
    playSound();
    try {
      const [res] = await Promise.all([
        axios.get(`${API_BASE}/api/mood/${mood}`),
        axios.post(`${API_BASE}/api/mood/${mood}/count`)
      ]);
      setMoodContent(res.data);
      setCounters(p => ({ ...p, [mood]: (p[mood] || 0) + 1 }));
      setSessionHistory(p => [{ mood, time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }) }, ...p].slice(0, 8));
      if (updateMoodHistory) updateMoodHistory(mood);
    } catch {
      setMoodContent(fallback(mood));
    }
    setLoading(false);
  };

  const handleReset = () => { setSelectedMood(null); setMoodContent(null); };

  return (
    <div className="home-page">
      {/* Hero / top bar */}
      <div className="home-hero">
        <div className="container">
          <div className="hero-greeting">
            <span className="greeting-badge badge">{greeting}</span>
            {user && userProfile && (
              <span className="user-welcome badge">
                👋 Welcome back, <strong>{userProfile.displayName?.split(' ')[0]}!</strong>
                {userProfile.streak > 0 && <span className="streak-pill">🔥 {userProfile.streak} day streak</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Weather suggestion */}
      <div className="container">
        <WeatherBanner onMoodSuggest={handleMoodSelect} />
      </div>

      {/* Main mood area */}
      <div className="container home-main">
        {!selectedMood ? (
          <MoodSelector onMoodSelect={handleMoodSelect} counters={counters} />
        ) : loading ? (
          <div className="mood-loading">
            <div className="mood-loading-emoji">✨</div>
            <p>Tera mood samajh raha hoon...</p>
            <div className="loading-dots"><span/><span/><span/></div>
          </div>
        ) : (
          <MoodDashboard mood={selectedMood} content={moodContent} counter={counters[selectedMood]} onReset={handleReset} />
        )}
      </div>

      {/* Bottom sections */}
      <div className="container home-bottom">
        <div className="home-bottom-grid">
          {/* Session history */}
          {sessionHistory.length > 0 && (
            <MoodHistory sessionHistory={sessionHistory} userHistory={userProfile?.moodHistory} />
          )}

          {/* Mood graph */}
          {(sessionHistory.length > 1 || (userProfile?.moodHistory?.length > 1)) && (
            <MoodGraph history={userProfile?.moodHistory || sessionHistory} />
          )}
        </div>

        {/* AI Chat */}
        {selectedMood && (
          <AIChat mood={selectedMood} userName={userProfile?.displayName || user?.displayName || 'Yaar'} />
        )}
      </div>

      <div className="container"><Footer /></div>
    </div>
  );
}

const playSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
  } catch {}
};

const fallback = (mood) => ({
  bored: { emoji: '😴', color: '#FF6B6B', title: 'Bored Ho?', assistantMsg: "Chal kuch mast karte hain! 🎯", dos: ["Game khel!","Dost ko call!","Kuch naya seek!"], donts: ["Reels mat!","Fridge mat!","Episode mat!"], content: { links: [{ label: "2048 🎮", url: "https://play2048.co/", icon: "🎮" }] }, randomFact: "Boredom se creativity badhti hai!", randomQuote: { text: "Curiosity kills boredom!", author: "Unknown" }, counter: 1247 },
  sad: { emoji: '😢', color: '#74B9FF', title: 'Sad Ho?', assistantMsg: "Sab theek hoga! 💙", dos: ["Paani pi!","Bahar jao!","Text karo!"], donts: ["Sad songs mat!","Social media mat!","Akele mat!"], content: { links: [{ label: "Cute Animals 🐾", url: "https://reddit.com/r/aww", icon: "🐾" }] }, randomFact: "Sad hona normal hai!", randomQuote: { text: "This too shall pass.", author: "Unknown" }, counter: 834 },
  productive: { emoji: '⚡', color: '#00B894', title: 'Productive!', assistantMsg: "Aaj ka din tera hai! ⚡", dos: ["25 min focus!","Important pehle!","Goal likh!"], donts: ["Instagram mat!","Multitask mat!","Meeting mat!"], content: { links: [{ label: "Coursera 📚", url: "https://coursera.org", icon: "📚" }] }, randomFact: "Flow mein dopamine!", randomQuote: { text: "Done > Perfect.", author: "Sandberg" }, counter: 2156 },
  relaxed: { emoji: '😌', color: '#FDCB6E', title: 'Relax!', assistantMsg: "Enjoy kar! 🌸", dos: ["Chai!","Book!","Stretch!"], donts: ["Guilt mat!","Decision mat!","Screen mat!"], content: { links: [{ label: "Lo-fi 🎧", url: "https://youtube.com/watch?v=jfKfPfyJRdk", icon: "🎧" }] }, randomFact: "Relaxation = productivity!", randomQuote: { text: "Rest is productive.", author: "Unknown" }, counter: 1089 },
  confused: { emoji: '🤔', color: '#A29BFE', title: 'Confused?', assistantMsg: "Flow kar bhai! 🎲", dos: ["5 min ruko!","Random try!","Khud se pucho!"], donts: ["Overthink mat!","Opinion mat maango!","Force mat!"], content: { links: [{ label: "Random Wiki 🌍", url: "https://en.wikipedia.org/wiki/Special:Random", icon: "🌍" }] }, randomFact: "Confusion = creativity!", randomQuote: { text: "Not all who wander are lost.", author: "Tolkien" }, counter: 673 },
  anxious: { emoji: '😰', color: '#FD79A8', title: 'Anxious?', assistantMsg: "Breathe kar, main hoon! 💗", dos: ["4-7-8 breathing!","5 senses engage!","Kisi ko call!"], donts: ["Caffeine mat!","Worst case mat soch!","News mat dekh!"], content: { links: [{ label: "Breathing 🧘", url: "https://calm.com/breathe", icon: "🧘" }] }, randomFact: "Deep breathing vagus nerve activate karta hai!", randomQuote: { text: "You are braver than you believe.", author: "Milne" }, counter: 421 },
  excited: { emoji: '🤩', color: '#FFD93D', title: 'Excited!', assistantMsg: "WOHOO! Channel it bhai! 🤩", dos: ["Creative project!","Share karo!","Journal karo!"], donts: ["Impulsive mat!","Jaag mat!","Overpromise mat!"], content: { links: [{ label: "Product Hunt 🚀", url: "https://producthunt.com", icon: "🚀" }] }, randomFact: "Excitement aur anxiety same pathway!", randomQuote: { text: "Life is a daring adventure.", author: "Keller" }, counter: 987 },
}[mood] || { emoji: '😴', color: '#FF6B6B', title: 'Mood Check!', assistantMsg: "Chal explore karte hain!", dos: ["Kuch try karo!"], donts: ["Bore mat ho!"], content: { links: [] }, randomFact: "Har din ek naya mauka!", randomQuote: { text: "Just be.", author: "Unknown" }, counter: 0 });
