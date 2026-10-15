import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { adminAPI } from "../api/api";
import {
  ShieldAlert,
  Users,
  Award,
  Heart,
  PlusCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const { devotee } = useAuth();
  const [stats, setStats] = useState(null);
  const [devotees, setDevotees] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "questions"

  // Target Date State (Defaults to Today in YYYY-MM-DD)
  const todayString = new Date().toISOString().split("T")[0];
  const [scheduledDate, setScheduledDate] = useState(todayString);

  // Question Form State
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const statsRes = await adminAPI.getStats();
        if (statsRes.success) setStats(statsRes.stats);

        const devoteesRes = await adminAPI.getDevotees();
        if (devoteesRes.success) setDevotees(devoteesRes.devotees);
      } catch (err) {
        console.error("Admin data fetch error:", err);
      }
    };
    loadAdminData();
  }, []);

  const handleOptionChange = (idx, val) => {
    const updated = [...options];
    updated[idx] = val;
    setOptions(updated);
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await adminAPI.addQuestion({
        question: questionText,
        options,
        correctIndex: Number(correctIndex),
        scheduledDate, // Sends the selected calendar date
      });

      if (res.success) {
        setStatusMsg(
          `✅ Prashna safalta-purvak ${scheduledDate} ke liye schedule ho gaya!`,
        );
        setQuestionText("");
        setOptions(["", "", "", ""]);
        setCorrectIndex(0);
      } else {
        setStatusMsg(`❌ Error: ${res.message}`);
      }
    } catch {
      setStatusMsg("❌ Prashna schedule karne me samasya aayi.");
    }
  };

  if (devotee?.role !== "admin") {
    return (
      <div className="admin-access-denied">
        <ShieldAlert size={48} color="#b91c1c" />
        <h2>Access Restricted</h2>
        <p>
          Yeh section keval mandir prabandhak (Admin) ke liye surakshit hai.
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-container">
        {/* Header */}
        <header className="admin-header">
          <div className="admin-badge">
            <Sparkles size={14} /> DHAM PRABHANDHAK (ADMIN)
          </div>
          <h1>Mandir Seva Control Center</h1>
          <p>
            Naye prashna jodein, devotees ki sadhana aur seva metrics ko monitor
            karein.
          </p>

          <div className="admin-tabs">
            <button
              type="button"
              className={activeTab === "overview" ? "active" : ""}
              onClick={() => setActiveTab("overview")}
            >
              Overview &amp; Devotee Stats
            </button>
            <button
              type="button"
              className={activeTab === "questions" ? "active" : ""}
              onClick={() => setActiveTab("questions")}
            >
              Add Quiz Questions
            </button>
          </div>
        </header>

        {activeTab === "overview" ? (
          <>
            {/* Quick Metrics */}
            <div className="admin-metrics-grid">
              <div className="admin-stat-card">
                <Users size={20} className="icon-gold" />
                <span>Total Devotees</span>
                <strong>{stats?.totalDevotees || 0}</strong>
              </div>
              <div className="admin-stat-card">
                <span className="text-xl">📿</span>
                <span>Total Malas Completed</span>
                <strong>{stats?.totalMalas || 0}</strong>
              </div>
              <div className="admin-stat-card">
                <Award size={20} className="icon-purple" />
                <span>Quiz Questions Active</span>
                <strong>{stats?.questionsCount || 0}</strong>
              </div>
              <div className="admin-stat-card">
                <Heart size={20} className="icon-green" />
                <span>Total Seva Pledges</span>
                <strong>₹{stats?.totalSevaPledged || 0}</strong>
              </div>
            </div>

            {/* Devotee Leaderboard Monitor */}
            <div className="admin-table-card">
              <h2>Devotee Activity &amp; Sadhana Log</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Devotee Name</th>
                    <th>Email</th>
                    <th>Malas</th>
                    <th>Lifetime Beads</th>
                    <th>Quiz Pts</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {devotees.map((d) => (
                    <tr key={d._id}>
                      <td className="font-bold">{d.name}</td>
                      <td>{d.email}</td>
                      <td>{d.completedMalas || 0}</td>
                      <td>{d.lifetimeJap || 0}</td>
                      <td>{d.quizScore || 0}</td>
                      <td>
                        <span className={`role-tag ${d.role}`}>{d.role}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          /* Add Question Form */
          <div className="admin-card form-card">
            <h2>
              <PlusCircle size={20} /> Naya Quiz Prashna Jodein
            </h2>
            {statusMsg && <p className="status-banner">{statusMsg}</p>}

            <form onSubmit={handleAddQuestion}>
              {/* Date Picker Input */}
              <div className="form-group" style={{ marginBottom: "18px" }}>
                <label
                  style={{
                    fontWeight: 700,
                    color: "#4a0e17",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <Calendar size={16} color="#d4af37" />
                  Target Quiz Date (Kiski Date ke liye Prashna Schedule karna
                  hai?)
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  required
                  style={{
                    padding: "10px 14px",
                    borderRadius: "8px",
                    border: "1.5px solid #d4af37",
                    background: "#fffdf9",
                    fontWeight: "600",
                    color: "#4a0e17",
                    maxWidth: "240px",
                  }}
                />
                <small style={{ color: "#8c5825", marginTop: "4px" }}>
                  Chuni hui tareekh (Date) ko hi yeh prashna devotees ke samne
                  aayega.
                </small>
              </div>

              <div className="form-group">
                <label>Prashna (Question Text)</label>
                <input
                  type="text"
                  value={questionText}
                  onChange={(e) => setQuestionText(e.target.value)}
                  placeholder="Jaise: Shri Radha Raman Ji ka prakatya kiske dwara hua?"
                  required
                />
              </div>

              <div className="options-input-grid">
                {options.map((opt, i) => (
                  <div key={i} className="form-group">
                    <label>Option {String.fromCharCode(65 + i)}</label>
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${String.fromCharCode(65 + i)}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label>Sahi Uttar (Correct Option Index)</label>
                <select
                  value={correctIndex}
                  onChange={(e) => setCorrectIndex(e.target.value)}
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                  <option value={3}>Option D</option>
                </select>
              </div>

              <button type="submit" className="admin-submit-btn">
                Add &amp; Schedule Question
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
