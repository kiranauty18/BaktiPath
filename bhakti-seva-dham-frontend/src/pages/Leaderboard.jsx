import React, { useState, useEffect } from "react";
import { Sparkles, Trophy, Award, Flame, User } from "lucide-react";
import "./Leaderboard.css";

export default function Leaderboard() {
  const [topDevotees, setTopDevotees] = useState([]);
  const [filter, setFilter] = useState("all"); // 'all' | 'quiz' | 'jap'

  useEffect(() => {
    const quizData = JSON.parse(
      localStorage.getItem("quiz_leaderboard") || "[]",
    );
    const japData = JSON.parse(localStorage.getItem("jap_leaderboard") || "[]");

    const devoteesMap = {};

    quizData.forEach((item) => {
      if (item && item.name) {
        const key = item.name.trim().toLowerCase();
        if (!devoteesMap[key]) {
          devoteesMap[key] = {
            name: item.name.trim(),
            totalScore: 0,
            quizScore: 0,
            japScore: 0,
          };
        }
        const pts = Number(item.score) || 0;
        devoteesMap[key].quizScore += pts;
        devoteesMap[key].totalScore += pts;
      }
    });

    japData.forEach((item) => {
      if (item && item.name) {
        const key = item.name.trim().toLowerCase();
        if (!devoteesMap[key]) {
          devoteesMap[key] = {
            name: item.name.trim(),
            totalScore: 0,
            quizScore: 0,
            japScore: 0,
          };
        }
        const pts = Number(item.score) || 0;
        devoteesMap[key].japScore += pts;
        devoteesMap[key].totalScore += pts;
      }
    });

    let combinedList = Object.values(devoteesMap);

    // Clean mock data if user has no entries yet
    if (combinedList.length === 0) {
      combinedList = [
        { name: "Kiran Auti", totalScore: 230, quizScore: 50, japScore: 180 },
        {
          name: "Anjali Sharma",
          totalScore: 190,
          quizScore: 40,
          japScore: 150,
        },
        {
          name: "Radha Raman Das",
          totalScore: 160,
          quizScore: 50,
          japScore: 110,
        },
        { name: "Seema Verma", totalScore: 140, quizScore: 30, japScore: 110 },
        { name: "Gopal Krishna", totalScore: 110, quizScore: 0, japScore: 110 },
      ];
    }

    setTopDevotees(combinedList);
  }, []);

  const getFilteredList = () => {
    let list = [...topDevotees];
    if (filter === "quiz") {
      list.sort((a, b) => b.quizScore - a.quizScore);
    } else if (filter === "jap") {
      list.sort((a, b) => b.japScore - a.japScore);
    } else {
      list.sort((a, b) => b.totalScore - a.totalScore);
    }
    return list;
  };

  const sortedList = getFilteredList();
  const winner = sortedList[0] || {
    name: "Devotee",
    totalScore: 0,
    quizScore: 0,
    japScore: 0,
  };
  const getWinnerScore = () => {
    if (filter === "quiz") return winner.quizScore;
    if (filter === "jap") return winner.japScore;
    return winner.totalScore;
  };

  const runnersUp = sortedList.slice(1);

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
            <strong>{getWinnerScore()}</strong> <span>Pts</span>
          </div>
        </div>

        {/* Remaining Ranks List */}
        <div className="rankings-grid">
          {runnersUp.map((devotee, index) => {
            const displayScore =
              filter === "quiz"
                ? devotee.quizScore
                : filter === "jap"
                  ? devotee.japScore
                  : devotee.totalScore;

            return (
              <article key={index} className="ranking-plaque">
                <div className="ranking-row">
                  <div className="ranking-row-left">
                    <span className="rank-number-badge">#{index + 2}</span>
                    <span className="ranking-name">{devotee.name}</span>
                  </div>
                  <span className="ranking-points">
                    <strong>{displayScore}</strong> Pts
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="scroll-footer-decor">
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>
      </div>
    </div>
  );
}
