
import { useState } from "react";
import {
  Award,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User,
  Trophy,
} from "lucide-react";
import { Link } from "react-router-dom";
import "./Quiz.css";

const quizQuestions = [
  {
    id: 1,
    question:
      "Who is traditionally associated with the manifestation of Shri Radha Raman Ji in Vrindavan?",
    options: [
      "Gopal Bhatta Goswami",
      "Swami Haridas",
      "Chaitanya Mahaprabhu",
      "Rupa Goswami",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 2,
    question: "In which city is Banke Bihari Ji's famous temple located?",
    options: ["Mathura", "Vrindavan", "Ayodhya", "Dwarka"],
    correctAnswerIndex: 1,
  },
  {
    id: 3,
    question: "How many chapters are there in the Bhagavad Gita?",
    options: ["12", "15", "18", "20"],
    correctAnswerIndex: 2,
  },
  {
    id: 4,
    question: "Which river is especially associated with Krishna's pastimes in Vrindavan?",
    options: ["Godavari", "Narmada", "Yamuna", "Kaveri"],
    correctAnswerIndex: 2,
  },
  {
    id: 5,
    question: "Barsana is traditionally associated with which divine personality?",
    options: [
      "Radha Rani",
      "Goddess Saraswati",
      "Goddess Lakshmi",
      "Goddess Durga",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 6,
    question: "Who delivers the teachings to Arjuna in the Bhagavad Gita?",
    options: ["Lord Shiva", "Lord Krishna", "Lord Brahma", "Narada Muni"],
    correctAnswerIndex: 1,
  },
  {
    id: 7,
    question: "What does the word 'seva' commonly mean in a devotional context?",
    options: [
      "Selfless service",
      "Competition",
      "Celebration only",
      "Pilgrimage only",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 8,
    question: "Govardhan Hill is closely associated with which pastime of Krishna?",
    options: [
      "Lifting Govardhan Hill",
      "Building the Ram Setu",
      "Churning the ocean",
      "Teaching archery",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 9,
    question: "Which sacred text contains the story of Prahlada and Narasimha?",
    options: [
      "Bhagavata Purana",
      "Arthashastra",
      "Natya Shastra",
      "Yoga Sutras",
    ],
    correctAnswerIndex: 0,
  },
  {
    id: 10,
    question: "Which quality is encouraged by the practice of bhakti?",
    options: ["Devotion", "Pride", "Greed", "Jealousy"],
    correctAnswerIndex: 0,
  },
];

const STORAGE_KEY = "bhaktiQuizResults";

export default function Quiz() {
  const [userName, setUserName] = useState("");
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const totalPoints = quizQuestions.length * 10;

  function handleOptionChange(questionId, optionIndex) {
    if (isSubmitted) return;

    setUserAnswers((previous) => ({
      ...previous,
      [questionId]: optionIndex,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!userName.trim()) {
      setError("Please enter your name before submitting.");
      return;
    }

    if (Object.keys(userAnswers).length !== quizQuestions.length) {
      setError("Please answer all 10 questions before submitting.");
      return;
    }

    const calculatedScore = quizQuestions.reduce((total, question) => {
      return total +
        (userAnswers[question.id] === question.correctAnswerIndex ? 10 : 0);
    }, 0);

    const newResult = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: userName.trim(),
      score: calculatedScore,
      totalPoints,
      percentage: Math.round((calculatedScore / totalPoints) * 100),
      date: new Date().toISOString(),
    };

    try {
      const savedResults = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(savedResults)) {
        throw new Error("Saved quiz results have an invalid format.");
      }

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify([...savedResults, newResult])
      );

      setResult(newResult);
      setIsSubmitted(true);
      setError("");
    } catch (storageError) {
      console.error("Unable to save quiz result:", storageError);
      setError(
        "Your result could not be saved. Please check your browser storage and try again."
      );
    }
  }

  function handleReset() {
    setUserName("");
    setUserAnswers({});
    setIsSubmitted(false);
    setResult(null);
    setError("");
  }

  return (
    <main className="quiz-page">
      <div className="quiz-container">
        <header className="quiz-header">
          <span className="quiz-badge">
            Daily Challenge · 10 Questions
          </span>

          <h1>Daily Katha Quiz</h1>

          <p>
            Learn about devotional traditions and test your spiritual knowledge.
          </p>
        </header>

        <section className="darshan-card">
          <div className="darshan-symbol" aria-hidden="true">
            ॐ
          </div>
          <h2>Shri Radha Raman Ji</h2>
          <p>Divine Darshan · Vrindavan</p>
          <p className="darshan-note">
            Add your temple photograph to your public images folder when ready.
          </p>
        </section>

        {!isSubmitted ? (
          <form className="quiz-card" onSubmit={handleSubmit}>
            <div className="quiz-name-field">
              <label htmlFor="quiz-user-name">
                <User size={18} />
                Your Name
              </label>

              <input
                id="quiz-user-name"
                type="text"
                value={userName}
                onChange={(event) => {
                  setUserName(event.target.value);
                  setError("");
                }}
                placeholder="Enter your name"
                maxLength={80}
                autoComplete="name"
                required
              />
            </div>

            <div className="quiz-card-heading">
              <h2>
                <Sparkles size={22} />
                Questions of the Day
              </h2>
              <span className="points-badge">
                10 points each
              </span>
            </div>

            <p className="quiz-progress">
              Answered: {Object.keys(userAnswers).length} of{" "}
              {quizQuestions.length}
            </p>

            {quizQuestions.map((question, questionIndex) => (
              <section className="quiz-question-block" key={question.id}>
                <p className="quiz-question-number">
                  Question {questionIndex + 1} of {quizQuestions.length}
                </p>

                <h3 className="quiz-question">
                  {question.question}
                </h3>

                <div className="quiz-options">
                  {question.options.map((option, optionIndex) => {
                    const selected =
                      userAnswers[question.id] === optionIndex;

                    return (
                      <label
                        key={option}
                        className={`quiz-option-label ${
                          selected ? "selected" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${question.id}`}
                          value={optionIndex}
                          checked={selected}
                          onChange={() =>
                            handleOptionChange(question.id, optionIndex)
                          }
                        />

                        <span className="option-letter">
                          {String.fromCharCode(65 + optionIndex)}
                        </span>

                        <span className="option-text">{option}</span>
                      </label>
                    );
                  })}
                </div>
              </section>
            ))}

            {error && (
              <p className="quiz-error" role="alert">
                <AlertCircle size={18} />
                {error}
              </p>
            )}

            <button
              className="submit-quiz-button"
              type="submit"
              disabled={Object.keys(userAnswers).length !== quizQuestions.length}
            >
              <Sparkles size={19} />
              Submit Quiz &amp; Save Score
            </button>
          </form>
        ) : (
          <section className="quiz-card quiz-result-card" role="status">
            <div className="quiz-result-icon">
              <Award size={38} />
            </div>

            <h2>Radhe Radhe, {result.name}!</h2>
            <p>Your quiz has been submitted successfully.</p>

            <div className="quiz-score-display">
              <span>Your Score</span>
              <strong>
                {result.score} / {result.totalPoints}
              </strong>
              <span>{result.percentage}% correct</span>
            </div>

            <p>
              {result.score === result.totalPoints
                ? "Excellent! You answered every question correctly."
                : result.score >= 70
                  ? "Great effort! Keep learning and growing."
                  : "Keep practising. Every quiz is a chance to learn."}
            </p>

            <div className="quiz-result-actions">
              <Link to="/leaderboard" className="leaderboard-result-link">
                <Trophy size={18} />
                View Leaderboard
              </Link>

              <button
                type="button"
                className="submit-quiz-button"
                onClick={handleReset}
              >
                Take Quiz Again
              </button>
            </div>
          </section>
        )}

        <p className="quiz-footer-note">
          Learn with devotion. Grow through knowledge.
        </p>
      </div>
    </main>
  );
}
