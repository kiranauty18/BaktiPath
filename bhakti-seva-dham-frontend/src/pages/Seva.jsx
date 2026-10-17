import React, { useState, useEffect } from "react";
import {
  Heart,
  Sparkles,
  CheckCircle2,
  User,
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  X,
  QrCode,
} from "lucide-react";
import { sevaAPI } from "../api/api";
import { useAuth } from "../context/AuthContext";
import "./Seva.css";

const amountOptions = [50, 100, 500];
const UPI_ID = "9549464445@ibl";

export default function VoluntarySeva() {
  const { devotee } = useAuth();
  const [userName, setUserName] = useState(() => {
    return devotee?.name || localStorage.getItem("bhakti_devotee_name") || "";
  });
  const [amount, setAmount] = useState(100);
  const [customAmount, setCustomAmount] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // QR Modal and verification state
  const [showQRModal, setShowQRModal] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState("");

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

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(UPI_ID);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenPayment = (e) => {
    e.preventDefault();
    if (amount <= 0) {
      alert("Kripya ek valid seva rashi chunein!");
      return;
    }
    setShowQRModal(true);
  };

  const handleConfirmPayment = async () => {
    if (utrNumber.trim().length < 6) {
      alert("Kripya UPI Reference / UTR Number darj karein.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Record pledge in MongoDB backend securely using JWT token
      const response = await sevaAPI.recordPledge(amount, utrNumber);
      if (!response.success) {
        throw new Error(response.message || "Seva submission failed.");
      }
      setShowQRModal(false);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Failed to record seva pledge:", error);
      alert(error.message || "Seva submission failed. Please try again.");
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
          <form onSubmit={handleOpenPayment} className="seva-card">
            <div className="seva-card-icon-header">
              <div className="seva-top-icon">
                <Heart size={24} />
              </div>
              <h2>Support Seva Activities</h2>
              <p>
                Every act of kindness matters. Choose an amount below to make
                your devotional offering.
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
              disabled={amount <= 0}
              className="seva-submit-btn"
            >
              <Heart size={16} />
              <span>Continue (₹{amount})</span>
            </button>

            <p className="seva-demo-notice">
              Your contribution supports our online devotional services and
              community activities. All contributions are voluntary.
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
              Radhe Radhe! Aapka UTR No. prapt hua. Online seva admin bank
              statement check karke ise verify karenge.
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
              {utrNumber && (
                <div className="receipt-row">
                  <span>Ref / UTR</span>
                  <strong>{utrNumber}</strong>
                </div>
              )}
              <div className="receipt-row">
                <span>Status</span>
                <span className="receipt-status-badge">Pending Verification</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setUtrNumber("");
              }}
              className="receipt-reset-btn"
            >
              <RotateCcw size={15} />
              <span>Make another pledge</span>
            </button>
          </div>
        )}

        {/* QR Code Scanner Modal */}
        {showQRModal && (
          <div
            className="qr-modal-backdrop"
            onClick={() => setShowQRModal(false)}
          >
            <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
              {/* Modal Header */}
              <div className="qr-modal-header">
                <div className="qr-modal-title">
                  <QrCode size={18} color="#b85b00" />
                  <h3>Online Seva Payment</h3>
                </div>
                <button
                  type="button"
                  className="qr-close-btn"
                  onClick={() => setShowQRModal(false)}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="qr-modal-body">
                <div className="bank-info-badge">
                  <strong>Central Bank of India</strong>
                  <small>Primary account for receiving money</small>
                </div>

                {/* QR Scanner Image */}
                <div className="qr-frame">
                  <img
                    src="/images/Piyush_Gaur.jpeg"
                    alt="Central Bank UPI QR"
                    className="qr-img"
                  />
                </div>

                {/* Amount Row */}
                <div className="qr-amount-pill">
                  <span>Offering Amount:</span>
                  <strong>₹{amount}</strong>
                </div>

                {/* UPI ID Row */}
                <div className="qr-upi-row">
                  <div className="qr-upi-text">
                    <span className="qr-upi-label">UPI ID</span>
                    <strong className="qr-upi-id">{UPI_ID}</strong>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className={`qr-copy-btn ${copiedUpi ? "copied" : ""}`}
                  >
                    {copiedUpi ? (
                      <>
                        <Check size={13} /> Copied
                      </>
                    ) : (
                      <>
                        <Copy size={13} /> Copy
                      </>
                    )}
                  </button>
                </div>

                {/* UTR Input */}
                <div className="qr-utr-group">
                  <label htmlFor="utr-input">
                    UPI Reference / UTR No. (Required):
                  </label>
                  <input
                    id="utr-input"
                    type="text"
                    placeholder="Enter 12-digit UPI UTR No. (Required)"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    className="qr-utr-input"
                  />
                </div>

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isSubmitting || utrNumber.trim().length < 6}
                  className="qr-confirm-btn"
                >
                  <Heart size={16} fill="#ffffff" />
                  <span>
                    {isSubmitting
                      ? "Recording Seva..."
                      : "Maine Payment Kar Diya (Confirm)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="seva-footer-decor">
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>
      </div>
    </div>
  );
}
