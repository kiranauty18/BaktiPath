import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Music2,
  Search,
  ChevronDown,
  Sparkles,
  Headphones,
  Heart,
} from "lucide-react";
import "./KathaBhajans.css";

const kathas = [
  {
    id: 1,
    title: "Shri Radha Raman Ji ka Prakatya Utsav",
    category: "Vrindavan",
    duration: "10 min read",
    description:
      "Discover the devotional tradition associated with Gopal Bhatta Goswami Ji and the appearance of Shri Radha Raman Ji.",
    fullText:
      "This katha reflects on the devotion of Gopal Bhatta Goswami Ji and the traditions surrounding Shri Radha Raman Ji in Vrindavan. Read it as an invitation to deepen your understanding of bhakti, humility, and loving remembrance of the Divine.",
  },
  {
    id: 2,
    title: "Banke Bihari Ji ki Divya Mahima",
    category: "Krishna Leela",
    duration: "12 min read",
    description:
      "Learn about Swami Haridas Ji and the devotional traditions of Shri Banke Bihari Ji in Vrindavan.",
    fullText:
      "The tradition of Shri Banke Bihari Ji is closely associated with Swami Haridas Ji, whose devotional music is remembered in the Braj tradition. This reading explores the place of devotion, music, and loving remembrance in Krishna bhakti.",
  },
  {
    id: 3,
    title: "Yamuna Ji aur Vrindavan Dham ki Mahima",
    category: "Braj Dham",
    duration: "8 min read",
    description:
      "Explore the spiritual significance of Yamuna Ji and the sacred land of Vrindavan in the Braj tradition.",
    fullText:
      "Yamuna Ji and Vrindavan hold a special place in many Vaishnava devotional traditions. This reflection introduces their spiritual significance and encourages readers to approach sacred places with reverence, gratitude, and care.",
  },
];

const bhajans = [
  {
    id: 1,
    title: "Shri Radhe Govind",
    singer: "Devotional Collection",
    category: "Bhajan",
    audioUrl: "/audio/radhe-govind.mp3",
  },
  {
    id: 2,
    title: "Banke Bihari Ji ki Aarti",
    singer: "Devotional Collection",
    category: "Aarti",
    audioUrl: "/audio/banke-bihari-aarti.mp3",
  },
  {
    id: 3,
    title: "Radha Raman Hari Bol",
    singer: "Devotional Collection",
    category: "Mantra",
    audioUrl: "/audio/radha-raman.mp3",
  },
];

const categories = ["All", "Bhajan", "Aarti", "Mantra"];

