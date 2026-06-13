import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

// ── Customize Modal ──────────────────────────────────────────
function CustomizeModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    description: '', size: '12x16', medium: 'Acrylic',
    referenceUrl: '', budget: '', delivery: '',
  });
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const sizes = ['8x10', '12x16', '16x20', '18x24', '24x30', 'Custom'];
  const mediums = ['Acrylic', 'Oil', 'Watercolour', 'Mixed Media'];

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const buildWhatsApp = () => {
    const msg = encodeURIComponent(
      `Hi! I'd like a custom painting 🎨\n\nName: ${form.name}\nSize: ${form.size} in\nMedium: ${form.medium}\nDescription: ${form.description}\nBudget: ₹${form.budget}\nDelivery by: ${form.delivery}\nPhone: ${form.phone}`
    );
    return `https://wa.me/917973364858?text=${msg}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <div className="modal-header">
          <span className="modal-eyebrow">Commission Your Art</span>
          <h2>Customize Your <em>Own Painting</em></h2>
          <p>Tell us your vision — we'll paint it to life, just for you.</p>
        </div>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success-icon">🎨</div>
            <h3>Request Received!</h3>
            <p>We'll reach out within 24 hours to discuss your painting.</p>
            <div className="modal-contact-row">
              <a href={buildWhatsApp()} target="_blank" rel="noreferrer" className="modal-btn modal-btn--whatsapp">
                💬 Continue on WhatsApp
              </a>
              <a href="tel:+917973364858" className="modal-btn modal-btn--call">
                📞 Call Us
              </a>
            </div>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            {/* Row 1 */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Your Name *</label>
                <input name="name" required placeholder="Saumya Sharma"
                  value={form.name} onChange={handleChange} />
              </div>
              <div className="modal-field">
                <label>Phone Number *</label>
                <input name="phone" required placeholder="+91 99999 00000"
                  value={form.phone} onChange={handleChange} />
              </div>
            </div>

            {/* Row 2 */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Email</label>
                <input name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} />
              </div>
              <div className="modal-field">
                <label>Budget (₹) *</label>
                <input name="budget" required placeholder="e.g. 2000"
                  value={form.budget} onChange={handleChange} />
              </div>
            </div>

            {/* Size & Medium */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Canvas Size (inches) *</label>
                <div className="modal-size-grid">
                  {sizes.map((s) => (
                    <button type="button" key={s}
                      className={`modal-size-btn${form.size === s ? ' active' : ''}`}
                      onClick={() => setForm({ ...form, size: s })}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="modal-field">
                <label>Medium *</label>
                <div className="modal-size-grid">
                  {mediums.map((m) => (
                    <button type="button" key={m}
                      className={`modal-size-btn${form.medium === m ? ' active' : ''}`}
                      onClick={() => setForm({ ...form, medium: m })}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="modal-field modal-field--full">
              <label>Describe Your Vision *</label>
              <textarea name="description" required rows={3}
                placeholder="E.g. A sunrise over the mountains with warm golden tones, peaceful and spiritual mood…"
                value={form.description} onChange={handleChange} />
            </div>

            {/* Reference Photo */}
            <div className="modal-row">
              <div className="modal-field">
                <label>Upload Reference Photo (optional)</label>
                <div className="modal-upload" onClick={() => document.getElementById('ref-upload').click()}>
                  {preview
                    ? <img src={preview} alt="Reference" className="modal-preview-img" />
                    : <span>📎 Click to upload image</span>}
                  <input id="ref-upload" type="file" accept="image/*"
                    style={{ display: 'none' }} onChange={handleFile} />
                </div>
              </div>
              <div className="modal-field">
                <label>Delivery Needed By</label>
                <input name="delivery" type="date"
                  value={form.delivery} onChange={handleChange} />
                <label style={{ marginTop: '1rem' }}>Or share a reference link</label>
                <input name="referenceUrl" placeholder="Pinterest / Instagram link"
                  value={form.referenceUrl} onChange={handleChange} />
              </div>
            </div>

            {/* Submit */}
            <div className="modal-actions">
              <button type="submit" className="modal-btn modal-btn--primary">
                Submit Request ✦
              </button>
              <a href={buildWhatsApp()} target="_blank" rel="noreferrer"
                className="modal-btn modal-btn--whatsapp">
                💬 WhatsApp Instead
              </a>
              <a href="tel:+917973364858" className="modal-btn modal-btn--call">
                📞 Call Us
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Hero ─────────────────────────────────────────────────────
export default function Hero() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <section className="hero">
        {/* Ambient orbs */}
        <div className="hero-parallax-bg" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        {/* LEFT — Logo */}
        <div className="hero-left">
          <div className="hero-logo-wrap">
            <div className="hero-logo-glow" />
            <img
              src="/logo-main.png"
              alt="SabhayaArt Studio"
              className="hero-logo"
            />
          </div>
        </div>

        {/* RIGHT — Content */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            Luxury Handcrafted Paintings
          </div>

          <h1 className="hero-title">
            <span className="line">Where Art</span>
            <span className="line"><em>Meets Innovation</em></span>
          </h1>

          <p className="hero-sub">
            Discover handcrafted paintings designed to transform ordinary
            spaces into timeless masterpieces. Every artwork tells a story —
            bringing elegance, creativity, and emotion into your home.
          </p>

          <div className="hero-cta-row">
            <Link to="/shop" className="btn-primary">
              Explore Collection
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/about" className="btn-ghost">Our Story</Link>
            <button
              className="btn-customize"
              onClick={() => setShowModal(true)}
            >
              🎨 Customize Your Painting
            </button>
          </div>

          <div className="hero-stats">
            <div>
              <span className="hero-stat-num">62+</span>
              <span className="hero-stat-label">Paintings Sold</span>
            </div>
            <div>
              <span className="hero-stat-num">100%</span>
              <span className="hero-stat-label">Original Art</span>
            </div>
            <div>
              <span className="hero-stat-num">4.9★</span>
              <span className="hero-stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>

        {/* FEATURED PAINTING — "Every Day Ends In Hope" */}
        <div className="hero-painting-showcase">
          <div className="hero-painting-frame">
            <div className="hero-badge hero-badge1">
              <span className="hero-badge-val">₹599</span>
              <span className="hero-badge-lbl">Starting Price</span>
            </div>
            <Link to="/shop">
              <img
                src="/paintings/every-day-ends-in-hope.jpg"
                alt="Every Day Ends In Hope"
                onError={(e) => {
                  e.target.style.background = 'linear-gradient(135deg,#1a1f3a,#0d1120)';
                  e.target.style.minHeight = '220px';
                }}
              />
            </Link>
            <p className="hero-painting-label">"Every Day Ends In Hope"</p>
            <div className="hero-badge hero-badge2">
              <span className="hero-badge-val">12×16 in</span>
              <span className="hero-badge-lbl">Canvas Size</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customize Modal */}
      {showModal && <CustomizeModal onClose={() => setShowModal(false)} />}
    </>
  );
}