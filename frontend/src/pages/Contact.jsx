import { useState } from 'react';
import API from '../api/axios';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await API.post('/contact', form);
      setStatus('success');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  const whatsappLink = `https://wa.me/917973364858?text=${encodeURIComponent('Hi! I have a question about SabhayaArt.')}`;

  return (
    <div className="contact-page">
      <div className="contact-header">
        <span className="contact-eyebrow">Get in touch</span>
        <h1>We'd love to hear from you</h1>
        <p>Questions about an order, custom paintings, or just want to say hello — we're here.</p>
      </div>

      <div className="contact-body">
        {/* Info */}
        <div className="contact-info">
          <div className="contact-info-item">
            <span className="contact-info-icon">📧</span>
            <div>
              <h4>Email</h4>
              <p>sabhayart.com</p>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="contact-info-icon">📞</span>
            <div>
              <h4>Phone</h4>
              <p>+91 79733 64858</p>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="contact-info-icon">🕐</span>
            <div>
              <h4>Hours</h4>
              <p>Mon–Sat, 10am – 6pm IST</p>
            </div>
          </div>

          <div className="contact-info-item">
            <span className="contact-info-icon">📍</span>
            <div>
              <h4>Studio</h4>
              <p>Chandigarh, India</p>
            </div>
          </div>

          {/* Direct contact buttons */}
          <div className="contact-direct">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="contact-direct-btn contact-direct-btn--whatsapp"
            >
              💬 Chat on WhatsApp
            </a>
            <a
              href="tel:+917973364858"
              className="contact-direct-btn contact-direct-btn--call"
            >
              📞 Call Us Now
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="contact-form-wrap">
          {status === 'success' ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h3>Message sent!</h3>
              <p>We'll get back to you within 24 hours.</p>
              <button className="contact-btn" onClick={() => setStatus('idle')}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="contact-row">
                <div className="contact-field">
                  <label>Name</label>
                  <input name="name" type="text" required placeholder="Your name"
                    value={form.name} onChange={handleChange} />
                </div>
                <div className="contact-field">
                  <label>Email</label>
                  <input name="email" type="email" required placeholder="you@example.com"
                    value={form.email} onChange={handleChange} />
                </div>
              </div>
              <div className="contact-field">
                <label>Subject</label>
                <input name="subject" type="text" required placeholder="What's this about?"
                  value={form.subject} onChange={handleChange} />
              </div>
              <div className="contact-field">
                <label>Message</label>
                <textarea name="message" required rows={5} placeholder="Tell us more…"
                  value={form.message} onChange={handleChange} />
              </div>
              {status === 'error' && (
                <p className="contact-error">Something went wrong. Please try again.</p>
              )}
              <button type="submit" className="contact-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}