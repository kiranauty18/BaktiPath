
import React, { useState, useEffect } from 'react';
import { Heart, RotateCcw, Volume2, VolumeX, Sparkles, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './NaamJap.css';

export default function NaamJap() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('bhakti_jap_username') || '';
  });

  const [count, setCount] = useState(() => {
    const saved = localStorage.getItem('bhakti_jap_count');
    return saved ? parseInt(saved, 10) : 0;
  });
  
  const [totalLifetime, setTotalLifetime] = useState(() => {
    const saved = localStorage.getItem('bhakti_total_lifetime');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [lastAction, setLastAction] = useState(null);

  const currentMalaBeads = count % 108;
  const completedMalas = Math.floor(count / 108);
  const progressPercentage = (currentMalaBeads / 108) * 100;

  // Progressive rule: Har 11 malas ke set par 110 points add honge
  const multiplier = Math.floor(completedMalas / 11);
  const calculatedPoints = multiplier * 110;

  useEffect(() => {
    localStorage.setItem('bhakti_jap_count', count.toString());
    localStorage.setItem('bhakti_total_lifetime', totalLifetime.toString());
    localStorage.setItem('bhakti_jap_username', userName);

    if (userName.trim() && calculatedPoints > 0) {
      const existingLeaderboard = JSON.parse(localStorage.getItem('jap_leaderboard') || '[]');
      
      const userIndex = existingLeaderboard.findIndex(item => item.name.toLowerCase() === userName.toLowerCase());
      if (userIndex !== -1) {
        existingLeaderboard[userIndex].score = calculatedPoints;
      } else {
        existingLeaderboard.push({ name: userName, score: calculatedPoints });
      }

      existingLeaderboard.sort((a, b) => b.score - a.score);
      localStorage.setItem('jap_leaderboard', JSON.stringify(existingLeaderboard));
    }
  }, [count, totalLifetime, userName, calculatedPoints]);

  const handleJap = () => {
    if (!userName.trim()) {
      alert("Kripya Jap karne se pehle apna Naam (Devotee Name) darj karein!");
      return;
    }
    setLastAction(count);
    setCount(prev => prev + 1);
    setTotalLifetime(prev => prev + 1);
  };

  const handleUndo = () => {
    if (lastAction !== null) {
      setCount(lastAction);
      setTotalLifetime(prev => Math.max(0, prev - 1));
      setLastAction(null);
    }
  };

  const handleResetConfirm = () => {
    setCount(0);
    setLastAction(null);
    setShowResetConfirm(false);
  };

  return (
    <div className="jap-page">
      
      <div className="jap-header">
        <div className="jap-badge">
          <Sparkles size={14} />
          <span>Nitya Naam Jap Sadhana</span>
        </div>
        <h1>Shri Radha Rani &amp; Krishn Jap</h1>
        <p>"Radhe Radhe" smaran. (11 Malas = 110 Pts, 22 Malas = 220 Pts, etc.)</p>
      </div>

      <div className="jap-container">
        
        {/* Name Input */}
        <div className="jap-input-group">
          <label>
            <User size={14} />
            <span>Aapka Naam (Devotee Name) *</span>
          </label>
          <input 
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Apna poora naam likhein..."
          />
        </div>

        {/* Audio & Reset Bar */}
        <div className="jap-controls-bar">
          <button 
            onClick={() => setIsAudioPlaying(!isAudioPlaying)}
            className="jap-control-btn"
          >
            {isAudioPlaying ? <Volume2 size={15} style={{ color: '#C6A15B' }} /> : <VolumeX size={15} />}
            <span>{isAudioPlaying ? "Audio Enabled" : "Audio Muted"}</span>
          </button>

          <button 
            onClick={() => setShowResetConfirm(true)}
            className="jap-control-btn reset"
          >
            <RotateCcw size={14} />
            <span>Reset Counter</span>
          </button>
        </div>

        {/* Mala Progress */}
        <div className="jap-progress-box">
          <div className="jap-progress-info">
            <span>Mala Beads: {currentMalaBeads} / 108</span>
            <span>Completed Malas: {completedMalas}</span>
          </div>
          <div className="jap-progress-bar-bg">
            <div 
              className="jap-progress-bar-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Counter Display */}
        <div className="jap-counter-display">
          <span className="jap-counter-label">Total Jap in Current Session</span>
          <div className="jap-counter-number">
            {count}
          </div>
          <p className="jap-points-text">
             Points: <strong>{calculatedPoints} Pts</strong> ({completedMalas} Malas)
          </p>
        </div>

        {/* Tap Button */}
        <div className="jap-tap-wrapper">
          <motion.button
            whileTap={{ scale: 0.92 }}
            whileHover={{ scale: 1.03 }}
            onClick={handleJap}
            className="jap-tap-button"
          >
            <Heart size={24} className="fill-white/20 animate-pulse" />
            <span>श्री राधा</span>
            <span className="jap-tap-subtext">Tap to Count</span>
          </motion.button>
        </div>

        {/* Action Buttons */}
        <div className="jap-action-buttons">
          <button
            onClick={handleUndo}
            disabled={lastAction === null}
            className="jap-action-btn"
          >
            Undo Last
          </button>
          <a
            href="/leaderboard"
            className="jap-action-btn primary"
          >
            View Leaderboard →
          </a>
        </div>

        {/* Stats Footer */}
        <div className="jap-stats-grid">
          <div className="jap-stat-card">
            <span className="jap-stat-label">Completed Malas</span>
            <span className="jap-stat-value">{completedMalas}</span>
          </div>
          <div className="jap-stat-card">
            <span className="jap-stat-label">Lifetime Jap</span>
            <span className="jap-stat-value">{totalLifetime}</span>
          </div>
        </div>

      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 50 }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: '#FFFFFF', maxWidth: '360px', width: '100%', padding: '24px', borderRadius: '18px', border: '2px solid #C6A15B', textAlign: 'center' }}
            >
              <h3 style={{ color: '#641E2B', fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Counter Reset Karein?</h3>
              <p style={{ color: '#7A655C', fontSize: '13px', marginBottom: '20px' }}>
                Kya aap apne current session ka counter zero (0) karna chahte hain?
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setShowResetConfirm(false)}
                  style={{ flex: 1, padding: '10px', background: '#F5F5F5', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetConfirm}
                  style={{ flex: 1, padding: '10px', background: '#DC3545', color: '#FFF', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                  Confirm Reset
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}