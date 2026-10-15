import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { profileAPI } from "../api/api";
import {
  User,
  Sparkles,
  Award,
  Heart,
  LogOut,
  Calendar,
  Flame,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import "./Profile.css";

export default function Profile() {
  const { devotee, logoutDevotee } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(devotee || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const res = await profileAPI.getProfile();
        if (res?.devotee) {
          setProfileData(res.devotee);
        }
      } catch (err) {
        console.error("Failed to load profile details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestProfile();
  }, []);

  const handleLogout = () => {
    logoutDevotee();
    navigate("/");
  };

  const nameInitial = profileData?.name
    ? profileData.name.trim().charAt(0).toUpperCase()
    : "ॐ";

  const totalMalas = profileData?.completedMalas || 0;
  const lifetimeBeads = profileData?.lifetimeJap || 0;
  const quizScore = profileData?.quizScore || 0;
  const totalScore = (profileData?.totalScore || 0) || (totalMalas * 10 + quizScore);
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
              <p className="profile-email">{profileData?.email || "Registered Devotee"}</p>
              <div className="profile-meta-sub">
                <span className="meta-pill">
                  <Calendar size={13} />
                  <span>Devotee of Shri Radha Raman &amp; Bihari Ji</span>
                </span>
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

        {/* Sadhana Statistics Grid */}
        <section className="profile-stats-grid">
          <div className="stat-card">
            <div className="stat-icon-wrapper malas">
              📿
            </div>
            <div className="stat-content">
              <span className="stat-label">Completed Malas</span>
              <strong className="stat-number">{totalMalas}</strong>
              <small className="stat-caption">{totalMalas * 108} Total Chants</small>
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
              <Award size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Quiz Points</span>
              <strong className="stat-number">{quizScore}</strong>
              <small className="stat-caption">Spiritual Gyan Seva</small>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon-wrapper seva">
              <Heart size={22} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Seva Sankalpa</span>
              <strong className="stat-number">₹{sevaAmount}</strong>
              <small className="stat-caption">Voluntary Contribution</small>
            </div>
          </div>
        </section>

        {/* Quick Sadhana Jump Cards */}
        <section className="profile-actions-section">
          <h2>Continue Your Daily Sadhana</h2>
          <div className="action-cards-row">
            <Link to="/jap" className="sadhana-jump-card">
              <div className="jump-card-icon">📿</div>
              <div className="jump-card-info">
                <h3>Naam Jap Sadhana</h3>
                <p>Complete your daily mala and connect with Shri Radha Rani's divine name.</p>
              </div>
              <ArrowRight size={18} className="jump-arrow" />
            </Link>

            <Link to="/quiz" className="sadhana-jump-card">
              <div className="jump-card-icon">
                <Award size={24} />
              </div>
              <div className="jump-card-info">
                <h3>Daily Spiritual Quiz</h3>
                <p>Deepen your knowledge of Sanatan Dharma and raise your leaderboard rank.</p>
              </div>
              <ArrowRight size={18} className="jump-arrow" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}