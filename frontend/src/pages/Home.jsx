import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import PaintingCard from '../components/PaintingCard';
import ReviewCard from '../components/ReviewCard';
import Newsletter from '../components/Newsletter';
import { paintings, getFeatured } from '../data/paintings';
import { categories } from '../data/categories';
import { testimonials } from '../data/testimonials';
import './Home.css';

// ─── Customize Modal ────────────────────────────────────────
function CustomizeModal({ onClose }) {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    description: '', size: '12x16', medium: 'Acrylic',
    referenceUrl: '', budget: '', delivery: '',
  });
  const [preview, setPreview] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const sizes   = ['8×10', '12×16', '16×20', '18×24', '24×30', 'Custom'];
  const mediums = ['Acrylic', 'Oil', 'Watercolour', 'Mixed Media'];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
              <a href={buildWhatsApp()} target="_blank" rel="noreferrer"
                className="modal-btn modal-btn--whatsapp">
                💬 Continue on WhatsApp
              </a>
              <a href="tel:+917973364858" className="modal-btn modal-btn--call">
                📞 Call Us
              </a>
            </div>
          </div>
        ) : (
          <form className="modal-form" onSubmit={handleSubmit}>
            <div className="modal-row">
              <div className="modal-field">
                <label>Your Name *</label>
                <input name="name" required placeholder="Your full name"
                  value={form.name} onChange={handleChange} />
              </div>
              <div className="modal-field">
                <label>Phone Number *</label>
                <input name="phone" required placeholder="+91 99999 00000"
                  value={form.phone} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label>Email</label>
                <input name="email" type="email" placeholder="you@example.com"
                  value={form.email} onChange={handleChange} />
              </div>
              <div className="modal-field">
                <label>Budget (₹) *</label>
                <input name="budget" required placeholder="e.g. 1500"
                  value={form.budget} onChange={handleChange} />
              </div>
            </div>

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

            <div className="modal-field modal-field--full">
              <label>Describe Your Vision *</label>
              <textarea name="description" required rows={3}
                placeholder="E.g. A sunrise over the mountains with warm golden tones, peaceful and spiritual mood…"
                value={form.description} onChange={handleChange} />
            </div>

            <div className="modal-row">
              <div className="modal-field">
                <label>Upload Reference Photo (optional)</label>
                <div className="modal-upload"
                  onClick={() => document.getElementById('ref-upload').click()}>
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
                <label style={{ marginTop: '12px' }}>Reference Link (optional)</label>
                <input name="referenceUrl" placeholder="Pinterest / Instagram link"
                  value={form.referenceUrl} onChange={handleChange} />
              </div>
            </div>

            <div className="modal-actions">
              <button type="submit" className="modal-btn modal-btn--primary">
                Submit Request ✦
              </button>
              <a href={buildWhatsApp()} target="_blank" rel="noreferrer"
                className="modal-btn modal-btn--whatsapp">
                💬 WhatsApp
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

// ─── Home ────────────────────────────────────────────────────
export default function Home() {
  const navigate   = useNavigate();
  const dispatch   = useDispatch();
  const [showModal, setShowModal] = useState(false);

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const featured    = getFeatured().slice(0, 3);
  const newArrivals = paintings.filter(p => p.badge === 'new').slice(0, 4);
  const bestSellers = paintings.filter(p => p.badge === 'bestseller').slice(0, 4);

  // Featured painting for hero showcase — "Every Day Ends In Hope" or first painting
  const heroFeature = paintings.find(p =>
    p.title?.toLowerCase().includes('hope') ||
    p.title?.toLowerCase().includes('every day')
  ) || paintings[0];

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-parallax-bg" />
        <div className="orb orb1" />
        <div className="orb orb2" />
        <div className="orb orb3" />

        {/* Left — floating logo, shifted left */}
        <div className="hero-left">
          <div className="hero-logo-wrap">
            <div className="hero-logo-glow" />
            <img
              src="/logo-main.png"
              alt="SabhayaArt"
              className="hero-logo"
              onError={e => { e.target.src = '/logo.png'; }}
            />
          </div>
        </div>

        {/* Right — content */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-line" />
            Luxury Handcrafted Paintings
          </div>

          {/* FIX: em on same line as span — no overflow:hidden on .line */}
          <h1 className="hero-title">
            <span className="line">Where Art</span>
            <span className="line"><em>Meets Innovation</em></span>
          </h1>

          <p className="hero-sub">
            Discover handcrafted paintings designed to transform ordinary spaces
            into timeless masterpieces. Every artwork tells a story — bringing
            elegance, creativity, and emotion into your home.
          </p>

          <div className="hero-cta-row">
            <Link to="/shop" className="btn-primary">
              <span>Explore Collection</span>
              <span className="btn-arrow">→</span>
            </Link>
            <Link to="/about" className="btn-ghost">Our Story</Link>
            <button className="btn-customize" onClick={() => setShowModal(true)}>
              🎨 Customize
            </button>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-num">62+</span>
              <span className="hero-stat-label">Paintings Sold</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">100%</span>
              <span className="hero-stat-label">Original Art</span>
            </div>
            <div className="hero-stat">
              <span className="hero-stat-num">4.9★</span>
              <span className="hero-stat-label">Avg. Rating</span>
            </div>
          </div>
        </div>

        {/* Floating painting showcase — "Every Day Ends In Hope" */}
        <div className="hero-painting-showcase">
          <div className="hero-painting-frame">
            <div className="hero-badge hero-badge1">
              <span className="hero-badge-val">
                ₹{heroFeature?.price?.toLocaleString('en-IN') || '599'}
              </span>
              <span className="hero-badge-lbl">Starting price</span>
            </div>
            <Link to={`/product/${heroFeature?.id}`}>
              <img
                src={heroFeature?.image || '/paintings/placeholder.jpg'}
                alt={heroFeature?.title || 'Featured painting'}
                onError={e => { e.target.src = '/paintings/placeholder.jpg'; }}
              />
            </Link>
            <p className="hero-painting-label">"{heroFeature?.title}"</p>
            <div className="hero-badge hero-badge2">
              <span className="hero-badge-val">✦ {heroFeature?.size || '12×16 in'}</span>
              <span className="hero-badge-lbl">Canvas size</span>
            </div>
          </div>
        </div>
      </section>

      {/* Customize Modal */}
      {showModal && <CustomizeModal onClose={() => setShowModal(false)} />}

      {/* ── TRUST BAR ── */}
      <div className="trust-bar">
        {[
          { icon: '🎨', title: '100% Handcrafted',  sub: 'Every painting made by hand' },
          { icon: '📦', title: 'Safe Packaging',     sub: 'Delivered bubble-wrapped' },
          { icon: '↩️', title: '7-Day Returns',      sub: 'Hassle-free if damaged' },
          { icon: '💳', title: 'Secure Payments',    sub: 'UPI, Cards & COD' },
        ].map((t, i) => (
          <div key={i} className="trust-item">
            <span className="trust-icon">{t.icon}</span>
            <div className="trust-label">
              <strong>{t.title}</strong>
              {t.sub}
            </div>
          </div>
        ))}
      </div>

      {/* ── CATEGORIES ── */}
      <section className="section reveal">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Browse by theme</div>
            <h2 className="section-title">Explore <em>Categories</em></h2>
          </div>
          <Link to="/shop" className="see-all">See All →</Link>
        </div>
        <div className="categories-grid">
          {categories.map(cat => (
            <Link key={cat.id} to={`/shop?category=${cat.id}`} className="category-card">
              <div className="category-img-wrap">
                <img src={cat.image} alt={cat.label}
                  onError={e => e.target.style.opacity = '0'} />
                <div className="category-overlay" />
              </div>
              <div className="category-body">
                <span className="category-emoji">{cat.emoji}</span>
                <span className="category-label">{cat.label}</span>
                <span className="category-count">{cat.count} works</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── FEATURED / EDITORIAL ── */}
      <section className="section section-dark reveal">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Curated picks</div>
            <h2 className="section-title">Featured <em>Works</em></h2>
          </div>
        </div>
        <div className="featured-grid">
          {featured[0] && (
            <div className="featured-main"
              onClick={() => navigate(`/product/${featured[0].id}`)}
              style={{ cursor: 'pointer' }}>
              <img src={featured[0].image} alt={featured[0].title}
                onError={e => e.target.style.opacity = '0'} />
              <div className="featured-overlay" />
              <div className="featured-content">
                <div className="featured-tag">{featured[0].category} · {featured[0].badge}</div>
                <h3 className="featured-title">{featured[0].title}</h3>
                <div className="featured-price">₹{featured[0].price.toLocaleString('en-IN')}</div>
              </div>
            </div>
          )}
          <div className="featured-stack">
            {featured.slice(1, 3).map(p => (
              <div key={p.id} className="featured-mini"
                onClick={() => navigate(`/product/${p.id}`)}
                style={{ cursor: 'pointer' }}>
                <img src={p.image} alt={p.title}
                  onError={e => e.target.style.opacity = '0'} />
                <div className="featured-mini-overlay" />
                <div className="featured-mini-content">
                  <div className="featured-mini-title">{p.title}</div>
                  <div className="featured-mini-price">₹{p.price.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEW ARRIVALS ── */}
      <section className="section reveal">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Just arrived</div>
            <h2 className="section-title">New <em>Arrivals</em></h2>
          </div>
          <Link to="/shop?badge=new" className="see-all">View All →</Link>
        </div>
        <div className="grid">
          {(newArrivals.length ? newArrivals : paintings.slice(0, 4)).map(p => (
            <PaintingCard key={p.id} painting={p} />
          ))}
        </div>
      </section>

      {/* ── BESTSELLERS ── */}
      <section className="section section-alt reveal">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">Loved by collectors</div>
            <h2 className="section-title">Best <em>Sellers</em></h2>
          </div>
          <Link to="/shop?badge=bestseller" className="see-all">View All →</Link>
        </div>
        <div className="grid">
          {(bestSellers.length ? bestSellers : paintings.slice(4, 8)).map(p => (
            <PaintingCard key={p.id} painting={p} />
          ))}
        </div>
      </section>

      {/* ── ABOUT ARTIST STRIP ── */}
      <section className="about-section reveal">
        <div className="about-grid">
          <div className="artist-portrait">
            <img src="/logo-main.png" alt="SabhayaArt"
              onError={e => { e.target.src = '/logo.png'; }} />
          </div>
          <div>
            <div className="about-eyebrow">The Artist</div>
            <h2 className="about-title">Saumya Sharma</h2>
            <p className="about-subtitle">Painter · Creator · Storyteller</p>
            <p className="about-text">
              Based in Chandigarh, I paint to communicate what words cannot. Each canvas begins
              as a feeling — a moment of stillness, wonder, or unrest — and slowly takes shape
              through layers of pigment and patience. My work spans abstract explorations,
              emotional portraits, and landscapes that breathe.
            </p>
            <div className="about-highlights">
              {[
                { num: '62+',   label: 'Paintings Sold' },
                { num: '5 yrs', label: 'Experience' },
                { num: '8',     label: 'Art Series' },
              ].map((h, i) => (
                <div key={i} className="highlight">
                  <span className="highlight-num">{h.num}</span>
                  <span className="highlight-label">{h.label}</span>
                </div>
              ))}
            </div>
            <Link to="/about" className="btn-ghost"
              style={{ marginTop: '24px', display: 'inline-flex' }}>
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section reveal">
        <div className="section-header">
          <div>
            <div className="section-eyebrow">What collectors say</div>
            <h2 className="section-title">Stories of <em>Joy</em></h2>
          </div>
        </div>
        <div className="testimonials-grid">
          {testimonials.map(t => <ReviewCard key={t.id} review={t} />)}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <Newsletter />

    </div>
  );
}