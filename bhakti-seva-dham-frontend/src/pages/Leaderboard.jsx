import React, { useState, useEffect } from "react";
import { Sparkles, Trophy, Award, Loader2 } from "lucide-react";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [devotees, setDevotees] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | 'quiz' | 'jap'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await fetch("http://localhost:5000/api/leaderboard");
        const data = await res.json();
        if (data.success && Array.isArray(data.devotees)) {
          setDevotees(data.devotees);
        }
      } catch (err) {
        console.error("Failed to load leaderboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Sort devotees dynamically based on selected filter
  const sortedDevotees = [...devotees].sort((a, b) => {
    if (filter === "quiz") {
      return (b.quizScore || 0) - (a.quizScore || 0);
    }
    if (filter === "jap") {
      const aJap = (a.completedMalas || 0) * 108;
      const bJap = (b.completedMalas || 0) * 108;
      return bJap - aJap;
    }
    // Default: Total Score (or weeklyScore if active)
    return (b.totalScore || 0) - (a.totalScore || 0);
  });

  const winner = sortedDevotees[0] || {
    name: "Devotee",
    totalScore: 0,
    quizScore: 0,
    completedMalas: 0,
  };

  const getScore = (item) => {
    if (filter === "quiz") return item.quizScore || 0;
    if (filter === "jap") return (item.completedMalas || 0) * 108;
    return item.totalScore || 0;
  };

  const runnersUp = sortedDevotees.slice(1);

  return (
    <div className="leaderboard-page">
      <div className="leaderboard-container">
        {/* Header */}
        <header className="leaderboard-header">
          <div className="leaderboard-badge">
            <Sparkles size={14} />
            <span>Saptahik Bhakti Ranking</span>
          </div>
          <h1>Top Devotees Leaderboard</h1>
          <p>
            Daily Quiz aur Nitya Naam Jap sadhana ke adhar par sabhi bhakton ki
            soochi
          </p>

          {/* Filter Pills */}
          <div className="leaderboard-filter-tabs">
            <button
              type="button"
              className={`filter-tab ${filter === "all" ? "active" : ""}`}
              onClick={() => setFilter("all")}
            >
              Combined Score
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "quiz" ? "active" : ""}`}
              onClick={() => setFilter("quiz")}
            >
              Daily Quiz
            </button>
            <button
              type="button"
              className={`filter-tab ${filter === "jap" ? "active" : ""}`}
              onClick={() => setFilter("jap")}
            >
              📿 Naam Jap
            </button>
          </div>
        </header>

        {loading ? (
          <div
            style={{ textAlign: "center", padding: "48px 0", color: "#d4af37" }}
          >
            <Loader2
              className="animate-spin"
              size={32}
              style={{ margin: "0 auto 12px" }}
            />
            <p style={{ fontSize: "0.95rem", opacity: 0.85 }}>
              Prasadam prapt ho raha hai...
            </p>
          </div>
        ) : sortedDevotees.length === 0 ? (
          <div
            style={{ textAlign: "center", padding: "40px 0", color: "#8c5825" }}
          >
            <p>Abhi tak koi devotee points darj nahi huye hain.</p>
          </div>
        ) : (
          <>
            {/* 1st Place Podium Plaque */}
            <div className="podium-first-card">
              <div className="podium-first-left">
                <div className="trophy-badge">
                  <Trophy size={26} />
                </div>
                <div className="podium-meta">
                  <span className="podium-rank-tag">🏆 1st Rank Devotee</span>
                  <div className="podium-first-name">{winner.name}</div>
                </div>
              </div>
              <div className="podium-first-points">
                <strong>{getScore(winner)}</strong> <span>Pts</span>
              </div>
            </div>

            {/* Remaining Ranks List */}
            <div className="rankings-grid">
              {runnersUp.map((devoteeItem, index) => (
                <article
                  key={devoteeItem._id || index}
                  className="ranking-plaque"
                >
                  <div className="ranking-row">
                    <div className="ranking-row-left">
                      <span className="rank-number-badge">#{index + 2}</span>
                      <span className="ranking-name">{devoteeItem.name}</span>
                    </div>
                    <span className="ranking-points">
                      <strong>{getScore(devoteeItem)}</strong> Pts
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}

        {/* Footer Note */}
        <div className="scroll-footer-decor">
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>
      </div>
    </div>
  );
}
