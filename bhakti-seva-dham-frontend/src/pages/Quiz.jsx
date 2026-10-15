import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  User,
  CheckCircle2,
  Trophy,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Quiz.css";

export default function Quiz() {
  const { devotee } = useAuth();
  const [userName, setUserName] = useState(() => {
    return devotee?.name || localStorage.getItem("bhakti_devotee_name") || "";
  });

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [isFallback, setIsFallback] = useState(false);

  // Attempt & Score tracking state
  const [attemptsUsed, setAttemptsUsed] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [limitReached, setLimitReached] = useState(false);
  const [bestScoreToday, setBestScoreToday] = useState(0);

  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (devotee?.name) {
      setUserName(devotee.name);
    }
  }, [devotee]);

  const fetchTodayQuiz = async () => {
    try {
      setLoading(true);
      setErrorMsg("");

      const storedUser = localStorage.getItem("bhakti_devotee");
      const token =
        devotee?.token || (storedUser ? JSON.parse(storedUser).token : null);

      const res = await fetch("http://localhost:5000/api/quiz/today", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (data.limitReached) {
        setLimitReached(true);
        setAttemptsUsed(data.attemptsUsed || 2);
        setAttemptsLeft(0);
        setBestScoreToday(data.bestScoreToday || 0);
      } else if (data.success && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setIsFallback(Boolean(data.isFallback));
        setAttemptsUsed(data.attemptsUsed || 0);
        setAttemptsLeft(
          data.attemptsLeft !== undefined ? data.attemptsLeft : 2,
        );
        setBestScoreToday(data.bestScoreToday || 0);
        setLimitReached(false);
      } else {
        setErrorMsg("Aaj ke liye koi prashna uplabdh nahi hain.");
      }
    } catch (err) {
      console.error("Quiz fetch failed:", err);
      setErrorMsg(
        "Quiz prashna load karne me samasya aayi. Kripya punah prayas karein.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayQuiz();
  }, [devotee]);

  const currentQ = questions[currentStep];
  const isLastQuestion =
    questions.length > 0 && currentStep === questions.length - 1;
  const progressPercent =
    questions.length > 0 ? ((currentStep + 1) / questions.length) * 100 : 0;

  const handleOptionSelect = (optionIndex) => {
    if (!isSubmitted && currentQ) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQ._id]: optionIndex,
      }));
    }
  };

  const handleNext = () => {
    if (userAnswers[currentQ._id] === undefined) {
      alert("Kripya aage badhne se pehle ek vikalp chunein!");
      return;
    }
    if (!isLastQuestion) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const storedUser = localStorage.getItem("bhakti_devotee");
      const token =
        devotee?.token || (storedUser ? JSON.parse(storedUser).token : null);

      const payloadAnswers = Object.entries(userAnswers).map(
        ([questionId, selectedIndex]) => ({
          questionId,
          selectedIndex,
        }),
      );

      const res = await fetch("http://localhost:5000/api/quiz/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers: payloadAnswers }),
      });

      const data = await res.json();

      if (data.success) {
        setEarnedScore(data.thisAttemptScore);
        setBestScoreToday(data.bestScoreToday);
        setAttemptsUsed(data.attemptsUsed);
        setAttemptsLeft(data.attemptsLeft);
        setIsSubmitted(true);
      } else {
        alert(data.message || "Submission failed");
      }
    } catch (err) {
      console.error("Quiz submission error:", err);
      alert("Submission me samasya aayi. Kripya punah prayas karein.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setIsSubmitted(false);
    setUserAnswers({});
    setEarnedScore(0);
    setCurrentStep(0);
    fetchTodayQuiz();
  };

  if (loading) {
    return (
      <div className="quiz-page">
        <div
          className="quiz-container"
          style={{ textAlign: "center", padding: "80px 20px" }}
        >
          <Loader2
            size={36}
            className="animate-spin"
            style={{ margin: "0 auto 16px", color: "#b85b00" }}
          />
          <h2 style={{ fontFamily: "Georgia, serif", color: "#4a0e17" }}>
            Radha Raman Ji ke nitya prashna prapt ho rahe hain... 🌸
          </h2>
        </div>
      </div>
    );
  }

  // View when all 2 daily attempts are consumed
  if (limitReached) {
    return (
      <div className="quiz-page">
        <div className="quiz-container">
          <div
            className="quiz-card quiz-result-card"
            style={{ textAlign: "center", padding: "50px 24px" }}
          >
            <div className="result-trophy-icon">
              <Trophy size={48} color="#d4af37" />
            </div>
            <h2>Radhe Radhe, {userName}!</h2>
            <p
              className="result-subtext"
              style={{ fontSize: "1.05rem", margin: "14px 0 18px" }}
            >
              Aapne aaj ke dono (2/2) attempts purna kar liye hain. Naye prashno
              ke sath kal punah juden!
            </p>
            <div
              className="result-score-box"
              style={{ maxWidth: "340px", margin: "0 auto 24px" }}
            >
              <span className="result-score-label">Aaj Ka Sarvochha Score</span>
              <strong className="result-score-points">
                {bestScoreToday} Pts
              </strong>
            </div>
            <div
              className="result-actions"
              style={{ justifyContent: "center" }}
            >
              <Link to="/leaderboard" className="result-btn-leaderboard">
                <Award size={18} />
                <span>Leaderboard Dekhein</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (errorMsg || questions.length === 0) {
    return (
      <div className="quiz-page">
        <div
          className="quiz-container"
          style={{ textAlign: "center", padding: "80px 20px" }}
        >
          <AlertCircle
            size={44}
            color="#b91c1c"
            style={{ margin: "0 auto 12px" }}
          />
          <h2 style={{ color: "#4a0e17" }}>
            {errorMsg || "Koi prashna uplabdh nahi hai."}
          </h2>
          <button
            type="button"
            onClick={fetchTodayQuiz}
            className="result-btn-retake"
            style={{ margin: "20px auto 0", display: "inline-flex" }}
          >
            <RotateCcw size={16} />
            <span>Reload Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {/* Header */}
        <header className="quiz-header">
          <span className="quiz-badge">
            <Sparkles size={14} /> NITYA GYAN SEVA{" "}
            {isFallback && "(Purn Gyan Abhyas)"}
          </span>
          <h1>Shri Radha Raman &amp; Banke Bihari Quiz</h1>
          <p>
            Har prashna ka uttar dekar apna gyan parakhein aur score leaderboard
            par darj karein.
          </p>
        </header>

        {!isSubmitted ? (
          <div className="quiz-stepper-box">
            {/* Devotee Name, Attempt Counter & Step Dots */}
            <div className="quiz-meta-strip">
              <div
                className="quiz-name-inline"
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
                <User size={16} />
                <span className="quiz-logged-name">
                  {userName || devotee?.name || "Devotee"}
                </span>
                <span
                  style={{
                    fontSize: "0.8rem",
                    background: "#faeed1",
                    color: "#8c5825",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontWeight: 600,
                  }}
                >
                  Attempt {attemptsUsed + 1} of 2
                </span>
              </div>

              {/* Step dots */}
              <div className="quiz-step-indicators">
                {questions.map((q, idx) => {
                  const isAnswered = userAnswers[q._id] !== undefined;
                  const isCurrent = idx === currentStep;

                  return (
                    <button
                      type="button"
                      key={q._id}
                      onClick={() => setCurrentStep(idx)}
                      className={`step-pill ${isCurrent ? "current" : ""} ${isAnswered ? "done" : ""}`}
                      title={`Prashna ${idx + 1}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="quiz-stepper-bar-bg">
              <div
                className="quiz-stepper-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>

            {/* Active Question */}
            <article className="quiz-card single-question-card">
              <div className="question-header">
                <span className="question-pill">
                  Prashna {currentStep + 1} of {questions.length}
                </span>
                <span className="points-pill">+10 Points</span>
              </div>

              <h2 className="question-title">{currentQ?.question}</h2>

              <div className="options-grid">
                {currentQ?.options?.map((optionText, optIdx) => {
                  const isChecked = userAnswers[currentQ._id] === optIdx;
                  const letter = String.fromCharCode(65 + optIdx);

                  return (
                    <div
                      key={optIdx}
                      onClick={() => handleOptionSelect(optIdx)}
                      className={`option-card ${isChecked ? "option-checked" : ""}`}
                    >
                      <span className="option-letter-badge">{letter}</span>
                      <span className="option-label-text">{optionText}</span>
                      {isChecked && (
                        <CheckCircle2 size={20} className="option-check-icon" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="quiz-card-footer">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                  className="step-btn prev-btn"
                >
                  <ArrowLeft size={16} />
                  <span>Previous</span>
                </button>

                <button
                  type="button"
                  onClick={handleNext}
                  disabled={submitting}
                  className="step-btn next-btn"
                >
                  <span>
                    {isLastQuestion
                      ? submitting
                        ? "Submitting..."
                        : "Submit Answers"
                      : "Next Question"}
                  </span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </article>
          </div>
        ) : (
          /* Result Card */
          <div className="quiz-card quiz-result-card">
            <div className="result-trophy-icon">
              <Trophy size={48} />
            </div>

            <h2>Jai Shri Radhe, {userName}!</h2>
            <p className="result-subtext">
              Aapka quiz safalpurvak pura ho gaya hai.
            </p>

            <div className="result-score-box">
              <span className="result-score-label">Is Attempt Ka Score</span>
              <strong className="result-score-points">
                {earnedScore} / {questions.length * 10}
              </strong>
              <div
                style={{
                  marginTop: "8px",
                  paddingTop: "8px",
                  borderTop: "1px dashed rgba(212, 175, 55, 0.4)",
                  fontSize: "0.95rem",
                  color: "#4a0e17",
                  fontWeight: 600,
                }}
              >
                🏆 Aaj Ka Sarvochha Score (Registered on Leaderboard):{" "}
                <span style={{ color: "#b85b00", fontSize: "1.05rem" }}>
                  {bestScoreToday} Pts
                </span>
              </div>
              <span className="result-score-sub" style={{ marginTop: "6px" }}>
                {attemptsLeft > 0
                  ? "Aapke paas sudhar ke liye 1 aur attempt bacha hai."
                  : "Aapne aaj ke dono attempts purna kar liye hain."}
              </span>
            </div>

            <div className="result-actions">
              <Link to="/leaderboard" className="result-btn-leaderboard">
                <Award size={18} />
                <span>View Saptahik Leaderboard</span>
              </Link>

              {attemptsLeft > 0 && (
                <button
                  type="button"
                  onClick={handleRetake}
                  className="result-btn-retake"
                >
                  <RotateCcw size={18} />
                  <span>Retake Quiz (1 Left)</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="quiz-footer-decor">
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>
      </div>
    </div>
  );
}
