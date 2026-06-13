import React, { useEffect, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { formatPrice } from '../utils/currencyFormatter';
import { ORDER_STATUS_COLORS } from '../utils/constants';
import './Dashboard.css';

const BAR_COLORS = ['#c9a84c','#a78bfa','#60a5fa','#34d399','#f87171','#fb923c','#e879f9','#38bdf8','#4ade80','#facc15','#f472b6','#818cf8'];

function SimpleBarChart({ data, valueKey = 'revenue', labelKey = 'month', title }) {
  if (!data?.length) return <p style={{ color: 'var(--muted)', fontSize: '0.85rem', padding: '20px 0' }}>No data yet.</p>;
  const max = Math.max(...data.map(d => d[valueKey] || 0)) || 1;
  return (
    <div>
      {title && <p style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{title}</p>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '120px' }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%', justifyContent: 'flex-end' }}>
            <span style={{ fontSize: '0.62rem', color: 'var(--muted)', writing: 'vertical-rl' }}>
              {typeof d[valueKey] === 'number' && d[valueKey] >= 1000
                ? `₹${(d[valueKey]/1000).toFixed(0)}k`
                : d[valueKey]}
            </span>
            <div style={{
              width: '100%',
              height: `${Math.max((d[valueKey] / max) * 90, 4)}%`,
              background: BAR_COLORS[i % BAR_COLORS.length] + 'cc',
              borderRadius: '4px 4px 0 0',
              transition: 'height 0.4s',
            }} />
            <span style={{ fontSize: '0.62rem', color: 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', maxWidth: '100%', textAlign: 'center' }}>
              {d[labelKey]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PieChart({ data }) {
  if (!data?.length) return <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No data yet.</p>;
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  let cumulative = 0;
  const segments = data.map((d, i) => {
    const pct = (d.value / total) * 100;
    const start = cumulative;
    cumulative += pct;
    return { ...d, pct, start, color: BAR_COLORS[i % BAR_COLORS.length] };
  });

  return (
    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        {segments.map((s, i) => {
          const r = 50, cx = 60, cy = 60;
          const startAngle = (s.start / 100) * 2 * Math.PI - Math.PI / 2;
          const endAngle   = ((s.start + s.pct) / 100) * 2 * Math.PI - Math.PI / 2;
          const x1 = cx + r * Math.cos(startAngle);
          const y1 = cy + r * Math.sin(startAngle);
          const x2 = cx + r * Math.cos(endAngle);
          const y2 = cy + r * Math.sin(endAngle);
          const large = s.pct > 50 ? 1 : 0;
          return (
            <path
              key={i}
              d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`}
              fill={s.color}
              opacity="0.85"
            />
          );
        })}
        <circle cx="60" cy="60" r="28" fill="var(--card)" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {segments.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
            <div style={{ width: 10, height: 10, borderRadius: '2px', background: s.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--soft)' }}>{s.label}</span>
            <span style={{ color: 'var(--muted)', marginLeft: 'auto' }}>{s.pct.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [period,  setPeriod]  = useState('monthly'); // monthly | weekly

  useEffect(() => {
    API.get(`${ENDPOINTS.ADMIN_ANALYTICS}?period=${period}`)
      .then(({ data: d }) => setData(d))
      .catch(() => {
        // Mock fallback
        setData({
          totalRevenue: 284500,
          totalOrders: 38,
          avgOrderValue: 7487,
          conversionRate: '3.2',
          revenueByMonth: [
            { month: 'Jan', revenue: 18000 }, { month: 'Feb', revenue: 24000 },
            { month: 'Mar', revenue: 19500 }, { month: 'Apr', revenue: 31000 },
            { month: 'May', revenue: 28000 }, { month: 'Jun', revenue: 38000 },
          ],
          ordersByStatus: [
            { label: 'Delivered', value: 22 }, { label: 'Processing', value: 8 },
            { label: 'Shipped', value: 5 },    { label: 'Cancelled', value: 3 },
          ],
          topProducts: [
            { title: 'Misty Mountains', revenue: 48000, orders: 4 },
            { title: 'Crimson Peonies', revenue: 36000, orders: 3 },
            { title: 'Valley at Dusk',  revenue: 28000, orders: 2 },
          ],
          categoryRevenue: [
            { label: 'Landscape', value: 38 }, { label: 'Abstract', value: 25 },
            { label: 'Floral', value: 20 },    { label: 'Portrait', value: 10 },
            { label: 'Other', value: 7 },
          ],
        });
      })
      .finally(() => setLoading(false));
  }, [period]);

  const statCards = data ? [
    { label: 'Total Revenue',     value: formatPrice(data.totalRevenue),     color: '#c9a84c' },
    { label: 'Total Orders',      value: data.totalOrders,                   color: '#60a5fa' },
    { label: 'Avg Order Value',   value: formatPrice(data.avgOrderValue),    color: '#a78bfa' },
    { label: 'Conversion Rate',   value: `${data.conversionRate}%`,          color: '#34d399' },
  ] : [];

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Analytics</h1>
            <p className="admin-page-sub">Store performance overview.</p>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['monthly', 'weekly'].map(p => (
              <button
                key={p}
                className="admin-action-btn"
                style={{
                  padding: '10px 20px', textTransform: 'capitalize',
                  background: period === p ? 'rgba(201,168,76,0.1)' : 'transparent',
                  borderColor: period === p ? 'var(--gold)' : 'var(--border)',
                  color: period === p ? 'var(--gold)' : 'var(--soft)',
                }}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="admin-loading">Loading analytics…</div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="dash-stats-grid" style={{ marginBottom: '28px' }}>
              {statCards.map(s => (
                <div key={s.label} className="dash-stat-card">
                  <div className="dash-stat-icon" style={{ background: s.color + '18', color: s.color, fontSize: '0.9rem' }}>
                    {s.label[0]}
                  </div>
                  <div className="dash-stat-body">
                    <span className="dash-stat-label">{s.label}</span>
                    <span className="dash-stat-value" style={{ fontSize: '1.4rem' }}>{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              {/* Revenue Chart */}
              <div className="admin-card">
                <div className="admin-card-title">Revenue by Month</div>
                <SimpleBarChart data={data.revenueByMonth} valueKey="revenue" labelKey="month" />
              </div>

              {/* Orders by Status */}
              <div className="admin-card">
                <div className="admin-card-title">Orders by Status</div>
                <PieChart data={data.ordersByStatus} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              {/* Top Products */}
              <div className="admin-card">
                <div className="admin-card-title">Top Products</div>
                {data.topProducts?.length ? (
                  <table className="admin-table">
                    <thead>
                      <tr><th>#</th><th>Product</th><th>Orders</th><th>Revenue</th></tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map((p, i) => (
                        <tr key={i}>
                          <td style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{i + 1}</td>
                          <td style={{ color: 'var(--white)', fontWeight: 500 }}>{p.title}</td>
                          <td>{p.orders}</td>
                          <td style={{ color: 'var(--gold)' }}>{formatPrice(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>No data yet.</p>}
              </div>

              {/* Category Revenue */}
              <div className="admin-card">
                <div className="admin-card-title">Revenue by Category</div>
                <PieChart data={data.categoryRevenue} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}