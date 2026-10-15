import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  RotateCcw,
  Volume2,
  VolumeX,
  Award,
  User,
  Undo2,
  Heart,
} from "lucide-react";
import "./NaamJap.css";

export default function NaamJap() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("bhakti_devotee_name") || "";
  });
  const [beadCount, setBeadCount] = useState(0); // 0 to 108
  const [completedMalas, setCompletedMalas] = useState(0);
  const [lifetimeJap, setLifetimeJap] = useState(() => {
    return Number(localStorage.getItem("jap_lifetime_count")) || 0;
  });
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [targetMala, setTargetMala] = useState(1);
  const [isPressing, setIsPressing] = useState(false);
  const audioCtxRef = useRef(null);

  // Sync devotee points to leaderboard whenever a mala completes
  useEffect(() => {
    if (!userName.trim()) return;

    localStorage.setItem("bhakti_devotee_name", userName.trim());
    localStorage.setItem("jap_lifetime_count", lifetimeJap);

    // Each completed Mala awards 10 Points
    const earnedPoints = completedMalas * 10;
    const existingLeaderboard = JSON.parse(
      localStorage.getItem("jap_leaderboard") || "[]",
    );
    const userIndex = existingLeaderboard.findIndex(
      (item) =>
        item.name && item.name.toLowerCase() === userName.trim().toLowerCase(),
    );

    if (userIndex !== -1) {
      existingLeaderboard[userIndex].score = earnedPoints;
    } else if (earnedPoints > 0) {
      existingLeaderboard.push({ name: userName.trim(), score: earnedPoints });
    }

    existingLeaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem(
      "jap_leaderboard",
      JSON.stringify(existingLeaderboard),
    );
  }, [completedMalas, lifetimeJap, userName]);

  // Pure Web Audio tone generation
  const playChantTone = (isCompletion = false) => {
    if (!audioEnabled) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (
          window.AudioContext || window.webkitAudioContext
        )();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (isCompletion) {
        // High harmonic temple bell chime on 108th bead
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
      } else {
        // Soft wooden bead click tone
        osc.type = "triangle";
        osc.frequency.setValueAtTime(261.63, ctx.currentTime); // C4
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.09);
      }
    } catch {
      // Audio autoplay policy fallback
    }
  };

  const handleBeadClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 140);

    const nextBead = beadCount + 1;
    setLifetimeJap((prev) => prev + 1);

    if (nextBead >= 108) {
      setBeadCount(0);
      setCompletedMalas((prev) => prev + 1);
      playChantTone(true);
    } else {
      setBeadCount(nextBead);
      playChantTone(false);
    }
  };

  const handleUndo = () => {
    if (beadCount > 0) {
      setBeadCount((prev) => prev - 1);
      setLifetimeJap((prev) => Math.max(0, prev - 1));
    } else if (completedMalas > 0) {
      setCompletedMalas((prev) => prev - 1);
      setBeadCount(107);
      setLifetimeJap((prev) => Math.max(0, prev - 1));
    }
  };

  const handleResetSession = () => {
    if (
      window.confirm(
        "Kya aap vartaman session counter reset karna chahte hain?",
      )
    ) {
      setBeadCount(0);
      setCompletedMalas(0);
    }
  };

  // SVG Progress calculation (Radius = 110, circumference = 2 * PI * 110 ≈ 691.15)
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (beadCount / 108) * circumference;

  return (
    <div className="jap-page">
      <div className="jap-container">
        {/* Header */}
        <header className="jap-header">
          <span className="jap-badge">
            <Sparkles size={13} /> NITYA NAAM JAP SADHANA
          </span>
          <h1>Shri Radha Rani &amp; Krishn Jap</h1>
          <p>
            "Radhe Radhe" smaran karein. Har mala par 10 points leaderboard par
            jodein.
          </p>
        </header>

        {/* Main Jap Plaque */}
        <div className="jap-card">
          {/* Devotee Strip */}
          <div className="jap-devotee-strip">
            <div className="jap-devotee-field">
              <User size={16} />
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Devotee Name darj karein..."
              />
            </div>

            <div className="jap-quick-actions">
              <button
                type="button"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`jap-icon-btn ${audioEnabled ? "active" : ""}`}
                title={audioEnabled ? "Sound On" : "Muted"}
              >
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>

              <button
                type="button"
                onClick={handleResetSession}
                className="jap-icon-btn reset-btn"
                title="Reset Session"
              >
                <RotateCcw size={15} />
              </button>
            </div>
          </div>

          {/* Mala Target Selectors */}
          <div className="jap-target-row">
            <span className="jap-target-label">Lakshya:</span>
            {[1, 11, 16, 21].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setTargetMala(m)}
                className={`jap-target-chip ${targetMala === m ? "active" : ""}`}
              >
                {m} {m === 1 ? "Mala" : "Malas"}
              </button>
            ))}
          </div>

          {/* Central Interactive Mala Bead Ring */}
          <div className="jap-dial-area">
            <div
              className="jap-ring-wrapper"
              onClick={handleBeadClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleBeadClick(e);
                }
              }}
            >
              <svg className="jap-svg-ring" viewBox="0 0 250 250">
                <circle className="jap-ring-bg" cx="125" cy="125" r={radius} />
                <circle
                  className="jap-ring-progress"
                  cx="125"
                  cy="125"
                  r={radius}
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: strokeDashoffset,
                  }}
                />
              </svg>

              {/* Central Tap Disc */}
              <button
                type="button"
                onClick={handleBeadClick}
                className={`jap-central-disc ${isPressing ? "pressed" : ""}`}
                aria-label="Chant Bead"
              >
                <div className="disc-inner-content">
                  <Heart size={20} className="disc-lotus-icon" />
                  <span className="disc-mantra-title">श्री राधा</span>
                  <strong className="disc-live-count">{beadCount}</strong>
                  <span className="disc-out-of">of 108 Beads</span>
                </div>
              </button>
            </div>
          </div>

          {/* Live Progress Metrics Bar */}
          <div className="jap-metrics-bar">
            <div className="jap-metric-item">
              <span className="metric-title">Completed Malas</span>
              <strong className="metric-val highlight">
                {completedMalas} <small>/ {targetMala}</small>
              </strong>
            </div>

            <div className="jap-metric-divider" />

            <div className="jap-metric-item">
              <span className="metric-title">Points Earned</span>
              <strong className="metric-val">
                {completedMalas * 10} <small>Pts</small>
              </strong>
            </div>

            <div className="jap-metric-divider" />

            <div className="jap-metric-item">
              <span className="metric-title">Lifetime Jap</span>
              <strong className="metric-val">{lifetimeJap}</strong>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="jap-actions-footer">
            <button
              type="button"
              onClick={handleUndo}
              disabled={beadCount === 0 && completedMalas === 0}
              className="jap-footer-btn undo-btn"
            >
              <Undo2 size={16} />
              <span>Undo Last</span>
            </button>

            <Link to="/leaderboard" className="jap-footer-btn lb-btn">
              <Award size={16} />
              <span>View Leaderboard</span>
            </Link>
          </div>
        </div>

        {/* Devotional Decor Note */}
        <div className="jap-footer-decor">
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>
      </div>
    </div>
  );
}
