import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { COUPON_TYPES } from '../utils/constants';
import './Dashboard.css';

const INIT_FORM = {
  code: '', type: 'percentage', value: '', minOrder: '',
  maxUses: '', expiresAt: '', active: true,
};

export default function Coupons() {
  const [coupons,  setCoupons]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState(INIT_FORM);
  const [errors,   setErrors]   = useState({});
  const [saving,   setSaving]   = useState(false);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(ENDPOINTS.ADMIN_COUPONS);
      setCoupons(data.coupons || data || []);
    } catch {
      setCoupons([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.code.trim())                     e.code  = 'Code is required';
    if (!form.value || Number(form.value) <= 0) e.value = 'Valid discount value required';
    if (form.type === 'percentage' && Number(form.value) > 100) e.value = 'Cannot exceed 100%';
    return e;
  };

  const handleCreate = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = { ...form, code: form.code.trim().toUpperCase(), value: Number(form.value) };
      const { data } = await API.post(ENDPOINTS.ADMIN_COUPONS, payload);
      setCoupons(prev => [data.coupon || data, ...prev]);
      setForm(INIT_FORM);
      setShowForm(false);
    } catch (err) {
      setErrors({ code: err.response?.data?.message || 'Failed to create coupon.' });
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (id, active) => {
    try {
      await API.put(`${ENDPOINTS.ADMIN_COUPONS}/${id}`, { active: !active });
      setCoupons(prev => prev.map(c => c._id === id ? { ...c, active: !active } : c));
    } catch { alert('Failed to update.'); }
  };

  const deleteCoupon = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await API.delete(`${ENDPOINTS.ADMIN_COUPONS}/${id}`);
      setCoupons(prev => prev.filter(c => c._id !== id));
    } catch { alert('Failed to delete.'); }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Coupons</h1>
            <p className="admin-page-sub">Create and manage discount codes.</p>
          </div>
          <button
            className="btn-primary"
            style={{ fontSize: '0.82rem', padding: '12px 24px' }}
            onClick={() => setShowForm(f => !f)}
          >
            {showForm ? '✕ Cancel' : '+ New Coupon'}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="admin-card" style={{ marginBottom: '28px' }}>
            <div className="admin-card-title">New Coupon</div>
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-label">Coupon Code *</label>
                <input
                  className={`admin-input ${errors.code ? 'error' : ''}`}
                  value={form.code}
                  onChange={e => set('code', e.target.value.toUpperCase())}
                  placeholder="e.g. SUMMER20"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.code && <span className="admin-field-error">{errors.code}</span>}
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Discount Type</label>
                <select className="admin-select-field" value={form.type} onChange={e => set('type', e.target.value)}>
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                  <option value="free_shipping">Free Shipping</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-label">
                  Discount Value * {form.type === 'percentage' ? '(%)' : form.type === 'fixed' ? '(₹)' : ''}
                </label>
                <input
                  className={`admin-input ${errors.value ? 'error' : ''}`}
                  type="number" min="0"
                  value={form.value}
                  onChange={e => set('value', e.target.value)}
                  disabled={form.type === 'free_shipping'}
                  placeholder={form.type === 'free_shipping' ? 'N/A' : form.type === 'percentage' ? '0–100' : 'Amount in ₹'}
                />
                {errors.value && <span className="admin-field-error">{errors.value}</span>}
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Minimum Order (₹)</label>
                <input className="admin-input" type="number" min="0" value={form.minOrder} onChange={e => set('minOrder', e.target.value)} placeholder="0 = no minimum" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Max Uses</label>
                <input className="admin-input" type="number" min="1" value={form.maxUses} onChange={e => set('maxUses', e.target.value)} placeholder="Unlimited" />
              </div>
              <div className="admin-form-group">
                <label className="admin-label">Expires On</label>
                <input className="admin-input" type="date" value={form.expiresAt} onChange={e => set('expiresAt', e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={handleCreate} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Creating…' : 'Create Coupon'}
              </button>
            </div>
          </div>
        )}

        {/* Coupons Table */}
        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="admin-loading">Loading coupons…</div>
          ) : coupons.length === 0 ? (
            <div className="admin-empty">No coupons yet. Create one above.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Order</th>
                  <th>Uses</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c._id}>
                    <td>
                      <span style={{ fontFamily: 'monospace', color: 'var(--gold)', fontWeight: 600, fontSize: '0.9rem', letterSpacing: '0.06em' }}>
                        {c.code}
                      </span>
                    </td>
                    <td style={{ textTransform: 'capitalize', fontSize: '0.82rem' }}>
                      {c.type === 'percentage' ? '%' : c.type === 'fixed' ? '₹ Fixed' : 'Free Ship'}
                    </td>
                    <td style={{ color: 'var(--white)', fontWeight: 500 }}>
                      {c.type === 'percentage' ? `${c.value}%` : c.type === 'fixed' ? `₹${c.value}` : '—'}
                    </td>
                    <td>{c.minOrder ? `₹${c.minOrder}` : '—'}</td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {c.usedCount ?? 0}{c.maxUses ? ` / ${c.maxUses}` : ''}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString('en-IN') : 'Never'}
                    </td>
                    <td>
                      <span className="status-pill" style={{
                        background: c.active ? 'rgba(52,211,153,0.1)' : 'rgba(224,85,85,0.1)',
                        color: c.active ? '#34d399' : 'var(--red)',
                      }}>
                        {c.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="admin-action-btn" onClick={() => toggleActive(c._id, c.active)}>
                          {c.active ? 'Disable' : 'Enable'}
                        </button>
                        <button className="admin-action-btn danger" onClick={() => deleteCoupon(c._id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}