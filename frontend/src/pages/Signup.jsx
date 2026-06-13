import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { auth, googleProvider } from '../firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import API from '../api/axios';
import './Login.css';
import './Signup.css';

/* ── Password strength ── */
function PasswordStrength({ password }) {
  const checks = [
    { label: '8+ chars',  ok: password.length >= 8 },
    { label: 'Uppercase', ok: /[A-Z]/.test(password) },
    { label: 'Number',    ok: /\d/.test(password) },
    { label: 'Symbol',    ok: /[^A-Za-z0-9]/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#e05555', '#f59e0b', '#3b82f6', '#25d366'];

  if (!password) return null;

  return (
    <div className="pw-strength">
      <div className="pw-bars">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="pw-bar"
            style={{ background: i <= score ? colors[score] : 'var(--border)' }}
          />
        ))}
      </div>
      <div className="pw-checks">
        {checks.map(c => (
          <span key={c.label} className={`pw-check${c.ok ? ' pw-check--ok' : ''}`}>
            {c.ok ? '✓' : '·'} {c.label}
          </span>
        ))}
      </div>
      <span className="pw-label" style={{ color: colors[score] }}>{labels[score]}</span>
    </div>
  );
}

/* ── OTP input (reuse logic) ── */
function OtpInput({ value, onChange }) {
  const inputs = useRef([]);
  const vals   = value.split('').concat(Array(6).fill('')).slice(0, 6);

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      const next = vals.map((v, idx) => idx === i ? '' : v).join('');
      onChange(next);
      if (i > 0) inputs.current[i - 1]?.focus();
    } else if (/^\d$/.test(e.key)) {
      const next = vals.map((v, idx) => idx === i ? e.key : v).join('');
      onChange(next);
      if (i < 5) inputs.current[i + 1]?.focus();
    }
    e.preventDefault();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    inputs.current[Math.min(pasted.length, 5)]?.focus();
    e.preventDefault();
  };

  return (
    <div className="otp-row">
      {vals.map((v, i) => (
        <input
          key={i}
          ref={el => inputs.current[i] = el}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={v}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          onChange={() => {}}
          className={`otp-box${v ? ' otp-filled' : ''}`}
          autoFocus={i === 0}
        />
      ))}
    </div>
  );
}

