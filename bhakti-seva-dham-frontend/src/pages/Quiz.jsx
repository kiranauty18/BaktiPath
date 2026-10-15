import React, { useState } from "react";
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
} from "lucide-react";
import "./Quiz.css";

export default function Quiz() {
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem("bhakti_devotee_name") || "";
  });
  const [currentStep, setCurrentStep] = useState(0); // 0 to 4
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const quizQuestions = [
    {
      id: 1,
      question:
        "Shri Radha Raman Ji ka prakatya utsav kahan aur kiske dwara hua tha?",
      options: [
        "Gopal Bhatta Goswami, Vrindavan mein",
        "Swami Haridas, Banke Bihari Mandir mein",
        "Chaitanya Mahaprabhu, Puri mein",
        "Rupa Goswami, Govardhan mein",
      ],
      correct: 0,
    },
    {
      id: 2,
      question:
        "Banke Bihari Ji ki nitya lila aur aarti kis sthan par hoti hai?",
      options: ["Barsana", "Vrindavan", "Goverdhan", "Nandgaon"],
      correct: 1,
    },
    {
      id: 3,
      question:
        "Sanatan Dharma mein Yamuna Maharani kiska swaroop mani jati hain?",
      options: [
        "Surya Putri / Pavitra Nadi",
        "Ganga ji ki behan",
        "Devlok ki apsara",
        "Inmein se koi nahi",
      ],
      correct: 0,
    },
    {
      id: 4,
      question: "Shrimad Bhagavad Gita mein kul kitne adhyay (chapters) hain?",
      options: ["12", "15", "18", "20"],
      correct: 2,
    },
    {
      id: 5,
      question: "Shri Radha Rani ka prakatya sthal kahan mana jata hai?",
      options: ["Mathura", "Barsana", "Gokul", "Vrindavan"],
      correct: 1,
    },
  ];

  const currentQ = quizQuestions[currentStep];
  const isLastQuestion = currentStep === quizQuestions.length - 1;
  const answeredCount = Object.keys(userAnswers).length;
  const progressPercent = ((currentStep + 1) / quizQuestions.length) * 100;

  const handleOptionSelect = (optionIndex) => {
    if (!isSubmitted) {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQ.id]: optionIndex,
      }));
    }
  };

  const handleNext = () => {
    if (!userName.trim()) {
      alert("Kripya pehle apna Devotee Name darj karein!");
      return;
    }
    if (userAnswers[currentQ.id] === undefined) {
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

  const handleSubmit = () => {
    let calculatedScore = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correct) {
        calculatedScore += 10;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    localStorage.setItem("bhakti_devotee_name", userName.trim());

    // Update Quiz leaderboard in localStorage
    const existingLeaderboard = JSON.parse(
      localStorage.getItem("quiz_leaderboard") || "[]",
    );
    const userIndex = existingLeaderboard.findIndex(
      (item) =>
        item.name && item.name.toLowerCase() === userName.trim().toLowerCase(),
    );

    if (userIndex !== -1) {
      existingLeaderboard[userIndex].score = calculatedScore;
    } else {
      existingLeaderboard.push({
        name: userName.trim(),
        score: calculatedScore,
      });
    }

    existingLeaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem(
      "quiz_leaderboard",
      JSON.stringify(existingLeaderboard),
    );
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setUserAnswers({});
    setScore(0);
    setCurrentStep(0);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        {/* Header */}
        <header className="quiz-header">
          <span className="quiz-badge">
            <Sparkles size={14} /> NITYA GYAN SEVA
          </span>
          <h1>Shri Radha Raman &amp; Banke Bihari Quiz</h1>
          <p>
            Har prashna ka uttar dekar apna gyan parakhein aur score leaderboard
            par darj karein.
          </p>
        </header>

        {!isSubmitted ? (
          <div className="quiz-stepper-box">
            {/* Devotee Name & Progress Top Strip */}
            <div className="quiz-meta-strip">
              <div className="quiz-name-inline">
                <User size={16} />
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Aapka Shubh Naam..."
                  required
                />
              </div>

              {/* Step dots (1 to 5) */}
              <div className="quiz-step-indicators">
                {quizQuestions.map((q, idx) => {
                  const isAnswered = userAnswers[q.id] !== undefined;
                  const isCurrent = idx === currentStep;

                  return (
                    <button
                      type="button"
                      key={q.id}
                      onClick={() => {
                        if (userName.trim()) setCurrentStep(idx);
                      }}
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

            {/* Single Active Question Card */}
            <article className="quiz-card single-question-card">
              <div className="question-header">
                <span className="question-pill">
                  Prashna {currentStep + 1} of {quizQuestions.length}
                </span>
                <span className="points-pill">+10 Points</span>
              </div>

              <h2 className="question-title">{currentQ.question}</h2>

              <div className="options-grid">
                {currentQ.options.map((optionText, optIdx) => {
                  const isChecked = userAnswers[currentQ.id] === optIdx;
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

              {/* Action Buttons: Prev & Next */}
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
                  className="step-btn next-btn"
                >
                  <span>
                    {isLastQuestion ? "Submit Answers" : "Next Question"}
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
              Aapka quiz safalpurvak pura ho gaya hai aur points leaderboard par
              jodd diye gaye hain.
            </p>

            <div className="result-score-box">
              <span className="result-score-label">Total Score</span>
              <strong className="result-score-points">
                {score} / {quizQuestions.length * 10}
              </strong>
              <span className="result-score-sub">
                {score === 50
                  ? "🌟 Uttam! Sabhi uttar sahi hain."
                  : score >= 30
                    ? "Bahut sundar prayas!"
                    : "Radhe Radhe, punah prayas karein."}
              </span>
            </div>

            <div className="result-actions">
              <Link to="/leaderboard" className="result-btn-leaderboard">
                <Award size={18} />
                <span>View Saptahik Leaderboard</span>
              </Link>

              <button
                type="button"
                onClick={handleReset}
                className="result-btn-retake"
              >
                <RotateCcw size={18} />
                <span>Retake Quiz</span>
              </button>
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
