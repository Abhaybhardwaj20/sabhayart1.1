import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './WelcomeModal.css';

const STORAGE_KEY = 'sabhaya_welcome_seen';

export default function WelcomeModal() {
  const navigate        = useNavigate();
  const isLoggedIn      = useSelector(s => s.auth.isLoggedIn);
  const [visible,   setVisible]   = useState(false);
  const [animOut,   setAnimOut]   = useState(false);
  const [copied,    setCopied]    = useState(false);
  const COUPON = 'WELCOME100';

  useEffect(() => {
    // Don't show if already logged in or already seen
    if (isLoggedIn) return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 2800);
    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  const close = () => {
    setAnimOut(true);
    sessionStorage.setItem(STORAGE_KEY, '1');
    setTimeout(() => setVisible(false), 400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(COUPON).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSignup = () => {
    close();
    navigate('/signup');
  };

  const handleLogin = () => {
    close();
    navigate('/login');
  };

  if (!visible) return null;

  return (
    <div className={`wm-backdrop${animOut ? ' wm-out' : ''}`} onClick={e => e.target === e.currentTarget && close()}>
      <div className={`wm-modal${animOut ? ' wm-modal-out' : ''}`} role="dialog" aria-modal="true" aria-label="Welcome offer">

        {/* Close */}
        <button className="wm-close" onClick={close} aria-label="Close">✕</button>

        {/* Top decoration */}
        <div className="wm-top-deco">
          <div className="wm-orb wm-orb1" />
          <div className="wm-orb wm-orb2" />
          <div className="wm-confetti">
            {['🎨','✨','🖌️','⭐','💫'].map((e, i) => (
              <span key={i} className="wm-confetti-piece" style={{ '--i': i }}>{e}</span>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="wm-body">
          <div className="wm-tag">Limited time offer</div>

          <div className="wm-discount">
            <span className="wm-rupee">₹</span>
            <span className="wm-amount">100</span>
            <span className="wm-off">OFF</span>
          </div>

          <h2 className="wm-title">On your first order</h2>
          <p className="wm-desc">
            Create a free account and use code at checkout.<br />
            Shop original handcrafted canvas paintings.
          </p>

          {/* Coupon box */}
          <div className="wm-coupon-box">
            <span className="wm-coupon-label">Your coupon code</span>
            <div className="wm-coupon-row">
              <span className="wm-coupon-code">{COUPON}</span>
              <button className="wm-copy-btn" onClick={handleCopy}>
                {copied ? '✓ Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* CTA */}
          <div className="wm-actions">
            <button className="wm-btn-primary" onClick={handleSignup}>
              Create free account →
            </button>
            <button className="wm-btn-ghost" onClick={handleLogin}>
              Already have an account
            </button>
          </div>

          <button className="wm-skip" onClick={close}>
            No thanks, I'll pay full price
          </button>
        </div>

        {/* Bottom strip */}
        <div className="wm-footer-strip">
          <span>🚚 Free shipping ₹999+</span>
          <span>🎨 100% original art</span>
          <span>🔒 Secure checkout</span>
        </div>
      </div>
    </div>
  );
}