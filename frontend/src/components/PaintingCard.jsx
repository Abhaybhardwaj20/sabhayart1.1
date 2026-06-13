import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '../redux/wishlistSlice';
import RatingStars from './RatingStars';
import './PaintingCard.css';

const SIZES = [
  { label: '8″ × 10″',  value: '8x10'  },
  { label: '12″ × 16″', value: '12x16' },
  { label: '16″ × 20″', value: '16x20' },
];

export default function PaintingCard({ painting }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlisted = useSelector(selectIsWishlisted(painting.id));
  const [selectedSize, setSelectedSize] = useState('12x16');

  const handleCart = (e) => {
    e.stopPropagation();
    dispatch(addToCart({ ...painting, selectedSize }));
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    dispatch(toggleWishlist(painting));
  };

  const handleSizeClick = (e, size) => {
    e.stopPropagation();
    setSelectedSize(size);
  };

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${painting.id}`)}
    >
      <div className="card-img">
        <img
          src={painting.image || 'https://via.placeholder.com/400x300'}
          alt={painting.title}
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <div className="card-cat">
          {painting.category || 'Painting'}
        </div>

        <h3 className="card-title">
          {painting.title}
        </h3>

        <RatingStars
          rating={painting.rating || 5}
          count={painting.reviews || 0}
        />

        {/* ── Canvas Size Selector ── */}
        <div className="card-size-row" onClick={(e) => e.stopPropagation()}>
          <span className="card-size-label">Size</span>
          <div className="card-size-options">
            {SIZES.map((s) => (
              <button
                key={s.value}
                className={`card-size-btn${selectedSize === s.value ? ' card-size-btn--active' : ''}`}
                onClick={(e) => handleSizeClick(e, s.value)}
                title={s.label}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className="card-footer">
          <div className="card-price">
            ₹{painting.price?.toLocaleString('en-IN') || 0}
          </div>

          <button
            className="add-btn"
            onClick={handleCart}
          >
            <span>Add to Cart</span>
          </button>

          <button
            className="card-action-btn"
            onClick={handleWishlist}
          >
            {wishlisted ? '❤️' : '♡'}
          </button>
        </div>
      </div>
    </div>
  );
}