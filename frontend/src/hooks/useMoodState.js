import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const API_BASE = process.env.REACT_APP_API_URL || '';

export const useMoodState = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodContent, setMoodContent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const { updateMoodHistory } = useAuth() || {};

  const selectMood = useCallback(async (mood) => {
    setLoading(true);
    setSelectedMood(mood);
    playClickSound();

    try {
      const [contentRes] = await Promise.all([
        axios.get(`${API_BASE}/api/mood/${mood}`),
        axios.post(`${API_BASE}/api/mood/${mood}/count`)
      ]);
      setMoodContent(contentRes.data);
      const entry = { mood, time: new Date().toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit' }), timestamp: Date.now() };
      setMoodHistory(prev => [entry, ...prev].slice(0, 10));
      if (updateMoodHistory) updateMoodHistory(mood);
    } catch (e) {
      toast.error('Server se connect nahi ho paya!');
      setMoodContent(getFallback(mood));
    }
    setLoading(false);
  }, [updateMoodHistory]);

  const resetMood = useCallback(() => {
    setSelectedMood(null);
    setMoodContent(null);
  }, []);

  return { selectedMood, moodContent, loading, moodHistory, selectMood, resetMood };
};

const playClickSound = () => {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.2);
  } catch (e) {}
};

const getFallback = (mood) => {
  const fallbacks = {
    bored: { emoji: '😴', color: '#FF6B6B', title: 'Bored Ho?', assistantMsg: "Chal kuch mast karte hain! 🎯", dos: ["Game khel!","Dost ko call kar!","Kuch naya seek!"], donts: ["Reels mat khol!","Fridge mat khol!","Episode mat dekh!"], content: { links: [{ label: "2048 🎮", url: "https://play2048.co/", icon: "🎮" }] }, randomFact: "Boredom se creativity badhti hai! 🎨", randomQuote: { text: "Curiosity kills boredom!", author: "Unknown" }, counter: 1247 },
    sad: { emoji: '😢', color: '#74B9FF', title: 'Sad Ho?', assistantMsg: "Sab theek hoga! 💙", dos: ["Paani pi!","Bahar jao!","Dost ko text kar!"], donts: ["Sad songs mat sun!","Social media mat khol!","Akele mat reh!"], content: { links: [{ label: "Cute Animals 🐾", url: "https://reddit.com/r/aww", icon: "🐾" }] }, randomFact: "Sad hona normal hai! 💙", randomQuote: { text: "This too shall pass.", author: "Unknown" }, counter: 834 },
    productive: { emoji: '⚡', color: '#00B894', title: 'Productive!', assistantMsg: "Aaj ka din tera hai! ⚡", dos: ["25 min focus!","Important task pehle!","Goal likh!"], donts: ["Instagram mat khol!","Multitask mat kar!","Meeting mat schedule kar!"], content: { links: [{ label: "Coursera 📚", url: "https://coursera.org", icon: "📚" }] }, randomFact: "Flow mein dopamine release hota hai! 🏄", randomQuote: { text: "Done > Perfect.", author: "Sheryl Sandberg" }, counter: 2156 },
    relaxed: { emoji: '😌', color: '#FDCB6E', title: 'Relax!', assistantMsg: "Enjoy kar yaar! 🌸", dos: ["Chai bana!","Book padh!","Stretch kar!"], donts: ["Guilt mat feel kar!","Decision mat le!","Screen mat dekh!"], content: { links: [{ label: "Lo-fi 🎧", url: "https://youtube.com/watch?v=jfKfPfyJRdk", icon: "🎧" }] }, randomFact: "Relaxation productivity badhata hai! 🌿", randomQuote: { text: "Rest is productive.", author: "Unknown" }, counter: 1089 },
  };
  return fallbacks[mood] || fallbacks.bored;
};