/* ═══════════ MAIN COMPONENT ═══════════ */
export default function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tab,     setTab]     = useState('email'); // email | phone
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  /* email form */
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });

  /* phone form */
  const [phoneNum,   setPhoneNum]   = useState('');
  const [phoneOtp,   setPhoneOtp]   = useState('');
  const [otpSent,    setOtpSent]    = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown,  setCountdown]  = useState(0);
  const timerRef = useRef(null);

  useEffect(() => () => clearInterval(timerRef.current), []);

  const startCountdown = () => {
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(timerRef.current); return 0; } return c - 1; });
    }, 1000);
  };

  /* ── Google ── */
  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      const result  = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const { data } = await API.post('/auth/google', { idToken });
      _saveAndGo(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Google sign-up failed.');
      setLoading(false);
    }
  };

  /* ── Email register ── */
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    if (form.password.length < 6)      { setError('Password must be at least 6 characters.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/register', {
        name:     form.name,
        email:    form.email,
        phone:    form.phone,
        password: form.password,
      });
      _saveAndGo(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Registration failed. Please try again.');
      setLoading(false);
    }
  };

  /* ── Phone OTP send ── */
  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phoneNum)) { setError('Enter a valid 10-digit mobile number.'); return; }
    setOtpLoading(true); setError('');
    try {
      await API.post('/auth/send-otp', { phone: `+91${phoneNum}` });
      setOtpSent(true);
      startCountdown();
    } catch (e) {
      setError(e.response?.data?.message || 'Could not send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── Phone OTP verify ── */
  const handlePhoneSignup = async (e) => {
    e.preventDefault();
    if (phoneOtp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/verify-otp', { phone: `+91${phoneNum}`, otp: phoneOtp, register: true });
      _saveAndGo(data);
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid OTP.');
      setLoading(false);
    }
  };

  const _saveAndGo = ({ token, user }) => {
    if (token) localStorage.setItem('sabhaya_token', token);
    localStorage.setItem('sabhaya_user', JSON.stringify(user));
    dispatch(loginSuccess(user));
    navigate('/', { replace: true });
  };

  return (
    <div className="auth-page">
      {/* Left brand panel */}
      <div className="auth-left" aria-hidden="true">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <span className="auth-brand-name">SabhayaArt</span>
            <span className="auth-brand-tagline">Studio</span>
          </div>
          <div className="auth-quote">
            <p>"Art is not what you see,<br />but what you make others see."</p>
          </div>
          <div className="auth-perks">
            {[
              { icon: '🎁', text: '₹100 off your first order' },
              { icon: '🚚', text: 'Free shipping on orders ₹999+' },
              { icon: '🎨', text: 'Handcrafted original paintings' },
              { icon: '🔒', text: 'Secure & encrypted checkout' },
            ].map(p => (
              <div key={p.text} className="auth-perk">
                <span>{p.icon}</span>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
          <div className="auth-art-orbs">
            <div className="orb orb1" />
            <div className="orb orb2" />
            <div className="orb orb3" />
          </div>
          <div className="auth-brushstroke" />
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">Create account</h1>
          <p className="auth-sub">Join SabhayaArt — get ₹100 off your first order 🎉</p>

          {/* Google */}
          <button className="auth-google-btn" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          {/* Tabs */}
          <div className="auth-tabs">
            <button className={tab === 'email' ? 'active' : ''} onClick={() => { setTab('email'); setError(''); }}>
              Email
            </button>
            <button className={tab === 'phone' ? 'active' : ''} onClick={() => { setTab('phone'); setError(''); }}>
              Mobile OTP
            </button>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          {/* ── EMAIL FORM ── */}
          {tab === 'email' && (
            <form className="auth-form" onSubmit={handleEmailSignup} noValidate>
              <div className="auth-field">
                <label>Full name</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">👤</span>
                  <input type="text" placeholder="Abhay Bhardwaj" value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
                </div>
              </div>

              <div className="auth-field">
                <label>Email address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉</span>
                  <input type="email" placeholder="you@example.com" value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
                </div>
              </div>

              <div className="auth-field">
                <label>Mobile number <span className="auth-optional">(optional)</span></label>
                <div className="auth-input-wrap auth-phone-wrap">
                  <span className="auth-prefix">+91</span>
                  <input type="tel" placeholder="98765 43210" value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                    autoComplete="tel-national" />
                </div>
              </div>

              <div className="auth-field">
                <label>Password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input type={showPw ? 'text' : 'password'} placeholder="Create a strong password"
                    value={form.password}
                    onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" />
                  <button type="button" className="auth-eye" onClick={() => setShowPw(v => !v)}>
                    {showPw ? '👁' : '👁‍🗨'}
                  </button>
                </div>
                <PasswordStrength password={form.password} />
              </div>

              <div className="auth-field">
                <label>Confirm password</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input type={showPw2 ? 'text' : 'password'} placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={e => setForm({ ...form, confirm: e.target.value })} required autoComplete="new-password" />
                  <button type="button" className="auth-eye" onClick={() => setShowPw2(v => !v)}>
                    {showPw2 ? '👁' : '👁‍🗨'}
                  </button>
                </div>
                {form.confirm && form.password !== form.confirm && (
                  <span className="auth-mismatch">Passwords don't match</span>
                )}
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Create account — Get ₹100 off 🎁'}
              </button>

              <p className="auth-terms">
                By creating an account you agree to our{' '}
                <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.
              </p>
            </form>
          )}

          {/* ── PHONE FORM ── */}
          {tab === 'phone' && (
            <form className="auth-form" onSubmit={handlePhoneSignup} noValidate>
              <div className="auth-field">
                <label>Mobile number</label>
                <div className="auth-input-wrap auth-phone-wrap">
                  <span className="auth-prefix">+91</span>
                  <input type="tel" placeholder="98765 43210" value={phoneNum}
                    onChange={e => setPhoneNum(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    disabled={otpSent} autoComplete="tel-national" />
                  {!otpSent && (
                    <button type="button" className="auth-send-otp" onClick={sendOtp}
                      disabled={otpLoading || phoneNum.length < 10}>
                      {otpLoading ? <span className="auth-spinner auth-spinner--sm" /> : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <>
                  <div className="auth-field">
                    <label>Enter 6-digit OTP</label>
                    <OtpInput value={phoneOtp} onChange={setPhoneOtp} />
                    <div className="auth-otp-resend">
                      {countdown > 0
                        ? <span>Resend in {countdown}s</span>
                        : <button type="button" className="auth-resend-btn" onClick={sendOtp}>Resend OTP</button>
                      }
                    </div>
                  </div>
                  <button type="submit" className="auth-submit" disabled={loading || phoneOtp.length < 6}>
                    {loading ? <span className="auth-spinner" /> : 'Verify & Create account 🎁'}
                  </button>
                </>
              )}

              {!otpSent && (
                <button type="button" className="auth-submit auth-submit--disabled" disabled>
                  Verify OTP to create account
                </button>
              )}
            </form>
          )}

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}