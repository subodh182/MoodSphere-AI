require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
// const PORT = process.env.PORT || 5000;

// app.use(cors({ origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

// ─── In-memory mood counters (no DB needed for counters) ───
const moodCounters = { bored: 1247, sad: 834, productive: 2156, relaxed: 1089, confused: 673, anxious: 421, excited: 987 };

// ─── Mood Content Data ───
const moodData = {
  bored: {
    emoji: '😴', color: '#FF6B6B',
    title: 'Bored Ho? Koi Baat Nahi!',
    assistantMsg: "Arey yaar! Scrolling band kar, main hoon na tere saath! Chal aaj kuch mast karte hain. Teri boredom ko main 2 minute mein bhaga deta hoon! 🎯",
    dos: ["Ye mini game khel - 5 minute mein mood fresh!", "Kisi dost ko surprise call maar - uska din bana de!", "Ek naya skill try kar - Duolingo pe koi language!"],
    donts: ["Instagram Reels mat khol - 1 ghanta kab nikal jayega pata nahi!", "Fridge mat khol baar baar - boredom eating se bacho!", "Ek aur episode mat dekh - 'just one more' trap hai ye!"],
    quotes: [
      { text: "Boredom is the feeling that everything is a waste of time; serenity, that nothing is.", author: "Thomas Szasz" },
      { text: "In order to live free and happily, you must sacrifice boredom.", author: "Richard Bach" },
      { text: "Boredom always precedes a period of great creativity.", author: "Robert M. Pirsig" },
      { text: "Yaar, bore hona bhi ek skill hai - tu actually recharge ho raha hai!", author: "Mood Internet" },
      { text: "The cure for boredom is curiosity. There is no cure for curiosity.", author: "Dorothy Parker" }
    ],
    content: { type: "game", links: [{ label: "2048 Game 🎮", url: "https://play2048.co/", icon: "🎮" }, { label: "Quick Chess ♟️", url: "https://www.chess.com/play/computer", icon: "♟️" }, { label: "Wordle 📝", url: "https://www.nytimes.com/games/wordle/index.html", icon: "📝" }] },
    facts: ["Bored rehne se creativity badhti hai! Tu actually creative mode mein hai! 🎨", "90% log boredom mein apni best ideas soochte hain.", "Boredom ek superpower hai - Einstein bhi bored rehte the!"]
  },
  sad: {
    emoji: '😢', color: '#74B9FF',
    title: 'Sad Ho? Main Hoon Na!',
    assistantMsg: "Yaar, sab theek ho jayega. Main jaanta hoon abhi thoda mushkil lag raha hai, par tu strong hai. Chal saath mein thoda better feel karte hain! 💙",
    dos: ["Thoda paani pi - seriously, dehydration mood kharab karta hai!", "5 minute bahar jaa, fresh air lo!", "Kisi apne ko text kar - connection helps!"],
    donts: ["Sad songs mat sun abhi - mood aur deep ho jayega!", "Social media scroll mat kar - comparison trap!", "Akele ghar mein band mat reh!"],
    quotes: [
      { text: "Sadness flies away on the wings of time.", author: "Jean de La Fontaine" },
      { text: "Even the darkest night will end and the sun will rise.", author: "Victor Hugo" },
      { text: "Yaar, tere jaisa strong koi nahi - ye waqt bhi guzar jayega.", author: "Mood Internet" },
      { text: "Tears are words the heart can't express.", author: "Gerard Way" },
      { text: "It's okay to not be okay. Just don't stay there.", author: "Unknown" }
    ],
    content: { type: "calming", links: [{ label: "Calming Music 🎵", url: "https://www.youtube.com/watch?v=1ZYbU82GVz4", icon: "🎵" }, { label: "Cute Animals 🐾", url: "https://www.reddit.com/r/aww/", icon: "🐾" }, { label: "Breathing Exercise 🧘", url: "https://www.calm.com/breathe", icon: "🧘" }] },
    facts: ["Sad feel karna normal hai. Ye tujhe kuch bata raha hai! 💙", "Research: 20 second hug serotonin badhata hai.", "Tu jo bhi feel kar raha hai, koi aur bhi yehi feel kar raha hai!"]
  },
  productive: {
    emoji: '⚡', color: '#00B894',
    title: 'Productive Mode: ON! 🚀',
    assistantMsg: "YESSSS! Aaj ka din tera hai bhai! Tu productive mood mein hai - ye feeling rare hoti hai, isko waste mat kar! Chal abhi ke abhi kaam pe lag ja! ⚡",
    dos: ["Phone ulta karke rakh - 25 min pure focus (Pomodoro)!", "Sabse important task pehle khatam kar!", "Ek goal likh paper pe - 42% better completion!"],
    donts: ["Abhi Instagram mat khol - productivity killer #1!", "Multitask mat kar - quality suffer hogi!", "Meeting schedule mat kar abhi - deep work time hai!"],
    quotes: [
      { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
      { text: "Done is better than perfect.", author: "Sheryl Sandberg" },
      { text: "Bhai, aaj ki productivity kal ki freedom hai!", author: "Mood Internet" },
      { text: "Focus on being productive instead of busy.", author: "Tim Ferriss" },
      { text: "Small daily improvements over time lead to stunning results.", author: "Robin Sharma" }
    ],
    content: { type: "skill", links: [{ label: "Coursera 📚", url: "https://www.coursera.org/", icon: "📚" }, { label: "freeCodeCamp 💻", url: "https://www.freecodecamp.org/", icon: "💻" }, { label: "Tech News 📰", url: "https://techcrunch.com/", icon: "📰" }] },
    facts: ["Productive flow state mein brain dopamine release karta hai! 🏄", "Bill Gates aur Elon Musk Pomodoro technique use karte hain!", "Aaj 1% better = 1 saal mein 37x better. Compound effect!"]
  },
  relaxed: {
    emoji: '😌', color: '#FDCB6E',
    title: 'Relax Mode Activated 😌',
    assistantMsg: "Wah yaar! Relax feel kar raha hai - ye feeling precious hai! Isko enjoy kar, force mat kar kuch bhi. Bas present moment mein reh. Main tere saath hoon! 🌸",
    dos: ["Ek chai/coffee bana, slow sip kar - mindful drinking!", "Koi achhi book ya podcast enjoy kar!", "Thoda stretch kar - body ko bhi relaxation mile!"],
    donts: ["Guilt mat feel kar relax karne ka - ye zaroorat hai!", "Important decision mat le abhi!", "Zyada screen time mat le - aankhon ko rest chahiye!"],
    quotes: [
      { text: "Almost everything will work again if you unplug it for a few minutes.", author: "Anne Lamott" },
      { text: "Rest when you're weary. Refresh and renew yourself.", author: "Ralph Marston" },
      { text: "Yaar, relax karna bhi kaam hai - khud ko recharge kar!", author: "Mood Internet" },
      { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
      { text: "Peace begins with a smile.", author: "Mother Teresa" }
    ],
    content: { type: "chill", links: [{ label: "Lo-fi Music 🎧", url: "https://www.youtube.com/watch?v=jfKfPfyJRdk", icon: "🎧" }, { label: "Nature Sounds 🌿", url: "https://mynoise.net/", icon: "🌿" }, { label: "Chill Reads 📖", url: "https://www.brainpickings.org/", icon: "📖" }] },
    facts: ["Relaxation actually productivity badhata hai - research proven! 🌿", "Japan mein 'Shinrin-yoku' (Forest Bathing) official health practice hai!", "10 min relaxation = 2 ghante extra energy daily!"]
  },
  confused: {
    emoji: '🤔', color: '#A29BFE',
    title: 'Confused? Welcome to the Club!',
    assistantMsg: "Haha! Nahi pata kya feel ho raha hai? Bhai ye sabse honest answer hai! Kabhi kabhi mixed feelings hoti hain - ye bhi normal hai! 🎲",
    dos: ["Bas 5 min ke liye sab chodo - clarity aayegi khud!", "Kuch random try kar - adventure ki shuruaat!", "Apne aap se pucho: pichli baar kya khush kiya?"],
    donts: ["Overthink mat kar - confusion ka solution nahi, bas flow kar!", "Dusron se opinion mat maang abhi - pehle apna suno!", "Ye mat soch ki kya karna chahiye!"],
    quotes: [
      { text: "Confusion is the welcome mat at the door of creativity.", author: "Michael J. Gelb" },
      { text: "Not all who wander are lost.", author: "J.R.R. Tolkien" },
      { text: "Bhai, confused hona matlab tu sochta hai - ye to acchi baat hai!", author: "Mood Internet" },
      { text: "The greatest step towards a life of simplicity is to learn to let go.", author: "Steve Maraboli" },
      { text: "Clarity comes from engagement, not from thinking about it.", author: "Marie Forleo" }
    ],
    content: { type: "surprise", links: [{ label: "Random Wikipedia 🌍", url: "https://en.wikipedia.org/wiki/Special:Random", icon: "🌍" }, { label: "Useless Website 😂", url: "https://theuselessweb.com/", icon: "😂" }, { label: "Random Facts 🧠", url: "https://randomfactgenerator.net/", icon: "🧠" }] },
    facts: ["Confusion creativity ka sign hai! Brain naye connections bana raha hai! 🧠", "Albert Einstein ne kaha: If you can't explain simply, keep exploring!", "Mixed feelings hona emotionally intelligent logon ki nishani hai!"]
  },
  anxious: {
    emoji: '😰', color: '#FD79A8',
    title: 'Anxious Ho? Breathe Kar!',
    assistantMsg: "Hey, main hoon yahan. Anxiety feel ho rahi hai - par tu safe hai. Chal ek kaam karte hain: 4 second inhale, 4 hold, 4 exhale. Saath mein karte hain! 💗",
    dos: ["4-7-8 breathing try kar - scientifically proven anxiety reducer!", "Apne 5 senses engage kar - 5 cheezein dekh, 4 touch kar!", "Kisi trusted person ko call kar - baat karna helps!"],
    donts: ["Caffeine mat le abhi - anxiety aur badh jaayegi!", "Worst case scenario mat soch - brain ko realistic rakho!", "Social media news mat dekh - information overload hai!"],
    quotes: [
      { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: "Dan Millman" },
      { text: "Anxiety is a thin stream of fear trickling through the mind.", author: "Arthur Somers Roche" },
      { text: "Yaar, ye feeling temporary hai. Tu is se bada hai!", author: "Mood Internet" },
      { text: "Nothing diminishes anxiety faster than action.", author: "Walter Anderson" },
      { text: "You are braver than you believe, stronger than you seem.", author: "A.A. Milne" }
    ],
    content: { type: "calming", links: [{ label: "Breathing Exercise 🧘", url: "https://www.calm.com/breathe", icon: "🧘" }, { label: "Anxiety Relief Music 🎵", url: "https://www.youtube.com/watch?v=qYnA9wWFHLI", icon: "🎵" }, { label: "Grounding Technique 🌱", url: "https://www.healthline.com/health/grounding-techniques", icon: "🌱" }] },
    facts: ["Anxiety aur excitement same physical response hai - reframe kar!", "Deep breathing vagus nerve activate karta hai - instant calm!", "Exercise anxiety ko 48% reduce karta hai - 10 min walk bhi kaam karti hai!"]
  },
  excited: {
    emoji: '🤩', color: '#FFD93D',
    title: 'Excited Ho? Channel It!',
    assistantMsg: "WOHOOO! Tera excitement dekh ke mujhe bhi khushi ho gayi! Ye energy bahut rare aur precious hoti hai bhai - isko sahi jagah lagao! 🤩",
    dos: ["Ye energy kisi creative project mein lagao - start karo abhi!", "Kisi ko share karo ye excitement - joy shared is joy doubled!", "Journal mein likh do - ye feeling yaad rakhne layak hai!"],
    donts: ["Impulsive decision mat lo - excitement mein over-commit hota hai!", "Poori raat jaag mat - excitement ke baad crash hota hai!", "Unrealistic promises mat karo khud ko!"],
    quotes: [
      { text: "Excitement is the more practical synonym for happiness.", author: "Bo Bennett" },
      { text: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
      { text: "Bhai, is excitement ko fuel bana apne sapne ka!", author: "Mood Internet" },
      { text: "The big question is whether you are going to be able to say a hearty yes to your adventure.", author: "Joseph Campbell" },
      { text: "Energy and persistence conquer all things.", author: "Benjamin Franklin" }
    ],
    content: { type: "skill", links: [{ label: "Start a Project 🚀", url: "https://www.producthunt.com/", icon: "🚀" }, { label: "Share Your Idea 💡", url: "https://www.reddit.com/r/startups/", icon: "💡" }, { label: "Learn Something New ⚡", url: "https://www.skillshare.com/", icon: "⚡" }] },
    facts: ["Excitement aur anxiety same brain pathway activate karte hain - interesting na?", "Excited log 31% more productive hote hain - use it!", "Excitement contagious hoti hai - share karo!"]
  }
};

const surpriseContent = [
  { fact: "Octopus ke 3 dil hote hain! 🐙 Seriously, 3!", url: "https://www.nationalgeographic.com/animals/invertebrates/facts/octopus" },
  { fact: "Honey kabhi kharab nahi hoti - 3000 saal purani bhi khane layak! 🍯", url: "https://en.wikipedia.org/wiki/Honey" },
  { fact: "Bananas technically radioactive hoti hain! Thodi si, par hain! 🍌", url: "https://www.sciencefocus.com/science/are-bananas-radioactive" },
  { fact: "Ek average cloud ka weight 500,000 kg hota hai! ☁️", url: "https://science.howstuffworks.com" },
  { fact: "Pandas ke 6 'fingers' hote hain bamboo pakadne ke liye! 🐼", url: "https://en.wikipedia.org/wiki/Giant_panda" },
  { fact: "Insaan ek din mein average 70,000 thoughts soochta hai! 🧠", url: "https://randomfactgenerator.net/" },
  { fact: "Crows remember human faces aur saalon baad bhi pehchaan lete hain! 🐦", url: "https://www.nationalgeographic.com" },
  { fact: "Tere phone mein NASA ke pehle space mission se zyada processing power hai! 📱", url: "https://theuselessweb.com/" }
];

// ─── Routes ───

// app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'Mood Internet API v2 chal raha hai! 🚀' }));

// app.get('/api/mood/:mood', (req, res) => {
//   const { mood } = req.params;
//   if (!moodData[mood]) return res.status(404).json({ error: 'Ye mood nahi milta bhai!' });
//   const data = moodData[mood];
//   const randomFact = data.facts[Math.floor(Math.random() * data.facts.length)];
//   const randomQuote = data.quotes[Math.floor(Math.random() * data.quotes.length)];
//   res.json({ ...data, randomFact, randomQuote, counter: moodCounters[mood] || 0 });
// });

app.get('/api/mood/:mood', (req, res) => {
  try {
    const { mood } = req.params;

    if (!moodData[mood]) {
      return res.status(404).json({ error: 'Ye mood nahi milta bhai!' });
    }

    const data = moodData[mood];

    const randomFact = data.facts?.length
      ? data.facts[Math.floor(Math.random() * data.facts.length)]
      : null;

    const randomQuote = data.quotes?.length
      ? data.quotes[Math.floor(Math.random() * data.quotes.length)]
      : null;

    res.json({
      ...data,
      randomFact,
      randomQuote,
      counter: moodCounters[mood] || 0
    });

  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

app.post('/api/mood/:mood/count', (req, res) => {
  const { mood } = req.params;
  if (moodCounters[mood] !== undefined) moodCounters[mood] += 1;
  res.json({ counter: moodCounters[mood] || 0 });
});

app.get('/api/counters', (req, res) => res.json(moodCounters));
app.get('/api/surprise', (req, res) => res.json(surpriseContent[Math.floor(Math.random() * surpriseContent.length)]));

app.get('/api/moods/list', (req, res) => {
  res.json(Object.keys(moodData).map(key => ({
    id: key, emoji: moodData[key].emoji, color: moodData[key].color,
    title: moodData[key].title, counter: moodCounters[key] || 0
  })));
});

// ─── AI Mood Chat ───
app.post('/api/ai/chat', async (req, res) => {
  const { message, mood, userName } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required!' });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    // Fallback smart responses without API
    const fallbacks = {
      bored: ["Bhai boredom se bacho - kuch naya try karo!", "Ek chhota sa project shuru karo abhi!"],
      sad: ["Yaar, ye waqt bhi guzar jayega. Tere saath hoon! 💙", "Thoda paani pi aur 5 min walk kar!"],
      productive: ["YESS! Flow mein raho, phone mat uthao!", "Pomodoro technique try karo - 25 min focus!"],
      relaxed: ["Ye moment enjoy karo - guilt mat feel karo!", "Deep breathing karo - aur relax ho!"],
      default: ["Har mood ka apna vibe hota hai - enjoy the ride!", "Tere feelings valid hain bhai!"]
    };
    const responses = fallbacks[mood] || fallbacks.default;
    return res.json({ reply: responses[Math.floor(Math.random() * responses.length)], isAI: false });
  }

  try {
    const systemPrompt = `You are "MoodBot" - a friendly, caring AI assistant for Mood Internet, a mood-based web app. 
    You speak in Hinglish (mix of Hindi and English) like a supportive dost (friend). 
    Current user mood: ${mood || 'unknown'}.
    User name: ${userName || 'Yaar'}.
    Keep responses SHORT (2-3 sentences max), warm, practical and uplifting.
    Use emojis naturally. Never be preachy. Be genuine and relatable like a real dost.`;

    const response = await axios.post('https://api.anthropic.com/v1/messages', {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system: systemPrompt,
      messages: [{ role: 'user', content: message }]
    }, { headers: { 'x-api-key': apiKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' } });

    res.json({ reply: response.data.content[0].text, isAI: true });
  } catch (error) {
    res.json({ reply: "Yaar, thodi der baad poochho - main busy hoon abhi! 😅", isAI: false });
  }
});

// ─── Weather-based Mood Suggestion ───
app.get('/api/weather-mood', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: 'Location required' });

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.json({ suggestion: 'relaxed', reason: 'Aaj ka din relaxed rehne ke liye perfect lagta hai!', weather: 'clear' });
  }

  try {
    const weatherRes = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    const weather = weatherRes.data.weather[0].main.toLowerCase();
    const temp = weatherRes.data.main.temp;

    let suggestion = 'relaxed', reason = '';
    if (weather.includes('rain') || weather.includes('drizzle')) { suggestion = 'relaxed'; reason = `Baarish ho rahi hai - cozy ho jao! ☔`; }
    else if (weather.includes('clear') && temp > 25) { suggestion = 'productive'; reason = `Dhoop nikli hai - energy high hai! ☀️`; }
    else if (weather.includes('cloud')) { suggestion = 'sad'; reason = `Badal chhaye hain - thoda introspective feel ho raha hai. ☁️`; }
    else if (temp < 15) { suggestion = 'relaxed'; reason = `Thandi hai - chai pe baitho! 🍵`; }
    else { suggestion = 'excited'; reason = `Mausam perfect hai - bahar niklo! 🌤️`; }

    res.json({ suggestion, reason, weather: weather, temp: Math.round(temp) });
  } catch (e) {
    res.json({ suggestion: 'relaxed', reason: 'Aaj ka din relaxed rehne ke liye perfect lagta hai!', weather: 'clear' });
  }
});

// app.listen(PORT, () => console.log(`🚀 Mood Internet v2 Backend port ${PORT} pe chal raha hai!`));
app.use((err, req, res, next) => {
  console.error("Global Error:", err);
  res.status(500).json({ error: "Something went wrong" });
});

module.exports = app;
