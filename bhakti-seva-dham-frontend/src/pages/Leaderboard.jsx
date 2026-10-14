
import { useEffect, useState } from "react";
import { Trophy, Medal, Crown, Award, Search, RefreshCw } from "lucide-react";
import "./Leaderboard.css";

const STORAGE_KEY = "bhaktiQuizResults";

export default function Leaderboard() {
  const [participants, setParticipants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  function loadParticipants() {
    try {
      const saved = JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );

      if (!Array.isArray(saved)) {
        setParticipants([]);
        return;
      }

      const validResults = saved.filter(
        (item) =>
          item &&
          typeof item.name === "string" &&
          Number.isFinite(item.score)
      );

      validResults.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        return new Date(a.date || 0) - new Date(b.date || 0);
      });

      setParticipants(
        validResults.map((person, index) => ({
          ...person,
          rank: index + 1,
          points: person.score,
        }))
      );
    } catch (error) {
      console.error("Unable to load leaderboard:", error);
      setParticipants([]);
    }
  }

  useEffect(() => {
    loadParticipants();

    function handleStorageChange(event) {
      if (event.key === STORAGE_KEY) {
        loadParticipants();
      }
    }

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const filteredParticipants = participants.filter((person) =>
    person.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Keep the familiar second-first-third podium layout.
  const winners = [
    filteredParticipants.find((person) => person.rank === 2),
    filteredParticipants.find((person) => person.rank === 1),
    filteredParticipants.find((person) => person.rank === 3),
  ].filter(Boolean);

  return (
    <main className="leaderboard-page">
      <header className="leaderboard-header">
        <span className="leaderboard-badge">
          <Trophy size={16} /> QUIZ RANKINGS
        </span>

        <h1>Top Devotees</h1>

        <p>
          Celebrate dedication, spiritual learning, and quiz achievements.
        </p>

        <button
          type="button"
          className="leaderboard-refresh"
          onClick={loadParticipants}
        >
          <RefreshCw size={16} />
          Refresh Results
        </button>
      </header>

      {filteredParticipants.length > 0 && (
        <section className="winner-grid">
          {winners.map((person) => (
            <article
              key={person.id || `${person.name}-${person.rank}`}
              className={`winner-card winner-${person.rank}`}
            >
              <div className="winner-icon">
                {person.rank === 1 ? (
                  <Crown size={32} />
                ) : (
                  <Medal size={32} />
                )}
              </div>

              <span className="winner-place">
                {person.rank === 1
                  ? "1st Place"
                  : person.rank === 2
                    ? "2nd Place"
                    : "3rd Place"}
              </span>

              <h2>{person.name}</h2>

              <div className="winner-points">
                {person.points} Points
              </div>

              <span className="winner-percentage">
                {person.percentage ??
                  (person.totalPoints
                    ? Math.round(
                        (person.score / person.totalPoints) * 100
                      )
                    : 0)}
                % correct
              </span>
            </article>
          ))}
        </section>
      )}

      <section className="ranking-card">
        <div className="ranking-heading">
          <Award size={23} />

          <div>
            <h2>All Participants</h2>
            <p>
              {participants.length} quiz{" "}
              {participants.length === 1 ? "submission" : "submissions"} saved
            </p>
          </div>
        </div>

        <div className="ranking-search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Search participant name..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            aria-label="Search participants"
          />
        </div>

        {filteredParticipants.length === 0 ? (
          <div className="leaderboard-empty">
            <Trophy size={38} />

            <h3>
              {participants.length === 0
                ? "No quiz results yet"
                : "No participants found"}
            </h3>

            <p>
              {participants.length === 0
                ? "Complete the daily quiz to appear on the leaderboard."
                : "Try another name in the search field."}
            </p>
          </div>
        ) : (
          <div className="ranking-list">
            {filteredParticipants.map((person) => (
              <article
                className="ranking-row"
                key={person.id || `${person.name}-${person.rank}`}
              >
                <span className="rank-number">
                  {person.rank === 1 ? (
                    <Crown size={21} />
                  ) : person.rank === 2 || person.rank === 3 ? (
                    <Medal size={21} />
                  ) : (
                    person.rank
                  )}
                </span>

                <div className="participant-info">
                  <strong>{person.name}</strong>

                  <span>
                    {person.date
                      ? `Submitted ${new Date(person.date).toLocaleDateString()}`
                      : "Quiz participant"}
                  </span>
                </div>

                <strong className="ranking-points">
                  {person.points} / {person.totalPoints ?? "—"} pts
                </strong>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="leaderboard-note">
        Keep learning, keep participating, and keep serving.
      </p>
    </main>
  );
}
