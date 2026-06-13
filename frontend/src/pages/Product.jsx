import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../redux/wishlistSlice';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import ProductGallery from '../components/ProductGallery';
import RatingStars from '../components/RatingStars';
import RelatedProducts from '../components/RelatedProducts';
import RecentlyViewed from '../components/RecentlyViewed';
import './Product.css';

const SIZES = [
  { label: '8″ × 10″',  value: '8x10',  multiplier: 1.00 },
  { label: '12″ × 16″', value: '12x16', multiplier: 1.17 },  // ~17% increase
  { label: '16″ × 20″', value: '16x20', multiplier: 1.31 },  // additional ~12% on top
];

// Normalize DB painting shape to what the page/components expect
const normalize = (p) => ({
  ...p,
  id: p._id,
  image: p.images?.[0]?.url || '',
  images: (p.images || []).map(img => img.url || img),
  reviews: p.numReviews || 0,
  style: p.medium || '',
  size: p.dimensions ? `${p.dimensions.width}${p.dimensions.unit} × ${p.dimensions.height}${p.dimensions.unit}` : '',
  inStock: p.stock > 0,
  originalPrice: p.originalPrice || null,
});

export default function Product() {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const dispatch    = useDispatch();
  const wishlisted  = useSelector(selectIsWishlisted(id));
  const [painting, setPainting]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [added, setAdded]           = useState(false);
  const [selectedSize, setSelectedSize] = useState('12x16');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(ENDPOINTS.PRODUCT(id));
        const p = data.data?.painting || data.data || data.painting || data;
        setPainting(normalize(p));
      } catch {
        setPainting(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const currentSize  = SIZES.find(s => s.value === selectedSize);
  const sizePrice    = painting ? Math.round(painting.price * currentSize.multiplier / 10) * 10 : 0;
  const sizeOriginal = painting?.originalPrice ? Math.round(painting.originalPrice * currentSize.multiplier / 10) * 10 : 0;
  const sizeDiscount = sizeOriginal ? Math.round(((sizeOriginal - sizePrice) / sizeOriginal) * 100) : 0;

  useEffect(() => {
    if (!painting) return;
    try {
      const prev  = JSON.parse(localStorage.getItem('sabhaya_recently_viewed') || '[]');
      const clean = prev.filter(p => p.id !== painting.id);
      localStorage.setItem('sabhaya_recently_viewed', JSON.stringify([painting, ...clean].slice(0, 10)));
    } catch {}
    window.scrollTo(0, 0);
  }, [painting]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 48px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--white)' }}>
          Loading…
        </h2>
      </div>
    );
  }

  if (!painting) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 48px' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '2rem', color: 'var(--white)', marginBottom: '16px' }}>
          Painting not found
        </h2>
        <button onClick={() => navigate('/shop')}
          style={{ color: 'var(--gold)', background: 'none', border: '1px solid var(--border2)', padding: '12px 28px', borderRadius: '30px', cursor: 'pointer', fontFamily: "'Outfit',sans-serif" }}>
          ← Back to Shop
        </button>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addToCart({ ...painting, selectedSize, price: sizePrice }));
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="product-page">
      <div className="product-container">

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>Home</span>
          <span>›</span>
          <span onClick={() => navigate('/shop')} style={{ cursor: 'pointer' }}>Shop</span>
          <span>›</span>
          <span onClick={() => navigate(`/shop?category=${painting.category.toLowerCase()}`)}
            style={{ cursor: 'pointer' }}>{painting.category}</span>
          <span>›</span>
          <span style={{ color: 'var(--white)' }}>{painting.title}</span>
        </div>

        <div className="product-grid">

          {/* Gallery */}
          <div className="product-gallery">
            <ProductGallery
              images={painting.images?.length ? painting.images : [painting.image]}
              title={painting.title}
            />
          </div>

          {/* Details */}
          <div className="product-details">
            {painting.badge && (
              <div className={`prod-badge ${painting.badge}`}>
                {painting.badge === 'bestseller' ? '🔥 Bestseller' : '🆕 New Arrival'}
              </div>
            )}

            <h1 className="prod-title">{painting.title}</h1>
            <p className="prod-category">
              {painting.category} · {painting.style} · {painting.size}
            </p>

            <div className="prod-rating">
              <RatingStars rating={painting.rating} size="md" />
              <span className="prod-review-count">{painting.reviews} reviews</span>
            </div>

            <div className="prod-price-row">
              <span className="prod-price">₹{sizePrice.toLocaleString('en-IN')}</span>
              {sizeOriginal > 0 && (
                <>
                  <span className="prod-original">₹{sizeOriginal.toLocaleString('en-IN')}</span>
                  <span className="prod-discount">{sizeDiscount}% off</span>
                </>
              )}
            </div>

            <p className="prod-description">{painting.description}</p>

            <div className="prod-specs">
              {[
                { label: 'Medium',      value: painting.style },
                { label: 'Canvas Size', value: painting.size },
                { label: 'Category',    value: painting.category },
                { label: 'Handmade',    value: '100% Original' },
              ].map(spec => (
                <div key={spec.label} className="spec-row">
                  <span className="spec-label">{spec.label}</span>
                  <span className="spec-value">{spec.value}</span>
                </div>
              ))}
            </div>

            {/* ── Canvas Size Selector — above Add to Cart ── */}
            <div className="prod-size-section">
              <div className="prod-size-header">
                <span className="prod-size-title">Canvas Size</span>
                <span className="prod-size-selected">
                  {SIZES.find(s => s.value === selectedSize)?.label}
                </span>
              </div>
              <div className="prod-size-options">
                {SIZES.map((s) => (
                  <button
                    key={s.value}
                    className={`prod-size-btn${selectedSize === s.value ? ' prod-size-btn--active' : ''}`}
                    onClick={() => setSelectedSize(s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Actions ── */}
            <div className="prod-actions">
              {painting.inStock ? (
                <>
                  <button className="btn-add-cart" onClick={handleAddToCart}>
                    {added ? '✓ Added to Cart!' : '🛒 Add to Cart'}
                  </button>
                  <button
                    className={`btn-wishlist ${wishlisted ? 'active' : ''}`}
                    onClick={() => dispatch(toggleWishlist(painting))}
                  >
                    {wishlisted ? '♥' : '♡'}
                  </button>
                </>
              ) : (
                <button className="btn-add-cart sold-out" disabled>Sold Out</button>
              )}
            </div>

            <div className="prod-trust">
              {[
                { icon: '🚚', text: 'Free shipping above ₹999' },
                { icon: '📦', text: 'Bubble-wrapped & secure' },
                { icon: '↩️', text: '7-day return for damaged pieces' },
                { icon: '🎨', text: '100% original, handmade' },
              ].map((t, i) => (
                <div key={i} className="trust-pill">
                  <span>{t.icon}</span>
                  <span>{t.text}</span>
                </div>
              ))}
            </div>

            <div className="prod-whatsapp">
              <a
                href={`https://wa.me/917973364858?text=Hi! I'm interested in "${painting.title}" (₹${sizePrice.toLocaleString('en-IN')})`}
                target="_blank"
                rel="noopener noreferrer"
                className="wa-order-btn"
              >
                💬 Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      <RelatedProducts currentId={painting.id} category={painting.category} />
      <RecentlyViewed currentId={painting.id} />
    </div>
  );
}