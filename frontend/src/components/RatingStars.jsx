import React from 'react';
import './RatingStars.css';

export default function RatingStars({ rating, count, size = 'sm' }) {
  const full  = Math.floor(rating);
  const half  = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className={`stars stars-${size}`}>
      {Array(full).fill(0).map((_, i) => <span key={`f${i}`} className="star">★</span>)}
      {half && <span className="star half">★</span>}
      {Array(empty).fill(0).map((_, i) => <span key={`e${i}`} className="star empty">★</span>)}
      {count !== undefined && <span className="review-count">({count})</span>}
    </div>
  );
}