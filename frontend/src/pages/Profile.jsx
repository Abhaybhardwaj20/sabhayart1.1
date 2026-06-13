import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { setUser } from '../redux/authSlice';
import './Profile.css';

export default function Profile() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', phone: user?.phone || '' });
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [msg, setMsg] = useState('');
  const [tab, setTab] = useState('profile'); // profile | password

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwStatus, setPwStatus] = useState('idle');
  const [pwMsg, setPwMsg] = useState('');

  useEffect(() => {
    if (user) setForm({ name: user.name || '', email: user.email || '', phone: user.phone || '' });
  }, [user]);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setStatus('loading'); setMsg('');
    try {
      const { data } = await API.put(ENDPOINTS.ME, form);
      dispatch(setUser(data.user || data));
      localStorage.setItem('sabhaya_user', JSON.stringify(data.user || data));
      setStatus('success'); setMsg('Profile updated.');
    } catch (err) {
      setStatus('error'); setMsg(err.response?.data?.message || 'Update failed.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus('error'); setPwMsg('Passwords do not match.'); return;
    }
    setPwStatus('loading'); setPwMsg('');
    try {
      await API.put('/auth/change-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      setPwStatus('success'); setPwMsg('Password changed successfully.');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPwStatus('error'); setPwMsg(err.response?.data?.message || 'Could not change password.');
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-sidebar">
        <div className="profile-avatar">
          <span>{user?.name?.charAt(0).toUpperCase()}</span>
        </div>
        <p className="profile-username">{user?.name}</p>
        <p className="profile-useremail">{user?.email}</p>
        <nav className="profile-nav">
          <button className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>Profile</button>
          <button className={tab === 'password' ? 'active' : ''} onClick={() => setTab('password')}>Password</button>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
        </nav>
      </div>

      <div className="profile-content">
        {tab === 'profile' && (
          <div className="profile-section">
            <h1>Profile details</h1>
            {msg && <div className={`profile-msg profile-msg--${status}`}>{msg}</div>}
            <form onSubmit={handleProfileSave} className="profile-form">
              <div className="profile-field">
                <label>Full Name</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="profile-field">
                <label>Email</label>
                <input type="email" required value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="profile-field">
                <label>Phone</label>
                <input type="tel" placeholder="+91 98765 43210" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <button type="submit" className="profile-btn" disabled={status === 'loading'}>
                {status === 'loading' ? 'Saving…' : 'Save changes'}
              </button>
            </form>
          </div>
        )}

        {tab === 'password' && (
          <div className="profile-section">
            <h1>Change password</h1>
            {pwMsg && <div className={`profile-msg profile-msg--${pwStatus}`}>{pwMsg}</div>}
            <form onSubmit={handlePasswordChange} className="profile-form">
              <div className="profile-field">
                <label>Current password</label>
                <input type="password" required value={pwForm.currentPassword}
                  onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
              </div>
              <div className="profile-field">
                <label>New password</label>
                <input type="password" required placeholder="Min. 8 characters" value={pwForm.newPassword}
                  onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
              </div>
              <div className="profile-field">
                <label>Confirm new password</label>
                <input type="password" required value={pwForm.confirmPassword}
                  onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })} />
              </div>
              <button type="submit" className="profile-btn" disabled={pwStatus === 'loading'}>
                {pwStatus === 'loading' ? 'Updating…' : 'Update password'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}