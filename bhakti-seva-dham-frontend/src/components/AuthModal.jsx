import React, { useState } from "react";
import {
  Sparkles,
  X,
  Mail,
  Lock,
  User,
  LogIn,
  UserPlus,
  AlertCircle,
} from "lucide-react";
import { authAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./AuthModal.css";

export default function AuthModal({ isOpen, onClose }) {
  const { loginDevotee } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let data;
      if (isRegister) {
        if (!name.trim()) {
          setError("Kripya apna shubh naam darj karein");
          setLoading(false);
          return;
        }
        data = await authAPI.register({ name, email, password });
      } else {
        data = await authAPI.login({ email, password });
      }

      if (data.token) {
        loginDevotee(data);
        onClose();
      } else {
        setError(
          data.message || "Authentication viphal rahi. Punah prayas karein.",
        );
      }
    } catch (err) {
      setError(
        "Server se sampark nahi ho saka. Kripya backend status check karein.",
      );
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsRegister(!isRegister);
    setError("");
  };

  return (
    <div className="auth-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-close-btn"
          onClick={onClose}
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="auth-header">
          <div className="auth-badge">
            <Sparkles size={14} />
            <span>DEVOTEE PORTAL</span>
          </div>
          <h2>{isRegister ? "Bhakti Khata Banayein" : "Devotee Pravesh"}</h2>
          <p>
            {isRegister
              ? "Apna naam aur email darj karke quiz aur mala points safe rakhein"
              : "Apne sadhana points aur ranking dekhne ke liye login karein"}
          </p>
        </div>

        {error && (
          <div className="auth-error-box">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <div className="auth-input-group">
              <label>Devotee Name</label>
              <div className="auth-input-wrapper">
                <User size={16} className="auth-icon" />
                <input
                  type="text"
                  placeholder="Aapka Shubh Naam"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="auth-input-wrapper">
              <Mail size={16} className="auth-icon" />
              <input
                type="email"
                placeholder="devotee@bhaktidham.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="auth-input-wrapper">
              <Lock size={16} className="auth-icon" />
              <input
                type="password"
                placeholder="Kam se kam 6 akshar"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="auth-submit-btn">
            {loading ? (
              <span>Pratiksha karein...</span>
            ) : isRegister ? (
              <>
                <UserPlus size={16} />
                <span>Register Karein</span>
              </>
            ) : (
              <>
                <LogIn size={16} />
                <span>Login Karein</span>
              </>
            )}
          </button>
        </form>

        <div className="auth-toggle-footer">
          <span>{isRegister ? "Pehle se khata hai?" : "Naye bhakt hain?"}</span>
          <button
            type="button"
            onClick={switchMode}
            className="auth-toggle-link"
          >
            {isRegister ? "Login Karein" : "Khata Banayein"}
          </button>
        </div>
      </div>
    </div>
  );
}
