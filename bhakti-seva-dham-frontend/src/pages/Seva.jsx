
import React, { useState } from 'react';
import { Heart, HandHeart, ShieldCheck } from 'lucide-react';
import './Seva.css';

export default function Seva() {
  const [amount, setAmount] = useState('50');
  const [name, setName] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!name.trim()) {
      alert('Please enter your name.');
      return;
    }

    setConfirmed(true);
  }

  return (
    <main className="seva-page">
      <header className="seva-header">
        <span className="seva-badge">
          <Heart size={16} /> VOLUNTARY COMMUNITY SEVA
        </span>

        <h1>Serve with Devotion</h1>

        <p>
          Learn about community service and choose
          whether you would like to participate.
          Contributions are entirely optional.
        </p>
      </header>

      <section className="seva-card">
        <div className="seva-icon">
          <HandHeart size={38} />
        </div>

        <h2>Support Seva Activities</h2>

        <p className="seva-description">
          Every act of kindness matters. Choose an
          amount below for this demonstration.
        </p>

        {!confirmed ? (
          <form onSubmit={handleSubmit}>
            <label htmlFor="seva-name">Your name</label>

            <input
              id="seva-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your name"
              required
            />

            <span className="amount-label">
              Optional contribution amount
            </span>

            <div className="amount-options">
              {['50', '100', '200'].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={
                    amount === value ? 'amount-active' : ''
                  }
                  onClick={() => setAmount(value)}
                >
                  ₹{value}
                </button>
              ))}
            </div>

            <button className="seva-submit" type="submit">
              <Heart size={18} />
              Continue
            </button>
          </form>
        ) : (
          <div className="seva-success">
            <ShieldCheck size={34} />
            <h3>Thank you, {name}!</h3>
            <p>
              You selected ₹{amount} for the demonstration.
              No payment has been made or recorded.
            </p>
            <button onClick={() => setConfirmed(false)}>
              Back
            </button>
          </div>
        )}

        <p className="seva-disclaimer">
          This demo does not collect payments. Never use
          an unverified QR code or payment address.
        </p>
      </section>
    </main>
  );
}