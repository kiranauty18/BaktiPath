import React, { useState } from 'react';
import { Award, Sparkles, User } from 'lucide-react';
import './Quiz.css';

export default function Quiz() {
  const [userName, setUserName] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const quizQuestions = [
    {
      id: 1,
      question: "Shri Radha Raman Ji ka prakatya utsav kahan aur kiske dwara hua tha?",
      options: [
        "A) Gopal Bhatta Goswami, Vrindavan mein",
        "B) Swami Haridas, Banke Bihari Mandir mein",
        "C) Chaitanya Mahaprabhu, Puri mein",
        "D) Rupa Goswami, Govardhan mein"
      ],
      correct: 0
    },
    {
      id: 2,
      question: "Banke Bihari Ji ki nitya lila aur aarti kis sthan par hoti hai?",
      options: [
        "A) Barsana",
        "B) Vrindavan",
        "C) Goverdhan",
        "D) Nandgaon"
      ],
      correct: 1
    },
    {
      id: 3,
      question: "Sanatan Dharma mein Yamuna Maharani kiska swaroop mani jati hain?",
      options: [
        "A) Surya Putri / Pavitra Nadi",
        "B) Ganga ji ki behan",
        "C) Devlok ki apsara",
        "D) Inmein se koi nahi"
      ],
      correct: 0
    },
    {
      id: 4,
      question: "Shrimad Bhagavad Gita mein kul kitne adhyay (chapters) hain?",
      options: [
        "A) 12",
        "B) 15",
        "C) 18",
        "D) 20"
      ],
      correct: 2
    },
    {
      id: 5,
      question: "Shri Radha Rani ka prakatya sthal kahan mana jata hai?",
      options: [
        "A) Mathura",
        "B) Barsana",
        "C) Gokul",
        "D) Vrindavan"
      ],
      correct: 1
    }
  ];

  const handleOptionChange = (questionId, optionIndex) => {
    if (!isSubmitted) {
      setUserAnswers({
        ...userAnswers,
        [questionId]: optionIndex
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) {
      alert("Kripya quiz submit karne se pehle apna Naam (Devotee Name) darj karein!");
      return;
    }
    if (Object.keys(userAnswers).length === 0) {
      alert("Kripya kam se kam ek question ka jawab dein!");
      return;
    }

    let calculatedScore = 0;
    quizQuestions.forEach((q) => {
      if (userAnswers[q.id] === q.correct) {
        calculatedScore += 10;
      }
    });

    setScore(calculatedScore);
    setIsSubmitted(true);

    // Save score to Leaderboard local storage
    const existingLeaderboard = JSON.parse(localStorage.getItem('quiz_leaderboard') || '[]');
    const userIndex = existingLeaderboard.findIndex(item => item.name.toLowerCase() === userName.trim().toLowerCase());
    
    if (userIndex !== -1) {
      existingLeaderboard[userIndex].score = calculatedScore;
    } else {
      existingLeaderboard.push({ name: userName.trim(), score: calculatedScore });
    }

    existingLeaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem('quiz_leaderboard', JSON.stringify(existingLeaderboard));
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setUserAnswers({});
    setUserName('');
    setScore(0);
  };

  return (
    <div className="quiz-page">
      <div className="quiz-container">
        
        {/* Header */}
        <div className="quiz-header">
          <div className="quiz-badge">
            <Sparkles size={15} />
            <span>DAILY KATHA QUIZ</span>
          </div>
          <h1>Shri Radha Raman &amp; Banke Bihari Quiz</h1>
          <p>Sahi vikalp chunein, apna naam likhein aur score leaderboard par darj karein.</p>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            
            {/* User Name Input Card */}
            <div className="quiz-card">
              <div className="quiz-name-field">
                <label>
                  <User size={16} />
                  <span>Aapka Naam (Devotee Name) *</span>
                </label>
                <input 
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Apna poora naam yahan likhein..."
                  required
                />
              </div>
            </div>

            {/* Questions Card */}
            <div className="quiz-card">
              {quizQuestions.map((q, index) => (
                <div key={q.id} className="quiz-question-block" style={{ marginTop: index === 0 ? 0 : '22px' }}>
                  <div className="quiz-card-heading">
                    <span className="quiz-question-number">Question {index + 1} of {quizQuestions.length}</span>
                    <span className="points-badge">10 Points</span>
                  </div>
                  
                  <h3 className="quiz-question">
                    {q.question}
                  </h3>

                  <div className="quiz-options">
                    {q.options.map((option, optIdx) => (
                      <label 
                        key={optIdx}
                        className={`quiz-option-label ${userAnswers[q.id] === optIdx ? 'selected' : ''}`}
                      >
                        <input 
                          type="radio"
                          name={`question-${q.id}`}
                          checked={userAnswers[q.id] === optIdx}
                          onChange={() => handleOptionChange(q.id, optIdx)}
                        />
                        <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                        <span className="option-text">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                className="submit-quiz-button"
              >
                <span>Submit Answers &amp; Save Score</span>
              </button>
            </div>

          </form>
        ) : (
          /* Result Card */
          <div className="quiz-card quiz-result-card">
            <div className="quiz-result-icon">
              <Award size={46} />
            </div>
            
            <h2 style={{ color: 'var(--burgundy)', fontSize: '28px', marginBottom: '8px' }}>Radhe Radhe, {userName} ji!</h2>
            <p style={{ color: 'var(--muted-brown)' }}>Aapka quiz score safalpurvak Leaderboard par jodd diya gaya hai.</p>

            <div className="quiz-score-display">
              <span>Aapka Score</span>
              <strong>{score} / {quizQuestions.length * 10} pts</strong>
            </div>

            <div className="quiz-result-actions">
              <a
                href="/leaderboard"
                className="leaderboard-result-link"
              >
                View Leaderboard Ranking →
              </a>
              <button
                onClick={handleReset}
                className="submit-quiz-button"
                style={{ margin: 0, minHeight: '48px', width: 'auto', padding: '12px 24px' }}
              >
                Retake Quiz
              </button>
            </div>
          </div>
        )}

        <div className="quiz-footer-note">
          Shri Radha Raman &amp; Banke Bihari Ji ki kripa se sanchalit
        </div>

      </div>
    </div>
  );
}