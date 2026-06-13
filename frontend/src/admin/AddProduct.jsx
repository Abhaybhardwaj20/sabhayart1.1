import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { validateProduct } from '../utils/validation';
import { PAINTING_CATEGORIES, PAINTING_MEDIUMS, PAINTING_SIZES } from '../utils/constants';
import './Dashboard.css';

const INIT = {
  title: '', artist: '', description: '', price: '', salePrice: '',
  category: '', medium: '', size: '', dimensions: '', stock: '1',
  tags: '', featured: false,
};

export default function AddProduct() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState(INIT);
  const [images,  setImages]  = useState([]);   // File objects
  const [previews,setPreviews]= useState([]);   // Data URLs
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [apiErr,  setApiErr]  = useState('');

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const handleImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 8);
    setImages(files);
    const readers = files.map(f => new Promise(res => {
      const r = new FileReader();
      r.onload = () => res(r.result);
      r.readAsDataURL(f);
    }));
    Promise.all(readers).then(setPreviews);
  };

  const removeImage = (i) => {
    setImages(prev => prev.filter((_, j) => j !== i));
    setPreviews(prev => prev.filter((_, j) => j !== i));
  };

  const handleSubmit = async () => {
    const errs = validateProduct(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setApiErr('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      images.forEach(f => fd.append('images', f));

      await API.post(ENDPOINTS.ADMIN_PRODUCTS, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin/products');
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Failed to add product. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Add Product</h1>
            <p className="admin-page-sub">Fill in the details below to list a new painting.</p>
          </div>
          <button
            onClick={() => navigate('/admin/products')}
            className="admin-action-btn"
            style={{ padding: '10px 20px' }}
          >
            ← Back
          </button>
        </div>

        {apiErr && (
          <div style={{ background: 'rgba(224,85,85,0.08)', border: '1px solid rgba(224,85,85,0.2)', borderRadius: '10px', padding: '12px 16px', color: 'var(--red)', fontSize: '0.85rem', marginBottom: '20px' }}>
            {apiErr}
          </div>
        )}

        {/* Basic Info */}
        <div className="admin-card">
          <div className="admin-card-title">Basic Information</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Title *</label>
              <input className={`admin-input ${errors.title ? 'error' : ''}`} value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Misty Mountains at Dawn" />
              {errors.title && <span className="admin-field-error">{errors.title}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Artist Name</label>
              <input className="admin-input" value={form.artist} onChange={e => set('artist', e.target.value)} placeholder="e.g. Rohan Mehta" />
            </div>
            <div className="admin-form-group full">
              <label className="admin-label">Description *</label>
              <textarea className={`admin-textarea ${errors.description ? 'error' : ''}`} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the painting — style, mood, inspiration…" rows={4} />
              {errors.description && <span className="admin-field-error">{errors.description}</span>}
            </div>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="admin-card">
          <div className="admin-card-title">Pricing & Inventory</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Price (₹) *</label>
              <input className={`admin-input ${errors.price ? 'error' : ''}`} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 12000" />
              {errors.price && <span className="admin-field-error">{errors.price}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Sale Price (₹) <span style={{ color: 'var(--muted)' }}>optional</span></label>
              <input className="admin-input" type="number" min="0" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="Leave blank if no sale" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Stock Quantity</label>
              <input className="admin-input" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Featured</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px', color: 'var(--soft)', fontSize: '0.88rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                Show on homepage featured section
              </label>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="admin-card">
          <div className="admin-card-title">Painting Details</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Category *</label>
              <select className={`admin-select-field ${errors.category ? 'error' : ''}`} value={form.category} onChange={e => set('category', e.target.value)}>
                <option value="">Select category</option>
                {PAINTING_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {errors.category && <span className="admin-field-error">{errors.category}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Medium</label>
              <select className="admin-select-field" value={form.medium} onChange={e => set('medium', e.target.value)}>
                <option value="">Select medium</option>
                {PAINTING_MEDIUMS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Size</label>
              <select className="admin-select-field" value={form.size} onChange={e => set('size', e.target.value)}>
                <option value="">Select size</option>
                {PAINTING_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Dimensions</label>
              <input className="admin-input" value={form.dimensions} onChange={e => set('dimensions', e.target.value)} placeholder='e.g. 24" × 18"' />
            </div>
            <div className="admin-form-group full">
              <label className="admin-label">Tags <span style={{ color: 'var(--muted)' }}>comma separated</span></label>
              <input className="admin-input" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="e.g. nature, blue, abstract, peaceful" />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="admin-card">
          <div className="admin-card-title">Product Images <span style={{ color: 'var(--muted)', fontSize: '0.8rem', fontFamily: "'Outfit'" }}>up to 8</span></div>
          <label className="image-upload-area" htmlFor="prod-images">
            <div style={{ fontSize: '2rem' }}>🖼️</div>
            <p>Click to upload images (JPG, PNG, WEBP)</p>
            <p style={{ fontSize: '0.72rem', marginTop: '4px', color: 'var(--muted)' }}>First image will be the cover</p>
          </label>
          <input id="prod-images" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleImages} />
          {previews.length > 0 && (
            <div className="image-previews">
              {previews.map((src, i) => (
                <div key={i} className="image-preview-item">
                  <img src={src} alt={`Preview ${i + 1}`} />
                  <button className="image-preview-remove" onClick={() => removeImage(i)}>✕</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/admin/products')} className="admin-action-btn" style={{ padding: '14px 28px' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="btn-primary"
            style={{ opacity: saving ? 0.6 : 1, cursor: saving ? 'not-allowed' : 'pointer' }}
          >
            {saving ? 'Saving…' : 'Publish Product'}
          </button>
        </div>
      </main>
    </div>
  );
}