import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

import {
  Award,
  BookOpen,
  Gift,
  Heart,
  MessageCircle,
  Camera,
  ArrowRight,
} from 'lucide-react';

export default function Home() {
  return (
    <main className="home-page">
      <section className="hero-section">
        <span className="welcome-badge">
          Jai Shri Radhe Krishna
        </span>

        <h1>Bhakti Seva Dham</h1>

        <p className="hero-description">
          Connect with Shri Radha Raman Ji, Banke Bihari Ji,
          devotional stories, spiritual knowledge and seva.
        </p>

        <div className="hero-actions">
          <Link className="primary-button" to="/quiz">
            Play Today's Quiz <ArrowRight size={18} />
          </Link>

          <Link className="secondary-button" to="/seva">
            <Heart size={18} /> Explore Seva
          </Link>
        </div>
      </section>

      <section className="activities-section">
        <div className="section-heading">
          <span>OUR SPIRITUAL COMMUNITY</span>
          <h2>Explore Bhakti & Seva</h2>
          <p>Learn, participate and grow in devotion.</p>
        </div>

        <div className="activity-grid">
          <article className="activity-card">
            <div className="activity-icon">
              <Award size={30} />
            </div>
            <h3>Daily Quiz</h3>
            <p>
              Test your knowledge of devotional stories
              and follow your quiz progress.
            </p>
            <Link to="/quiz">Explore Quiz →</Link>
          </article>

          <article className="activity-card">
            <div className="activity-icon">
              <BookOpen size={30} />
            </div>
            <h3>Katha & Bhajans</h3>
            <p>
              Discover spiritual notes, devotional songs
              and stories from Sanatan Dharma.
            </p>
            <Link to="/katha-bhajans">Explore Katha →</Link>
          </article>

          <article className="activity-card">
            <div className="activity-icon">
              <Gift size={30} />
            </div>
            <h3>Seva Activities</h3>
            <p>
              Learn about community service, devotional
              activities and upcoming events.
            </p>
            <Link to="/seva">Explore Seva →</Link>
          </article>
        </div>
      </section>

      <section className="connect-section">
        <h2>Stay Connected</h2>
        <p>
          Follow our updates and stay connected with
          the Bhakti Seva Dham community.
        </p>

        <div className="social-links">
          <a
            href="https://instagram.com/dhiru.x.indresh"
            target="_blank"
            rel="noreferrer"
          >
            <Camera size={20} /> Instagram
          </a>

          <a
            href="https://chat.whatsapp.com/Cdev6EaEmRLGQMg310XCFs?s=cl&p=a&mlu=4&ilr=4"
            target="_blank"
            rel="noreferrer"
          >
            <MessageCircle size={20} /> WhatsApp
          </a>
        </div>
      </section>

      <footer className="home-footer">
        <h3>Bhakti Seva Dham</h3>
        <p>Serving with devotion, sharing with kindness.</p>
      </footer>
    </main>
  );
}