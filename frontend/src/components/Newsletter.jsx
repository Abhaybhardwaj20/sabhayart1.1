import React, { useState } from 'react';
import './Newsletter.css';

export default function Newsletter() {
  const [email, setEmail]     = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    // TODO: connect to backend /api/newsletter
    setSubmitted(true);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-glow" />
      <div className="newsletter-inner">
        {submitted ? (
          <div className="newsletter-success">
            <span className="success-emoji">🎨</span>
            <h3>You're in!</h3>
            <p>Thank you for joining. Watch your inbox for exclusive drops and early access.</p>
          </div>
        ) : (
          <>
            <div className="newsletter-eyebrow">Stay in the loop</div>
            <h2 className="newsletter-title">
              First to know. <em>First to own.</em>
            </h2>
            <p className="newsletter-sub">
              New collections, limited editions, and exclusive offers — straight to your inbox.
            </p>
            <form className="newsletter-form" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="newsletter-input"
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </form>
            <p className="newsletter-note">No spam. Unsubscribe anytime.</p>
          </>
        )}
      </div>
    </section>
  );
}