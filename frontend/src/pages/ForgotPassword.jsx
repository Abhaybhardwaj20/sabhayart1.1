import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import './Login.css';
import './ForgotPassword.css';

function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const vals   = value.split('').concat(Array(6).fill('')).slice(0, 6);
  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      onChange(vals.map((v, idx) => idx === i ? '' : v).join(''));
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      onChange(vals.map((v, idx) => idx === i ? e.key : v).join(''));
      if (i < 5) inputs.current[i + 1]?.focus();
    }
    e.preventDefault();
  };
  const handlePaste = (e) => {
    const p = e.clipboardData.getData('text').replace(/\D/g,'').slice(0,6);
    onChange(p.padEnd(6,'').slice(0,6));
    inputs.current[Math.min(p.length,5)]?.focus();
    e.preventDefault();
  };
  return (
    <div className="otp-row">
      {vals.map((v,i) => (
        <input key={i} ref={el => inputs.current[i] = el}
          type="text" inputMode="numeric" maxLength={1} value={v}
          onKeyDown={e => handleKey(i,e)} onPaste={handlePaste} onChange={() => {}}
          className={`otp-box${v ? ' otp-filled' : ''}`} autoFocus={i === 0} />
      ))}
    </div>
  );
}

/* step: email | otp | reset | done */
export default function ForgotPassword() {
  const navigate  = useNavigate();
  const [step,    setStep]    = useState('email');
  const [email,   setEmail]   = useState('');
  const [otp,     setOtp]     = useState('');
  const [pw,      setPw]      = useState('');
  const [pw2,     setPw2]     = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef(null);
  useEffect(() => () => clearInterval(timerRef.current), []);

  const startCountdown = () => {
    setCountdown(60);
    timerRef.current = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; });
    }, 1000);
  };

  /* Step 1: send reset email */
  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await API.post('/auth/forgot-password', { email });
      setStep('otp');
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not send reset link.');
    } finally {
      setLoading(false);
    }
  };

  /* Step 2: verify OTP */
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length < 6) { setError('Enter the 6-digit code.'); return; }
    setLoading(true); setError('');
    try {
      await API.post('/auth/verify-reset-otp', { email, otp });
      setStep('reset');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code.');
    } finally {
      setLoading(false);
    }
  };

  /* Step 3: set new password */
  const handleReset = async (e) => {
    e.preventDefault();
    if (pw !== pw2)     { setError("Passwords don't match."); return; }
    if (pw.length < 6)  { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      await API.post('/auth/reset-password', { email, otp, newPassword: pw });
      setStep('done');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page fp-page">
      {/* Left */}
      <div className="auth-left" aria-hidden="true">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <span className="auth-brand-name">SabhayaArt</span>
            <span className="auth-brand-tagline">Studio</span>
          </div>
          <div className="auth-quote">
            <p>"A painting is never finished —<br />it simply stops in interesting places."</p>
          </div>
          <div className="auth-art-orbs">
            <div className="orb orb1" />
            <div className="orb orb2" />
            <div className="orb orb3" />
          </div>
          <div className="auth-brushstroke" />
        </div>
      </div>

      {/* Right */}
      <div className="auth-right">
        <div className="auth-card">

          {/* ── Step progress ── */}
          <div className="fp-steps">
            {['Email','Verify','Reset'].map((s, i) => (
              <React.Fragment key={s}>
                <div className={`fp-step${['email','otp','reset','done'].indexOf(step) >= i ? ' fp-step--done' : ''}`}>
                  <div className="fp-step-dot">{['email','otp','reset','done'].indexOf(step) > i ? '✓' : i + 1}</div>
                  <span>{s}</span>
                </div>
                {i < 2 && <div className={`fp-step-line${['email','otp','reset','done'].indexOf(step) > i ? ' fp-step-line--done' : ''}`} />}
              </React.Fragment>
            ))}
          </div>

          {/* ── step: email ── */}
          {step === 'email' && (
            <>
              <h1 className="auth-title">Forgot password?</h1>
              <p className="auth-sub">We'll send a reset code to your email.</p>
              {error && <div className="auth-error"><span>⚠</span> {error}</div>}
              <form className="auth-form" onSubmit={handleSendLink} noValidate>
                <div className="auth-field">
                  <label htmlFor="fp-email">Email address</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">✉</span>
                    <input id="fp-email" type="email" placeholder="you@example.com"
                      value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                  </div>
                </div>
                <button type="submit" className="auth-submit" disabled={loading}>
                  {loading ? <span className="auth-spinner" /> : 'Send reset code'}
                </button>
              </form>
            </>
          )}

          {/* ── step: otp ── */}
          {step === 'otp' && (
            <>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-sub">Enter the 6-digit code we sent to <strong style={{ color: 'var(--gold)' }}>{email}</strong></p>
              {error && <div className="auth-error"><span>⚠</span> {error}</div>}
              <form className="auth-form" onSubmit={handleVerifyOtp} noValidate>
                <div className="auth-field">
                  <label>Verification code</label>
                  <OtpInput value={otp} onChange={setOtp} />
                  <div className="auth-otp-resend">
                    {countdown > 0
                      ? <span>Resend in {countdown}s</span>
                      : (
                        <button type="button" className="auth-resend-btn"
                          onClick={async () => {
                            await API.post('/auth/forgot-password', { email });
                            startCountdown();
                          }}>
                          Resend code
                        </button>
                      )
                    }
                  </div>
                </div>
                <button type="submit" className="auth-submit" disabled={loading || otp.length < 6}>
                  {loading ? <span className="auth-spinner" /> : 'Verify code'}
                </button>
              </form>
            </>
          )}

          {/* ── step: reset ── */}
          {step === 'reset' && (
            <>
              <h1 className="auth-title">Set new password</h1>
              <p className="auth-sub">Choose a strong password for your account.</p>
              {error && <div className="auth-error"><span>⚠</span> {error}</div>}
              <form className="auth-form" onSubmit={handleReset} noValidate>
                <div className="auth-field">
                  <label>New password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input type={showPw ? 'text' : 'password'} placeholder="Min. 6 characters"
                      value={pw} onChange={e => setPw(e.target.value)} required autoFocus />
                    <button type="button" className="auth-eye" onClick={() => setShowPw(v => !v)}>
                      {showPw ? '👁' : '👁‍🗨'}
                    </button>
                  </div>
                </div>
                <div className="auth-field">
                  <label>Confirm password</label>
                  <div className="auth-input-wrap">
                    <span className="auth-input-icon">🔒</span>
                    <input type="password" placeholder="Repeat your new password"
                      value={pw2} onChange={e => setPw2(e.target.value)} required />
                  </div>
                  {pw2 && pw !== pw2 && <span className="auth-mismatch">Passwords don't match</span>}
                </div>
                <button type="submit" className="auth-submit" disabled={loading || (pw2 && pw !== pw2)}>
                  {loading ? <span className="auth-spinner" /> : 'Reset password'}
                </button>
              </form>
            </>
          )}

          {/* ── step: done ── */}
          {step === 'done' && (
            <div className="fp-done">
              <div className="fp-done-icon">🎉</div>
              <h1 className="auth-title">Password reset!</h1>
              <p className="auth-sub">Your password has been updated. You can now sign in with your new password.</p>
              <button className="auth-submit" onClick={() => navigate('/login')}>
                Go to sign in →
              </button>
            </div>
          )}

          {step !== 'done' && (
            <p className="auth-switch">
              Remember it? <Link to="/login">Sign in</Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}