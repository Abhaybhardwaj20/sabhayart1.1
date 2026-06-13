import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { formatPrice } from '../utils/currencyFormatter';
import './Dashboard.css';

export default function ManageProducts() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('');
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const PER_PAGE = 12;

  const load = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: PER_PAGE });
      if (search)   params.append('search',   search);
      if (category) params.append('category', category);
      const { data } = await API.get(`${ENDPOINTS.ADMIN_PRODUCTS}?${params}`);
      const list = data.data?.paintings || data.paintings || data.products || (Array.isArray(data) ? data : []);
      setProducts(list);
      setTotal(data.data?.pagination?.total || data.total || list.length || 0);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    load();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return;
    try {
      await API.delete(`${ENDPOINTS.ADMIN_PRODUCTS}/${id}`);
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch {
      alert('Failed to delete product.');
    }
  };

  const totalPages = Math.ceil(total / PER_PAGE);

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Products</h1>
            <p className="admin-page-sub">{total} total listings</p>
          </div>
          <Link to="/admin/add-product" className="btn-primary" style={{ fontSize: '0.82rem', padding: '12px 24px' }}>
            + Add Product
          </Link>
        </div>

        <form onSubmit={handleSearch} className="admin-toolbar">
          <input
            className="admin-search"
            placeholder="Search by title, artist…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select className="admin-select" value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
            <option value="">All Categories</option>
            {['Abstract','Landscape','Portrait','Still Life','Floral','Spiritual','Modern','Traditional','Watercolor'].map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button type="submit" className="admin-action-btn" style={{ padding: '10px 20px' }}>Search</button>
        </form>

        <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
          {loading ? (
            <div className="admin-loading">Loading products…</div>
          ) : products.length === 0 ? (
            <div className="admin-empty">No products found.</div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p._id}>
                    <td>
                      <img
                        src={p.images?.[0]?.url || p.images?.[0] || p.image || '/placeholder.jpg'}
                        alt={p.title}
                        className="product-thumb"
                      />
                    </td>
                    <td>
                      <div style={{ fontWeight: 500, color: 'var(--white)', fontSize: '0.88rem' }}>{p.title}</div>
                      {p.artist && <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: '2px' }}>{p.artist}</div>}
                    </td>
                    <td>{p.category || '—'}</td>
                    <td>
                      <div style={{ color: 'var(--gold)', fontFamily: "'Cormorant Garamond', serif", fontSize: '1rem' }}>
                        {formatPrice(p.salePrice || p.price)}
                      </div>
                      {p.salePrice && p.price > p.salePrice && (
                        <div style={{ fontSize: '0.72rem', color: 'var(--muted)', textDecoration: 'line-through' }}>
                          {formatPrice(p.price)}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="status-pill" style={{
                        background: p.stock > 0 ? 'rgba(52,211,153,0.1)' : 'rgba(224,85,85,0.1)',
                        color: p.stock > 0 ? '#34d399' : 'var(--red)',
                      }}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="admin-action-btn"
                          onClick={() => navigate(`/admin/edit-product/${p._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="admin-action-btn danger"
                          onClick={() => handleDelete(p._id)}
                        >
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

        {totalPages > 1 && (
          <div className="admin-pagination">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                className={`admin-page-btn ${page === n ? 'active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}