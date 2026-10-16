import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Sparkles,
  Award,
  Heart,
  LogOut,
  Calendar,
  Flame,
  ArrowRight,
  TrendingUp,
  Clock,
  BookOpen,
} from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const { devotee, logoutDevotee } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(devotee || null);
  const [loading, setLoading] = useState(true);
  const [sevaHistory, setSevaHistory] = useState([]);
  const [sevaAnalytics, setSevaAnalytics] = useState(null);

  const getToken = () => {
    const storedUser = localStorage.getItem("bhakti_devotee");
    return devotee?.token || (storedUser ? JSON.parse(storedUser).token : null);
  };

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const token = getToken();
        if (!token) return;

        // Fetch latest profile directly from backend
        const res = await fetch("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data?.success && data.devotee) {
          setProfileData(data.devotee);
        } else if (data?.devotee) {
          setProfileData(data.devotee);
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProfile();
  }, [devotee]);

  useEffect(() => {
    const fetchSevaAnalytics = async () => {
      if (devotee?.role !== "admin") return;

      try {
        const token = getToken();
        const res = await fetch(
          "http://localhost:5000/api/seva/admin/analytics",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to load seva analytics.");
        }
        setSevaAnalytics(data.analytics);
      } catch (err) {
        console.error("Failed to load seva analytics:", err);
      }
    };

    fetchSevaAnalytics();
  }, [devotee]);

  useEffect(() => {
    const fetchSevaHistory = async () => {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch("http://localhost:5000/api/seva/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || "Failed to load seva history.");
        }
        setSevaHistory(data.transactions || []);
      } catch (err) {
        console.error("Failed to load seva payment history:", err);
      }
    };

    fetchSevaHistory();
  }, [devotee]);

  const handleLogout = () => {
    logoutDevotee();
    navigate("/");
  };

  const nameInitial = profileData?.name
    ? profileData.name.trim().charAt(0).toUpperCase()
    : "ॐ";

  // Today's Live Sadhana (Synced directly with Leaderboard)
  const todayMalas = profileData?.dailyCompletedMalas || 0;
  const todayJapPts = todayMalas * 5;
  const todayQuizPts = profileData?.dailyQuizScore || 0;
  const todayTotalPts = todayJapPts + todayQuizPts;

  // Lifetime Sadhana Stats
  const lifetimeMalas = profileData?.completedMalas || 0;
  const lifetimeBeads = profileData?.lifetimeJap || 0;
  const totalQuizScore = profileData?.quizScore || 0;
  const sevaAmount = profileData?.totalSevaPledged || 0;

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Hero Plaque */}
        <div className="profile-header-card">
          <div className="profile-badge-row">
            <span className="profile-tag">
              <Sparkles size={13} /> BHAKTI SADHANA PROFILE
            </span>
          </div>

          <div className="profile-info-row">
            <div className="profile-avatar-large">
              <span>{nameInitial}</span>
            </div>

            <div className="profile-text-group">
              <h1>{profileData?.name || "Devotee"}</h1>
              <p className="profile-email">
                {profileData?.email || "Registered Devotee"}
              </p>
              <div className="profile-meta-sub">
                <span className="meta-pill">
                  <Calendar size={13} />
                  <span>Devotee of Shri Radha Raman &amp; Bihari Ji</span>
                </span>
                {profileData?.role === "admin" && (
                  <span className="meta-pill admin-pill">
                    <Sparkles size={12} />
                    <span>Online Seva Admin</span>
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="profile-logout-btn"
              title="Logout from Dham"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Today's Live Leaderboard Standing Highlight */}
        <div className="today-standing-banner">
          <div className="standing-banner-left">
            <div className="standing-icon-wrap">
              <TrendingUp size={22} color="#b85b00" />
            </div>
            <div>
              <h3>Aaj Ki Sadhana &amp; Leaderboard Score</h3>
              <p>
                Nitya Katha Quiz (Total 100 Pts) + Naam Jap Sadhana (5 Pts per
                Mala)
              </p>
            </div>
          </div>
          <div className="standing-score-pill">
            <span className="standing-label">Aaj Ke Kul Ank</span>
            <strong className="standing-val">{todayTotalPts} Pts</strong>
            <small className="standing-detail">
              Quiz: {todayQuizPts} Pts • Jap: {todayJapPts} Pts ({todayMalas}{" "}
              Malas)
            </small>
          </div>
        </div>

        {/* Sadhana Statistics Grid */}
        <section className="profile-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper malas">📿</div>
            <div className="stat-content">
              <span className="stat-label">Aaj Ki Malas</span>
              <strong className="stat-number">{todayMalas}</strong>
              <small className="stat-caption">
                {todayJapPts} Points Earned
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper lifetime-malas">
              <Award size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Lifetime Malas</span>
              <strong className="stat-number">{lifetimeMalas}</strong>
              <small className="stat-caption">
                {lifetimeMalas * 108} Chants Completed
              </small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper beads">
              <Flame size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Lifetime Beads</span>
              <strong className="stat-number">{lifetimeBeads}</strong>
              <small className="stat-caption">Sacred Japa Count</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper quiz">
              <BookOpen size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Lifetime Quiz Pts</span>
              <strong className="stat-number">{totalQuizScore}</strong>
              <small className="stat-caption">Gyan Seva Score</small>
            </div>
          </div>
        </section>

        {/* Quick Sadhana Navigation Cards */}
        <section className="profile-actions-section">
          <h2>Continue Your Daily Sadhana</h2>
          <div className="action-cards-row">
            <Link to="/jap" className="sadhana-jump-card">
              <div className="jump-card-icon">📿</div>
              <div className="jump-card-info">
                <h3>Naam Jap Sadhana</h3>
                <p>
                  Complete your daily malas with audio chime feedback (5 Pts /
                  Mala).
                </p>
              </div>
              <ArrowRight size={18} className="jump-arrow" />
            </Link>

            <Link to="/quiz" className="sadhana-jump-card">
              <div className="jump-card-icon">
                <Award size={24} />
              </div>
              <div className="jump-card-info">
                <h3>Daily Spiritual Quiz</h3>
                <p>
                  Read today's Katha, attempt 5 timed questions and earn up to
                  100 Pts.
                </p>
              </div>
              <ArrowRight size={18} className="jump-arrow" />
            </Link>
          </div>
        </section>

        <section className="payment-history-section">
          <div className="payment-history-header">
            <div>
              <h2>Online Seva Payment History</h2>
              <p>Track the verification status of your payment requests.</p>
            </div>
            <strong>{sevaHistory.length} Requests</strong>
          </div>

          {sevaHistory.length === 0 ? (
            <p className="payment-history-empty">No payment requests yet.</p>
          ) : (
            <div className="payment-history-list">
              {sevaHistory.map((transaction) => (
                <div className="payment-history-row" key={transaction._id}>
                  <div>
                    <strong>₹{transaction.amount}</strong>
                    <span>UTR: {transaction.utrNumber}</span>
                    <small>
                      {new Date(transaction.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <span className={`payment-status ${transaction.status}`}>
                    {transaction.status === "verified"
                      ? "Accepted"
                      : transaction.status === "rejected"
                        ? "Rejected"
                        : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        {devotee?.role === "admin" && sevaAnalytics && (
          <section className="admin-payment-analysis">
            <h2>Seva Payment Analysis</h2>
            <div className="admin-payment-analysis-grid">
              <div className="admin-analysis-card pending">
                <span>Pending</span>
                <strong>{sevaAnalytics.pending.count}</strong>
                <small>₹{sevaAnalytics.pending.amount}</small>
              </div>
              <div className="admin-analysis-card verified">
                <span>Accepted</span>
                <strong>{sevaAnalytics.verified.count}</strong>
                <small>₹{sevaAnalytics.verified.amount}</small>
              </div>
              <div className="admin-analysis-card rejected">
                <span>Rejected</span>
                <strong>{sevaAnalytics.rejected.count}</strong>
                <small>₹{sevaAnalytics.rejected.amount}</small>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
