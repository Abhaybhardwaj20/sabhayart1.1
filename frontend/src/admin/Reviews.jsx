import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import './Dashboard.css';

const Stars = ({ rating }) => (
  <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
  </span>
);

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter,  setFilter]  = useState('all'); // all | pending | approved
  const [page,    setPage]    = useState(1);
  const [total,   setTotal]   = useState(0);
  const PER_PAGE = 15;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (filter !== 'all') params.append('status', filter);
      // Using admin orders endpoint adapted — replace with actual reviews endpoint
      const { data } = await API.get(`/admin/reviews?${params}`);
      setReviews(data.reviews || data || []);
      setTotal(data.total || 0);
    } catch {
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, filter]);

  const approve = async (id) => {
    try {
      await API.put(`/admin/reviews/${id}/approve`);
      setReviews(prev => prev.map(r => r._id === id ? { ...r, approved: true } : r));
    } catch { alert('Failed to approve.'); }
  };

  const deleteReview = async (id) => {
    if (!window.confirm('Delete this review?')) return;
    try {
      await API.delete(`/admin/reviews/${id}`);
      setReviews(prev => prev.filter(r => r._id !== id));
    } catch { alert('Failed to delete.'); }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Reviews</h1>
            <p className="admin-page-sub">Moderate customer reviews before they go live.</p>
          </div>
        </div>

        <div className="admin-toolbar">
          {['all', 'pending', 'approved'].map(f => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className="admin-action-btn"
              style={{
                background: filter === f ? 'rgba(201,168,76,0.1)' : 'transparent',
                borderColor: filter === f ? 'var(--gold)' : 'var(--border)',
                color: filter === f ? 'var(--gold)' : 'var(--soft)',
                padding: '10px 20px',
                textTransform: 'capitalize',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="admin-loading">Loading reviews…</div>
        ) : reviews.length === 0 ? (
          <div className="admin-empty">No reviews found.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {reviews.map(r => (
              <div key={r._id} className="admin-card" style={{ padding: '20px 24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', flexWrap: 'wrap' }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: '50%',
                        background: 'rgba(201,168,76,0.15)', color: 'var(--gold)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 600, fontSize: '0.85rem', flexShrink: 0,
                      }}>
                        {(r.user?.name || r.userName || '?')[0].toUpperCase()}
                      </div>
                      <div>
                        <span style={{ color: 'var(--white)', fontWeight: 500, fontSize: '0.88rem' }}>
                          {r.user?.name || r.userName || 'Anonymous'}
                        </span>
                        <span style={{ color: 'var(--muted)', fontSize: '0.72rem', marginLeft: '8px' }}>
                          {r.createdAt ? new Date(r.createdAt).toLocaleDateString('en-IN') : ''}
                        </span>
                      </div>
                      <Stars rating={r.rating || 5} />
                      <span className="status-pill" style={{
                        background: r.approved ? 'rgba(52,211,153,0.1)' : 'rgba(245,158,11,0.1)',
                        color: r.approved ? '#34d399' : '#f59e0b',
                      }}>
                        {r.approved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    {r.productTitle && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '8px' }}>
                        On: <em style={{ color: 'var(--gold)' }}>{r.productTitle}</em>
                      </p>
                    )}
                    <p style={{ color: 'var(--soft)', fontSize: '0.88rem', lineHeight: 1.7 }}>{r.comment || r.text}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {!r.approved && (
                      <button className="admin-action-btn" style={{ color: '#34d399', borderColor: 'rgba(52,211,153,0.3)' }} onClick={() => approve(r._id)}>
                        Approve
                      </button>
                    )}
                    <button className="admin-action-btn danger" onClick={() => deleteReview(r._id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button key={n} className={`admin-page-btn ${page === n ? 'active' : ''}`} onClick={() => setPage(n)}>
                {n}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}