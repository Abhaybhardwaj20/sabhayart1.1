import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-inner">
        <div className="footer-brand">
          <h2 className="footer-logo">SabhayaArt</h2>
          <p className="footer-tagline">
            Handcrafted canvas paintings, each one a story — painted with intention, made with love.
          </p>
          <div className="footer-socials">
            <a href="https://www.instagram.com/sabhayartt/" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="Instagram">📸</a>
            <a href="https://wa.me/917973364858" target="_blank" rel="noopener noreferrer" className="social-btn" aria-label="WhatsApp">💬</a>
            <a href="mailto:sabhayart@gmail.com" className="social-btn" aria-label="Email">✉️</a>
          </div>
        </div>

        <div className="footer-links">
          <div className="footer-col">
            <h3 className="footer-col-title">Shop</h3>
            <Link to="/shop">All Paintings</Link>
            <Link to="/shop?category=abstract">Abstract</Link>
            <Link to="/shop?category=nature">Nature</Link>
            <Link to="/shop?category=portrait">Portrait</Link>
            <Link to="/shop?category=floral">Floral</Link>
          </div>
          <div className="footer-col">
            <h3 className="footer-col-title">Company</h3>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQ</Link>
          </div>
          <div className="footer-col">
            <h3 className="footer-col-title">Legal</h3>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <div className="footer-col">
            <h3 className="footer-col-title">Contact</h3>
            <p className="footer-contact-text">📍 Chandigarh, India</p>
            <p className="footer-contact-text">📧 sabhayart@gmail.com</p>
            <p className="footer-contact-text">📱 +91 7973364858 </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} SabhayaArt. All rights reserved. Made with ❤️ in Chandigarh INDIA.</p>
        <div className="footer-pay-icons">
          <span className="pay-icon">UPI</span>
          <span className="pay-icon">Razorpay</span>
          <span className="pay-icon">COD</span>
        </div>
      </div>
    </footer>
  );
}