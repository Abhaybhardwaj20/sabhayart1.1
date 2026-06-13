import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../redux/authSlice';
import { auth, googleProvider } from '../firebase/firebase';
import { signInWithPopup } from 'firebase/auth';
import API from '../api/axios';
import './Login.css';

/* ── tiny particles canvas ── */
function Particles() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width  = canvas.offsetWidth);
    let H = (canvas.height = canvas.offsetHeight);
    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      a: Math.random() * 0.5 + 0.15,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,168,76,${d.a})`;
        ctx.fill();
      });
      // lines
      dots.forEach((a, i) => dots.slice(i + 1).forEach(b => {
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(201,168,76,${0.06 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }));
      raf = requestAnimationFrame(draw);
    };
    draw();
    const onResize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} className="auth-particles" />;
}

/* ── OTP input row ── */
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
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const from     = location.state?.from?.pathname || '/';

  /* tabs: email | phone */
  const [tab,      setTab]      = useState('email');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [showPw,   setShowPw]   = useState(false);
  const [remember, setRemember] = useState(() => !!localStorage.getItem('sabhaya_remember'));

  /* email form */
  const [email, setEmail] = useState(() => localStorage.getItem('sabhaya_remember_email') || '');
  const [pw,    setPw]    = useState('');

  /* phone form */
  const [phone,      setPhone]      = useState('');
  const [otp,        setOtp]        = useState('');
  const [otpSent,    setOtpSent]    = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [countdown,  setCountdown]  = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  const startCountdown = () => {
    setCountdown(30);
    timerRef.current = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(timerRef.current); return 0; }
        return c - 1;
      });
    }, 1000);
  };

  /* ── Google Sign-In ── */
  const handleGoogle = async () => {
    setLoading(true); setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const { user } = result;
      const { data } = await API.post('/auth/google', {
        name:        user.displayName,
        email:       user.email,
        firebaseUid: user.uid,
        avatar:      user.photoURL,
      });
      _saveAndGo(data.data);  // backend wraps in data.data
    } catch (e) {
      setError(e.response?.data?.message || 'Google sign-in failed.');
      setLoading(false);
    }
  };

  /* ── Email login ── */
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/login', { email, password: pw });
      if (remember) {
        localStorage.setItem('sabhaya_remember', '1');
        localStorage.setItem('sabhaya_remember_email', email);
      } else {
        localStorage.removeItem('sabhaya_remember');
        localStorage.removeItem('sabhaya_remember_email');
      }
      _saveAndGo(data.data);  // backend wraps in data.data
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  /* ── Send phone OTP ── */
  const sendOtp = async () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Enter a valid 10-digit mobile number.'); return; }
    setOtpLoading(true); setError('');
    try {
      await API.post('/auth/send-otp', { phone: `+91${phone}` });
      setOtpSent(true);
      startCountdown();
    } catch (e) {
      setError(e.response?.data?.message || 'Could not send OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── Verify phone OTP ── */
  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { setError('Enter the 6-digit OTP.'); return; }
    setLoading(true); setError('');
    try {
      const { data } = await API.post('/auth/verify-otp', { phone: `+91${phone}`, otp });
      _saveAndGo(data.data);
    } catch (e) {
      setError(e.response?.data?.message || 'Invalid OTP. Please try again.');
      setLoading(false);
    }
  };

  /* ── Persist & navigate ── */
  const _saveAndGo = ({ token, user }) => {
    if (token) localStorage.setItem('sabhaya_token', token);
    localStorage.setItem('sabhaya_user', JSON.stringify(user));
    dispatch(loginSuccess(user));
    navigate(from, { replace: true });
  };

  return (
    <div className="auth-page">
      <Particles />

      {/* ── Left panel – brand ── */}
      <div className="auth-left" aria-hidden="true">
        <div className="auth-left-inner">
          <div className="auth-brand">
            <span className="auth-brand-name">SabhayaArt</span>
            <span className="auth-brand-tagline">Studio</span>
          </div>
          <div className="auth-quote">
            <p>"Every canvas holds a story<br />waiting to find its wall."</p>
          </div>
          <div className="auth-art-orbs">
            <div className="orb orb1" />
            <div className="orb orb2" />
            <div className="orb orb3" />
          </div>
          <div className="auth-brushstroke" />
        </div>
      </div>

      {/* ── Right panel – form ── */}
      <div className="auth-right">
        <div className="auth-card">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-sub">Sign in to your SabhayaArt account</p>

          {/* Google */}
          <button className="auth-google-btn" onClick={handleGoogle} disabled={loading}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <div className="auth-divider"><span>or</span></div>

          {/* Tab switch */}
          <div className="auth-tabs">
            <button className={tab === 'email' ? 'active' : ''} onClick={() => { setTab('email'); setError(''); }}>
              Email
            </button>
            <button className={tab === 'phone' ? 'active' : ''} onClick={() => { setTab('phone'); setError(''); }}>
              Mobile OTP
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="auth-error" role="alert">
              <span>⚠</span> {error}
            </div>
          )}

          {/* ── EMAIL FORM ── */}
          {tab === 'email' && (
            <form className="auth-form" onSubmit={handleEmailLogin} noValidate>
              <div className="auth-field">
                <label htmlFor="login-email">Email address</label>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div className="auth-field">
                <div className="auth-field-row">
                  <label htmlFor="login-pw">Password</label>
                  <Link to="/forgot-password" className="auth-forgot">Forgot password?</Link>
                </div>
                <div className="auth-input-wrap">
                  <span className="auth-input-icon">🔒</span>
                  <input
                    id="login-pw"
                    type={showPw ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={pw}
                    onChange={e => setPw(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="auth-eye"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? '👁' : '👁‍🗨'}
                  </button>
                </div>
              </div>

              <label className="auth-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={e => setRemember(e.target.checked)}
                />
                <span className="auth-check-box" />
                <span>Remember me</span>
              </label>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading ? <span className="auth-spinner" /> : 'Sign in'}
              </button>
            </form>
          )}

          {/* ── PHONE OTP FORM ── */}
          {tab === 'phone' && (
            <form className="auth-form" onSubmit={handlePhoneLogin} noValidate>
              <div className="auth-field">
                <label htmlFor="login-phone">Mobile number</label>
                <div className="auth-input-wrap auth-phone-wrap">
                  <span className="auth-prefix">+91</span>
                  <input
                    id="login-phone"
                    type="tel"
                    placeholder="98765 43210"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    autoComplete="tel-national"
                    disabled={otpSent}
                  />
                  {!otpSent && (
                    <button
                      type="button"
                      className="auth-send-otp"
                      onClick={sendOtp}
                      disabled={otpLoading || phone.length < 10}
                    >
                      {otpLoading ? <span className="auth-spinner auth-spinner--sm" /> : 'Send OTP'}
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <>
                  <div className="auth-field">
                    <label>Enter 6-digit OTP</label>
                    <OtpInput value={otp} onChange={setOtp} />
                    <div className="auth-otp-resend">
                      {countdown > 0
                        ? <span>Resend in {countdown}s</span>
                        : <button type="button" className="auth-resend-btn" onClick={sendOtp}>Resend OTP</button>
                      }
                    </div>
                  </div>

                  <button type="submit" className="auth-submit" disabled={loading || otp.length < 6}>
                    {loading ? <span className="auth-spinner" /> : 'Verify & Sign in'}
                  </button>
                </>
              )}

              {!otpSent && (
                <button type="button" className="auth-submit auth-submit--disabled" disabled>
                  Verify OTP to sign in
                </button>
              )}
            </form>
          )}

          <p className="auth-switch">
            New to SabhayaArt?{' '}
            <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}