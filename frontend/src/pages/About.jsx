import { Link } from 'react-router-dom';
import './About.css';

export default function About() {
  return (
    <div className="about-page">

      {/* Hero */}
      <section className="about-hero">
        <div className="about-hero-content">
          <span className="about-eyebrow">Our Story</span>
          <h1>Handcrafted with heart,<br />painted with purpose</h1>
          <p>
            Sabhaya Paintings brings original canvas art directly from the
            artist's studio to your home. Every brushstroke is intentional.
            Every piece is one of a kind.
          </p>
          <Link to="/shop" className="about-cta">Explore the collection</Link>
        </div>
        <div className="about-hero-img">
          {/* Logo in hero circle */}
          <div className="about-img-placeholder">
            <img src="/logo-main.png" alt="SabhayaArt Studio" className="about-logo-img" />
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="about-trust">
        <div className="about-trust-grid">
          <div className="about-trust-item">
            <span className="about-trust-icon">🔒</span>
            <strong>Secure Payments</strong>
            <p>UPI, Cards & Net Banking — all transactions are 100% safe and encrypted.</p>
          </div>
          <div className="about-trust-item">
            <span className="about-trust-icon">🚚</span>
            <strong>Free Shipping Above ₹999</strong>
            <p>Your painting arrives carefully packed and delivered right to your door.</p>
          </div>
          <div className="about-trust-item">
            <span className="about-trust-icon">✅</span>
            <strong>100% Original Art</strong>
            <p>Every piece is hand-painted and comes with a certificate of authenticity.</p>
          </div>
          <div className="about-trust-item">
            <span className="about-trust-icon">💬</span>
            <strong>Dedicated Support</strong>
            <p>Got questions? Reach us on WhatsApp or call — we reply within hours.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="about-values">
        <div className="about-values-grid">
          <div className="about-value-card">
            <span className="about-value-icon">🖌️</span>
            <h3>100% Handcrafted</h3>
            <p>Every painting is hand-painted on premium canvas. No prints, no reproductions — only original art.</p>
          </div>
          <div className="about-value-card">
            <span className="about-value-icon">📦</span>
            <h3>Carefully Packaged</h3>
            <p>Each piece is wrapped with care to ensure it reaches you in perfect condition, ready to hang.</p>
          </div>
          <div className="about-value-card">
            <span className="about-value-icon">🌿</span>
            <h3>Sustainable Materials</h3>
            <p>We use eco-friendly, non-toxic paints and sustainably sourced canvas in every artwork.</p>
          </div>
          <div className="about-value-card">
            <span className="about-value-icon">🎨</span>
            <h3>Custom Commissions</h3>
            <p>Want something made just for you? We take custom orders — your vision, our brushstrokes.</p>
          </div>
        </div>
      </section>

      {/* Artist section — Saumya Sharma */}
      <section className="about-artist">
        <div className="about-artist-inner">
          <div className="about-artist-portrait">
            <img src="/logo-main.png" alt="SabhayaArt" className="about-artist-logo" />
          </div>
          <div className="about-artist-content">
            <span className="about-eyebrow">The Artist</span>
            <h2>Saumya Sharma</h2>
            <p className="about-artist-tagline">Painter · Creator · Storyteller</p>
            <p className="about-artist-bio">
              Based in Chandigarh, I paint to communicate what words cannot. Each canvas
              begins as a feeling — a moment of stillness, wonder, or unrest — and slowly
              takes shape through layers of pigment and patience. My work spans abstract
              explorations, emotional portraits, and landscapes that breathe.
            </p>
            <div className="about-artist-stats">
              <div className="about-artist-stat">
                <span className="about-stat-num">62+</span>
                <span className="about-stat-lbl">Paintings Sold</span>
              </div>
              <div className="about-artist-stat">
                <span className="about-stat-num">5 yrs</span>
                <span className="about-stat-lbl">Experience</span>
              </div>
              <div className="about-artist-stat">
                <span className="about-stat-num">8</span>
                <span className="about-stat-lbl">Art Series</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <div className="about-mission-inner">
          <h2>Why Sabhaya?</h2>
          <p>
            The word <em>Sabhaya</em> means graceful and dignified. We believe art should
            feel exactly that — a quiet presence in your space that brings warmth, depth,
            and meaning every single day.
          </p>
          <p>
            We started with a simple belief: beautiful, original paintings shouldn't be
            reserved for galleries or collectors. They belong in living rooms, bedrooms,
            offices — wherever people spend their lives.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="about-bottom-cta">
        <h2>Find your painting</h2>
        <p>Browse our full collection of handcrafted canvas paintings — starting from ₹299.</p>
        <div className="about-cta-row">
          <Link to="/shop" className="about-cta">Shop Now</Link>
          <Link to="/contact" className="about-cta about-cta--outline">Contact Us</Link>
        </div>
      </section>

    </div>
  );
}