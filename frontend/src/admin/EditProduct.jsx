import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import { validateProduct } from '../utils/validation';
import { PAINTING_CATEGORIES, PAINTING_MEDIUMS, PAINTING_SIZES } from '../utils/constants';
import './Dashboard.css';

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form,    setForm]    = useState(null);
  const [newImgs, setNewImgs] = useState([]);
  const [previews,setPreviews]= useState([]);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);
  const [apiErr,  setApiErr]  = useState('');

  useEffect(() => {
    API.get(ENDPOINTS.PRODUCT(id))
      .then(({ data }) => {
        setForm({
          title:       data.title       || '',
          artist:      data.artist      || '',
          description: data.description || '',
          price:       data.price       || '',
          salePrice:   data.salePrice   || '',
          category:    data.category    || '',
          medium:      data.medium      || '',
          size:        data.size        || '',
          dimensions:  data.dimensions  || '',
          stock:       data.stock       ?? 1,
          tags:        (data.tags || []).join(', '),
          featured:    data.featured    || false,
          existingImages: data.images   || [],
        });
      })
      .catch(() => setApiErr('Could not load product.'))
      .finally(() => setLoading(false));
  }, [id]);

  const set = (field, val) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const removeExisting = (url) => {
    setForm(f => ({ ...f, existingImages: f.existingImages.filter(u => u !== url) }));
  };

  const handleNewImages = (e) => {
    const files = Array.from(e.target.files).slice(0, 8 - (form?.existingImages?.length || 0));
    setNewImgs(files);
    Promise.all(files.map(f => new Promise(res => {
      const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(f);
    }))).then(setPreviews);
  };

  const handleSubmit = async () => {
    const errs = validateProduct(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSaving(true);
    setApiErr('');
    try {
      const fd = new FormData();
      const { existingImages, ...rest } = form;
      Object.entries(rest).forEach(([k, v]) => fd.append(k, v));
      fd.append('existingImages', JSON.stringify(existingImages));
      newImgs.forEach(f => fd.append('images', f));

      await API.put(`${ENDPOINTS.ADMIN_PRODUCTS}/${id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      navigate('/admin/products');
    } catch (err) {
      setApiErr(err.response?.data?.message || 'Failed to update. Try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main"><div className="admin-loading">Loading product…</div></main>
    </div>
  );

  if (!form) return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main"><div className="admin-empty">{apiErr || 'Product not found.'}</div></main>
    </div>
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main">
        <div className="admin-page-header">
          <div>
            <h1 className="admin-page-title">Edit Product</h1>
            <p className="admin-page-sub">Update the details for <em style={{ color: 'var(--gold)' }}>{form.title}</em></p>
          </div>
          <button onClick={() => navigate('/admin/products')} className="admin-action-btn" style={{ padding: '10px 20px' }}>
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
              <input className={`admin-input ${errors.title ? 'error' : ''}`} value={form.title} onChange={e => set('title', e.target.value)} />
              {errors.title && <span className="admin-field-error">{errors.title}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Artist Name</label>
              <input className="admin-input" value={form.artist} onChange={e => set('artist', e.target.value)} />
            </div>
            <div className="admin-form-group full">
              <label className="admin-label">Description *</label>
              <textarea className={`admin-textarea ${errors.description ? 'error' : ''}`} value={form.description} onChange={e => set('description', e.target.value)} rows={4} />
              {errors.description && <span className="admin-field-error">{errors.description}</span>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="admin-card">
          <div className="admin-card-title">Pricing & Inventory</div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-label">Price (₹) *</label>
              <input className={`admin-input ${errors.price ? 'error' : ''}`} type="number" min="0" value={form.price} onChange={e => set('price', e.target.value)} />
              {errors.price && <span className="admin-field-error">{errors.price}</span>}
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Sale Price (₹)</label>
              <input className="admin-input" type="number" min="0" value={form.salePrice} onChange={e => set('salePrice', e.target.value)} placeholder="Leave blank if no sale" />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Stock</label>
              <input className="admin-input" type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-label">Featured</label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '10px', color: 'var(--soft)', fontSize: '0.88rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} />
                Show on homepage
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
              <input className="admin-input" value={form.dimensions} onChange={e => set('dimensions', e.target.value)} />
            </div>
            <div className="admin-form-group full">
              <label className="admin-label">Tags <span style={{ color: 'var(--muted)' }}>comma separated</span></label>
              <input className="admin-input" value={form.tags} onChange={e => set('tags', e.target.value)} />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="admin-card">
          <div className="admin-card-title">Images</div>
          {form.existingImages?.length > 0 && (
            <div style={{ marginBottom: '16px' }}>
              <p className="admin-label" style={{ marginBottom: '10px' }}>Current Images</p>
              <div className="image-previews">
                {form.existingImages.map((url, i) => (
                  <div key={i} className="image-preview-item">
                    <img src={url} alt={`Product ${i + 1}`} />
                    <button className="image-preview-remove" onClick={() => removeExisting(url)}>✕</button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <label className="image-upload-area" htmlFor="edit-images">
            <div style={{ fontSize: '2rem' }}>➕</div>
            <p>Upload additional images</p>
          </label>
          <input id="edit-images" type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleNewImages} />
          {previews.length > 0 && (
            <div className="image-previews" style={{ marginTop: '14px' }}>
              {previews.map((src, i) => (
                <div key={i} className="image-preview-item">
                  <img src={src} alt={`New ${i + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={() => navigate('/admin/products')} className="admin-action-btn" style={{ padding: '14px 28px' }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} className="btn-primary" style={{ opacity: saving ? 0.6 : 1 }}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </main>
    </div>
  );
}