import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromWishlist, clearWishlist } from '../redux/wishlistSlice';
import './Wishlist.css';

export default function Wishlist() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);

  if (items.length === 0) {
    return (
      <div className="wishlist-empty">
        <span className="wishlist-empty-icon">🤍</span>
        <h2>Your wishlist is empty</h2>
        <p>Save paintings you love and come back to them anytime.</p>
        <Link to="/shop" className="wishlist-cta">Browse paintings</Link>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>Wishlist <span className="wishlist-count">{items.length}</span></h1>
        <button className="wishlist-clear" onClick={() => dispatch(clearWishlist())}>
          Clear all
        </button>
      </div>

      <div className="wishlist-grid">
        {items.map((item) => (
          <div key={item.id} className="wishlist-card">
            <Link to={`/product/${item.id}`} className="wishlist-img-wrap">
              <img src={item.image} alt={item.name} className="wishlist-img" />
            </Link>
            <div className="wishlist-info">
              <Link to={`/product/${item.id}`} className="wishlist-name">{item.name}</Link>
              <p className="wishlist-price">₹{item.price?.toLocaleString('en-IN')}</p>
              <div className="wishlist-actions">
                <Link to={`/product/${item.id}`} className="wishlist-btn">View painting</Link>
                <button
                  className="wishlist-remove"
                  onClick={() => dispatch(removeFromWishlist(item.id))}
                  aria-label="Remove from wishlist"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}