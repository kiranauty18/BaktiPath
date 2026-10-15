import React, { useState } from 'react';
import { Heart, Sparkles, CheckCircle2, User, ShieldCheck, ArrowRight, RotateCcw } from 'lucide-react';
import './Seva.css';

const amountOptions = [50, 100, 200, 500];

export default function VoluntarySeva() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('bhakti_devotee_name') || '';
  });
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelectAmount = (val) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    setAmount(Number(val) || 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("Kripya apna shubh naam darj karein!");
      return;
    }
    if (amount <= 0) {
      alert("Kripya ek seva rashi chunein!");
      return;
    }

    localStorage.setItem('bhakti_devotee_name', userName.trim());
    setIsSubmitted(true);
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
          <p>Learn about community service and choose whether you would like to participate.</p>
        </header>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="seva-card">
            
            <div className="seva-card-icon-header">
              <div className="seva-top-icon">
                <Heart size={24} />
              </div>
              <h2>Support Seva Activities</h2>
              <p>Every act of kindness matters. Choose an amount below for this demonstration.</p>
            </div>

            {/* Devotee Name */}
            <div className="seva-field-group">
              <label htmlFor="seva-name" className="seva-label">
                <User size={15} />
                <span>Your Name</span>
              </label>
              <input
                id="seva-name"
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                required
                className="seva-input"
              />
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
                    className={`seva-amount-chip ${amount === val && !customAmount ? 'active' : ''}`}
                  >
                    ₹{val}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="Custom ₹"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className={`seva-custom-input ${customAmount ? 'active' : ''}`}
                />
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="seva-submit-btn">
              <Heart size={16} />
              <span>Continue (₹{amount})</span>
            </button>

            <p className="seva-demo-notice">
              This demo does not collect payments. Contributions are entirely optional.
            </p>
          </form>
        ) : (
          /* Simple Receipt Card */
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