export default function KathaBhajans() {
  const [activeTab, setActiveTab] = useState("katha");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [expandedKatha, setExpandedKatha] = useState(null);

  const filteredKathas = useMemo(
    () =>
      kathas.filter((item) =>
        `${item.title} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(search.toLowerCase()),
      ),
    [search],
  );

  const filteredBhajans = useMemo(
    () =>
      bhajans.filter((item) => {
        const matchesSearch = `${item.title} ${item.singer} ${item.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesCategory =
          category === "All" || item.category === category;

        return matchesSearch && matchesCategory;
      }),
    [search, category],
  );

  function changeTab(tab) {
    setActiveTab(tab);
    setSearch("");
    setCategory("All");
  }

  return (
    <div className="kb-page">
      {/* Devotional Hero Section Restored */}
      <section className="kb-hero">
        <div className="kb-hero-overlay" />
        <div className="kb-hero-content">
          <span className="kb-eyebrow">
            <Sparkles size={14} />A place for devotion and wisdom
          </span>

          <h1>
            Katha, Bhajans
            <br />
            <span>&amp; Stuti</span>
          </h1>

          <p>
            Discover sacred stories, devotional music, and moments of peace
            through the timeless traditions of Sanatan Dharma.
          </p>

          <button
            type="button"
            className="kb-hero-button"
            onClick={() =>
              document
                .getElementById("kb-library")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <span>Explore the collection</span>
            <ChevronDown size={18} />
          </button>
        </div>

        <div className="kb-hero-note">
          <Heart size={16} />
          <span>Listen with devotion. Read with reflection.</span>
        </div>
      </section>

      {/* Library Section */}
      <section className="kb-library" id="kb-library">
        <div className="kb-section-heading">
          <span className="kb-overline">YOUR DEVOTIONAL LIBRARY</span>
          <h2>Explore &amp; Experience</h2>
          <p>Choose a katha to read or a bhajan to listen to.</p>
        </div>

        <div className="kb-tabs" role="tablist" aria-label="Library type">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "katha"}
            className={`kb-tab ${activeTab === "katha" ? "active" : ""}`}
            onClick={() => changeTab("katha")}
          >
            <BookOpen size={18} />
            <span>Daily Katha</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "bhajans"}
            className={`kb-tab ${activeTab === "bhajans" ? "active" : ""}`}
            onClick={() => changeTab("bhajans")}
          >
            <Music2 size={18} />
            <span>Bhajans &amp; Mantras</span>
          </button>
        </div>

        <div className="kb-toolbar">
          <label className="kb-search">
            <Search size={18} />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                activeTab === "katha"
                  ? "Search kathas..."
                  : "Search devotional music..."
              }
              aria-label="Search collection"
            />
          </label>

          {activeTab === "bhajans" && (
            <div className="kb-filters" aria-label="Filter by category">
              {categories.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={`kb-filter ${category === item ? "selected" : ""}`}
                  onClick={() => setCategory(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeTab === "katha" ? (
          <div className="kb-katha-grid">
            {filteredKathas.map((item, index) => {
              const isExpanded = expandedKatha === item.id;

              return (
                <article className="kb-katha-card" key={item.id}>
                  <div className="kb-card-top">
                    <span className="kb-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="kb-category">{item.category}</span>
                  </div>

                  <div className="kb-card-icon">
                    <BookOpen size={24} />
                  </div>

                  <h3>{item.title}</h3>
                  <p className="kb-card-description">{item.description}</p>

                  {isExpanded && (
                    <div className="kb-full-text">
                      <p>{item.fullText}</p>
                    </div>
                  )}

                  <div className="kb-card-bottom">
                    <span>{item.duration}</span>
                    <button
                      type="button"
                      className="kb-read-button"
                      aria-expanded={isExpanded}
                      onClick={() =>
                        setExpandedKatha(isExpanded ? null : item.id)
                      }
                    >
                      <span>{isExpanded ? "Read less" : "Read katha"}</span>
                      <ChevronDown
                        size={16}
                        className={isExpanded ? "kb-chevron-up" : ""}
                      />
                    </button>
                  </div>
                </article>
              );
            })}

            {filteredKathas.length === 0 && (
              <p className="kb-empty">No kathas found. Try another search.</p>
            )}
          </div>
        ) : (
          <div className="kb-bhajan-list">
            {filteredBhajans.map((item, index) => (
              <article className="kb-bhajan-card" key={item.id}>
                <div className="kb-track-number">
                  {String(index + 1).padStart(2, "0")}
                </div>

                <div className="kb-music-icon">
                  <Music2 size={22} />
                </div>

                <div className="kb-track-info">
                  <span className="kb-track-category">{item.category}</span>
                  <h3>{item.title}</h3>
                  <p>{item.singer}</p>
                </div>

                <div className="kb-audio-area">
                  <audio
                    controls
                    preload="none"
                    aria-label={`Play ${item.title}`}
                  >
                    <source src={item.audioUrl} type="audio/mpeg" />
                    Your browser does not support audio playback.
                  </audio>
                </div>
              </article>
            ))}

            {filteredBhajans.length === 0 && (
              <p className="kb-empty">
                No tracks found. Try another search or category.
              </p>
            )}
          </div>
        )}

        <div className="kb-bottom-note">
          <Headphones size={22} />
          <div>
            <strong>Make time for devotion</strong>
            <p>
              Return whenever you need a quiet moment for reading, reflection,
              or prayer.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
