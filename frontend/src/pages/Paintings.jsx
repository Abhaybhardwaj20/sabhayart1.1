import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toggleWishlist, selectIsWishlisted } from '../redux/wishlistSlice';
import useProduct from '../hooks/useProduct';
import './Paintings.css';

function PaintingCard({ painting }) {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(painting._id));

  return (
    <div className="painting-card">
      <Link to={`/product/${painting._id}`} className="painting-img-wrap">
        <img src={painting.images?.[0]} alt={painting.name} className="painting-img" />
        {painting.isFeatured && <span className="painting-badge">Featured</span>}
      </Link>
      <button
        className={`painting-wishlist${isWishlisted ? ' painting-wishlist--active' : ''}`}
        onClick={() => dispatch(toggleWishlist({ id: painting._id, name: painting.name, image: painting.images?.[0], price: painting.price }))}
        aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        {isWishlisted ? '❤️' : '🤍'}
      </button>
      <div className="painting-info">
        <Link to={`/product/${painting._id}`} className="painting-name">{painting.name}</Link>
        <p className="painting-meta">{painting.dimensions} · {painting.medium}</p>
        <p className="painting-price">₹{painting.price?.toLocaleString('en-IN')}</p>
      </div>
    </div>
  );
}

export default function Paintings() {
  const { items, loading, error, fetchAll, filters, updateFilters, pagination, goToPage, totalCount } = useProduct();

  useEffect(() => { fetchAll(); }, []);

  if (error) return <div className="paintings-error"><p>{error}</p></div>;

  return (
    <div className="paintings-page">
      <div className="paintings-header">
        <h1>All Paintings</h1>
        <p>{totalCount} original canvas painting{totalCount !== 1 ? 's' : ''}</p>
      </div>

      {/* Filters bar */}
      <div className="paintings-filters">
        <select value={filters.category || ''} onChange={(e) => updateFilters({ category: e.target.value || undefined })}>
          <option value="">All categories</option>
          <option value="abstract">Abstract</option>
          <option value="landscape">Landscape</option>
          <option value="floral">Floral</option>
          <option value="portrait">Portrait</option>
          <option value="spiritual">Spiritual</option>
        </select>
        <select value={filters.sort || ''} onChange={(e) => updateFilters({ sort: e.target.value || undefined })}>
          <option value="">Sort: Default</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="newest">Newest first</option>
        </select>
        <select value={filters.priceRange || ''} onChange={(e) => updateFilters({ priceRange: e.target.value || undefined })}>
          <option value="">All prices</option>
          <option value="0-2000">Under ₹2,000</option>
          <option value="2000-5000">₹2,000 – ₹5,000</option>
          <option value="5000-10000">₹5,000 – ₹10,000</option>
          <option value="10000+">Above ₹10,000</option>
        </select>
      </div>

      {loading ? (
        <div className="paintings-loading">
          <div className="paintings-spinner" />
        </div>
      ) : items.length === 0 ? (
        <div className="paintings-empty">
          <p>No paintings found for the selected filters.</p>
          <button onClick={() => updateFilters({})}>Clear filters</button>
        </div>
      ) : (
        <>
          <div className="paintings-grid">
            {items.map((p) => <PaintingCard key={p._id} painting={p} />)}
          </div>

          {/* Pagination */}
          {pagination?.totalPages > 1 && (
            <div className="paintings-pagination">
              <button disabled={pagination.currentPage === 1} onClick={() => goToPage(pagination.currentPage - 1)}>←</button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} className={p === pagination.currentPage ? 'active' : ''} onClick={() => goToPage(p)}>{p}</button>
              ))}
              <button disabled={pagination.currentPage === pagination.totalPages} onClick={() => goToPage(pagination.currentPage + 1)}>→</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}