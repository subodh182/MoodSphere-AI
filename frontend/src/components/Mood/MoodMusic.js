import React, { useState, useEffect, useRef } from 'react';
import './MoodMusic.css';

// ─── Mood ke hisaab se YouTube songs ───
const MOOD_PLAYLISTS = {
  bored: [
    { id: 'ZbZSe6N_BXs', title: 'Happy - Pharrell Williams', artist: 'Pharrell Williams' },
    { id: 'ru0K8uYEZWw', title: "Can't Stop the Feeling", artist: 'Justin Timberlake' },
    { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars' },
    { id: 'y6Sxv-sUYtM', title: 'Shape of You', artist: 'Ed Sheeran' },
    { id: 'hT_nvWreIhg', title: 'Counting Stars', artist: 'OneRepublic' },
    { id: 'nfWlot6h_JM', title: 'Shake It Off', artist: 'Taylor Swift' },
  ],
  sad: [
    { id: '1ZYbU82GVz4', title: 'Weightless', artist: 'Marconi Union' },
    { id: 'lFcSrYw6AR4', title: 'Someone Like You', artist: 'Adele' },
    { id: '4N3N1MlvVc4', title: 'Fix You', artist: 'Coldplay' },
    { id: 'gCYcHz2k5x0', title: 'The Night We Met', artist: 'Lord Huron' },
    { id: 'hLQl3WQQoQ0', title: 'Skinny Love', artist: 'Bon Iver' },
    { id: 'RBumgq5yVrA', title: 'Let Her Go', artist: 'Passenger' },
  ],
  productive: [
    { id: 'jfKfPfyJRdk', title: 'Lofi Hip Hop Radio', artist: 'ChilledCow' },
    { id: 'fEvM-OUbaKs', title: 'Study Music - Focus', artist: 'Study Music' },
    { id: 'n61ULEU7CO0', title: 'Interstellar Theme', artist: 'Hans Zimmer' },
    { id: '2gliGzb2_1I', title: 'Time - Inception', artist: 'Hans Zimmer' },
    { id: 'aLqc8TdoLvk', title: 'Deep Focus Music', artist: 'Focus Music' },
    { id: '77ZozI0rw7w', title: 'Beethoven for Studying', artist: 'Classical' },
  ],
  relaxed: [
    { id: 'qYnA9wWFHLI', title: 'Calm Piano Music', artist: 'Relaxing Piano' },
    { id: 'hlWiI4xVXKY', title: 'Ocean Waves & Piano', artist: 'Nature Sounds' },
    { id: 'lCOF9LN_Zxs', title: 'Acoustic Chill', artist: 'Acoustic Mood' },
    { id: 'UfcAVejslrU', title: 'Coffee Shop Ambience', artist: 'Cafe Music' },
    { id: 'sjkrrmBnpGE', title: 'Guitar Relax', artist: 'Relaxing Guitar' },
    { id: '4vIiKo0bBZk', title: 'Gentle Piano', artist: 'Piano Relaxing' },
  ],
  confused: [
    { id: 'ZbZSe6N_BXs', title: 'Happy Vibes', artist: 'Pharrell Williams' },
    { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Bruno Mars' },
    { id: 'hT_nvWreIhg', title: 'Counting Stars', artist: 'OneRepublic' },
    { id: 'ru0K8uYEZWw', title: "Can't Stop the Feeling", artist: 'JT' },
    { id: 'y6Sxv-sUYtM', title: 'Shape of You', artist: 'Ed Sheeran' },
    { id: 'nfWlot6h_JM', title: 'Shake It Off', artist: 'Taylor Swift' },
  ],
  anxious: [
    { id: '1ZYbU82GVz4', title: 'Weightless - Most Relaxing', artist: 'Marconi Union' },
    { id: 'qYnA9wWFHLI', title: 'Anxiety Relief Music', artist: 'Calm Music' },
    { id: 'hlWiI4xVXKY', title: 'Ocean Sounds Calm', artist: 'Nature' },
    { id: 'sjkrrmBnpGE', title: 'Soft Guitar - Stress Relief', artist: 'Guitar' },
    { id: 'UfcAVejslrU', title: 'Peaceful Cafe Music', artist: 'Ambient' },
    { id: '4vIiKo0bBZk', title: 'Healing Piano', artist: 'Piano' },
  ],
  excited: [
    { id: 'OPf0YbXqDm0', title: 'Uptown Funk', artist: 'Mark Ronson' },
    { id: 'ru0K8uYEZWw', title: "Can't Stop the Feeling", artist: 'Justin Timberlake' },
    { id: 'ZbZSe6N_BXs', title: 'Happy', artist: 'Pharrell Williams' },
    { id: 'nfWlot6h_JM', title: 'Shake It Off', artist: 'Taylor Swift' },
    { id: 'y6Sxv-sUYtM', title: 'Shape of You', artist: 'Ed Sheeran' },
    { id: 'hT_nvWreIhg', title: 'Counting Stars', artist: 'OneRepublic' },
  ],
};

let ytAPILoaded = false;
let ytAPILoading = false;

const loadYouTubeAPI = () => new Promise((resolve) => {
  if (ytAPILoaded && window.YT) { resolve(); return; }
  if (ytAPILoading) {
    const check = setInterval(() => {
      if (window.YT && window.YT.Player) { clearInterval(check); resolve(); }
    }, 200);
    return;
  }
  ytAPILoading = true;
  window.onYouTubeIframeAPIReady = () => { ytAPILoaded = true; resolve(); };
  const tag = document.createElement('script');
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
});

export default function MoodMusic({ mood }) {
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [volume, setVolume] = useState(50);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const playerRef = useRef(null);
  const progressRef = useRef(null);
  const containerIdRef = useRef(`yt-player-${Math.random().toString(36).substr(2, 9)}`);

  const playlist = MOOD_PLAYLISTS[mood] || MOOD_PLAYLISTS.relaxed;

  // Mood change hone pe random song pick karo
  useEffect(() => {
    const random = playlist[Math.floor(Math.random() * playlist.length)];
    setCurrentSong(random);
    setPlaying(false);
    setProgress(0);
    if (playerRef.current) {
      try { playerRef.current.destroy(); } catch {}
      playerRef.current = null;
      setPlayerReady(false);
    }
  }, [mood]);

  // Progress bar updater
  useEffect(() => {
    if (!playing) return;
    progressRef.current = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        const cur = playerRef.current.getCurrentTime() || 0;
        const dur = playerRef.current.getDuration() || 0;
        setProgress(dur ? (cur / dur) * 100 : 0);
        setDuration(dur);
      }
    }, 1000);
    return () => clearInterval(progressRef.current);
  }, [playing]);

  const initPlayer = async (videoId) => {
    setLoading(true);
    await loadYouTubeAPI();
    await new Promise(r => setTimeout(r, 300));

    if (playerRef.current) {
      try { playerRef.current.loadVideoById(videoId); }
      catch { playerRef.current = null; }
    }

    if (!playerRef.current) {
      try {
        playerRef.current = new window.YT.Player(containerIdRef.current, {
          height: '0', width: '0',
          videoId,
          playerVars: {
            autoplay: 1, controls: 0, disablekb: 1,
            fs: 0, iv_load_policy: 3, modestbranding: 1, rel: 0
          },
          events: {
            onReady: (e) => {
              e.target.setVolume(volume);
              e.target.playVideo();
              setPlayerReady(true);
              setLoading(false);
              setPlaying(true);
            },
            onStateChange: (e) => {
              if (e.data === window.YT.PlayerState.ENDED) playNext();
              if (e.data === window.YT.PlayerState.PLAYING) setPlaying(true);
              if (e.data === window.YT.PlayerState.PAUSED) setPlaying(false);
            },
            onError: () => { setLoading(false); setPlaying(false); }
          }
        });
      } catch { setLoading(false); }
    }
  };

  const handlePlayPause = async () => {
    if (!playerReady || !playerRef.current) {
      if (currentSong) await initPlayer(currentSong.id);
      return;
    }
    try {
      if (playing) { playerRef.current.pauseVideo(); setPlaying(false); }
      else { playerRef.current.playVideo(); setPlaying(true); }
    } catch {}
  };

  const playNext = () => {
    const idx = playlist.findIndex(s => s.id === currentSong?.id);
    const next = playlist[(idx + 1) % playlist.length];
    setCurrentSong(next);
    setProgress(0);
    if (playerRef.current) {
      try { playerRef.current.loadVideoById(next.id); setPlaying(true); }
      catch { initPlayer(next.id); }
    }
  };

  const playPrev = () => {
    const idx = playlist.findIndex(s => s.id === currentSong?.id);
    const prev = playlist[(idx - 1 + playlist.length) % playlist.length];
    setCurrentSong(prev);
    setProgress(0);
    if (playerRef.current) {
      try { playerRef.current.loadVideoById(prev.id); setPlaying(true); }
      catch { initPlayer(prev.id); }
    }
  };

  const playSpecific = (song) => {
    setCurrentSong(song);
    setProgress(0);
    if (playerRef.current) {
      try { playerRef.current.loadVideoById(song.id); setPlaying(true); }
      catch { initPlayer(song.id); }
    } else {
      initPlayer(song.id);
    }
  };

  const handleVolume = (v) => {
    setVolume(v);
    if (playerRef.current?.setVolume) playerRef.current.setVolume(v);
  };

  const handleSeek = (e) => {
    const pct = parseFloat(e.target.value);
    setProgress(pct);
    if (playerRef.current?.getDuration) {
      const dur = playerRef.current.getDuration();
      playerRef.current.seekTo((pct / 100) * dur, true);
    }
  };

  const moodColors = {
    bored: '#FF6B6B', sad: '#74B9FF', productive: '#00B894',
    relaxed: '#FDCB6E', confused: '#A29BFE', anxious: '#FD79A8', excited: '#FFD93D'
  };
  const accentColor = moodColors[mood] || '#6c63ff';

  const fmtTime = (sec) => {
    if (!sec) return '0:00';
    const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`mood-music glass-card ${expanded ? 'expanded' : ''}`} style={{ '--accent': accentColor }}>
      {/* Hidden YouTube player div */}
      <div
        id={containerIdRef.current}
        style={{ display: 'none', position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      />

      {/* Main player row */}
      <div className="music-main-row">
        {/* Song info */}
        <div className="music-info">
          <div className="music-disc" style={{ animationPlayState: playing ? 'running' : 'paused' }}>
            🎵
          </div>
          <div className="music-meta">
            <div className="music-title">{currentSong?.title || 'Song select karo'}</div>
            <div className="music-artist">{currentSong?.artist || mood + ' mood playlist'}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="music-controls">
          <button className="music-btn" onClick={playPrev} title="Previous">⏮</button>
          <button
            className={`music-btn play-btn ${loading ? 'loading' : ''}`}
            onClick={handlePlayPause}
            style={{ background: accentColor }}
          >
            {loading ? '⏳' : playing ? '⏸' : '▶'}
          </button>
          <button className="music-btn" onClick={playNext} title="Next">⏭</button>
        </div>

        {/* Volume + expand */}
        <div className="music-right">
          <div className="volume-wrap">
            <span className="vol-icon">{volume === 0 ? '🔇' : volume < 50 ? '🔉' : '🔊'}</span>
            <input
              type="range" min="0" max="100" value={volume}
              onChange={e => handleVolume(Number(e.target.value))}
              className="music-slider vol-slider"
              style={{ '--fill': accentColor }}
            />
          </div>
          <button className="music-btn expand-btn" onClick={() => setExpanded(e => !e)}>
            {expanded ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="music-progress-row">
        <span className="prog-time">{fmtTime((progress / 100) * duration)}</span>
        <input
          type="range" min="0" max="100" step="0.5" value={progress}
          onChange={handleSeek}
          className="music-slider prog-slider"
          style={{ '--fill': accentColor }}
        />
        <span className="prog-time">{fmtTime(duration)}</span>
      </div>

      {/* Expanded playlist */}
      {expanded && (
        <div className="music-playlist">
          <div className="playlist-header">🎶 {mood.charAt(0).toUpperCase() + mood.slice(1)} Playlist</div>
          {playlist.map((song, i) => (
            <button
              key={song.id}
              className={`playlist-item ${currentSong?.id === song.id ? 'active' : ''}`}
              onClick={() => playSpecific(song)}
              style={currentSong?.id === song.id ? { borderLeftColor: accentColor } : {}}
            >
              <span className="pl-num">
                {currentSong?.id === song.id && playing ? '▶' : i + 1}
              </span>
              <div className="pl-info">
                <span className="pl-title">{song.title}</span>
                <span className="pl-artist">{song.artist}</span>
              </div>
              {currentSong?.id === song.id && playing && (
                <div className="pl-equalizer">
                  <span style={{ '--d': '0s' }} />
                  <span style={{ '--d': '0.2s' }} />
                  <span style={{ '--d': '0.4s' }} />
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}