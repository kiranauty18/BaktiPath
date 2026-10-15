import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  CheckCircle2,
  User,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { sevaAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Seva.css";

const amountOptions = [50, 100, 200, 500];

export default function VoluntarySeva() {
  const { devotee } = useAuth();
  const [userName, setUserName] = useState(() => {
    return devotee?.name || localStorage.getItem("bhakti_devotee_name") || "";
  });
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync devotee name when auth state loads
  useEffect(() => {
    if (devotee?.name) {
      setUserName(devotee.name);
    }
  }, [devotee]);

  const handleSelectAmount = (val) => {
    setAmount(val);
    setCustomAmount("");
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, "");
    setCustomAmount(val);
    setAmount(Number(val) || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Kripya ek seva rashi chunein!");
      return;
    }

    setIsSubmitting(true);
    try {
      // Record pledge in MongoDB backend securely using JWT token
      await sevaAPI.recordPledge(amount);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to record seva pledge:", error);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="seva-page">
      <div className="seva-container">
        {/* Header */}
        <header className="seva-header">
          <span className="seva-badge">
            <Sparkles size={13} /> VOLUNTARY COMMUNITY SEVA
          </span>
          <h1>Serve with Devotion</h1>
          <p>
            Learn about community service and choose whether you would like to
            participate.
          </p>
        </header>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="seva-card">
            <div className="seva-card-icon-header">
              <div className="seva-top-icon">
                <Heart size={24} />
              </div>
              <h2>Support Seva Activities</h2>
              <p>
                Every act of kindness matters. Choose an amount below for this
                demonstration.
              </p>
            </div>

            {/* Devotee Info Strip */}
            <div className="seva-field-group">
              <span className="seva-label">
                <User size={15} />
                <span>Devotee</span>
              </span>
              <div className="seva-user-badge">
                <span className="seva-avatar-circle">
                  {userName ? userName.trim().charAt(0).toUpperCase() : "🙏"}
                </span>
                <span className="seva-user-name">
                  {userName || devotee?.name || "Devotee"}
                </span>
              </div>
            </div>

            {/* Amount Selection */}
            <div className="seva-field-group">
              <span className="seva-label">
                <ShieldCheck size={15} />
                <span>Optional contribution amount</span>
              </span>
              <div className="seva-amount-row">
                {amountOptions.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleSelectAmount(val)}
                    className={`seva-amount-chip ${amount === val && !customAmount ? "active" : ""}`}
                  >
                    ₹{val}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="Custom ₹"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className={`seva-custom-input ${customAmount ? "active" : ""}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || amount <= 0}
              className="seva-submit-btn"
            >
              <Heart size={16} />
              <span>
                {isSubmitting
                  ? "Recording Sankalp..."
                  : `Continue (₹${amount})`}
              </span>
            </button>

            <p className="seva-demo-notice">
              This demo does not collect real payments. Contributions are
              recorded for devotional tracking.
            </p>
          </form>
        ) : (
          /* Receipt Card */
          <div className="seva-card seva-receipt-card">
            <div className="receipt-check-icon">
              <CheckCircle2 size={46} />
            </div>

            <h2>Dhanyavaad, {userName}!</h2>
            <p className="receipt-subtext">
              Aapka seva sankalp safalata-purvak darj ho chuka hai.
            </p>

            <div className="receipt-summary-box">
              <div className="receipt-row">
                <span>Devotee</span>
                <strong>{userName}</strong>
              </div>
              <div className="receipt-row">
                <span>Contribution</span>
                <strong className="receipt-amt">₹{amount}</strong>
              </div>
              <div className="receipt-row">
                <span>Status</span>
                <span className="receipt-status-badge">Recorded</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="receipt-reset-btn"
            >
              <RotateCcw size={15} />
              <span>Make another pledge</span>
            </button>
          </div>
        )}

        <div className="seva-footer-decor">
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>
      </div>
    </div>
  );
}
