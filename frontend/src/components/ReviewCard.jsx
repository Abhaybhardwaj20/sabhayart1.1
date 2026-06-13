import React from 'react';
import RatingStars from './RatingStars';
import './ReviewCard.css';

export default function ReviewCard({ review }) {
  return (
    <div className="review-card">
      <div className="review-top">
        <div className="review-avatar">{review.avatar || '✨'}</div>
        <div>
          <div className="review-name">{review.name}</div>
          <div className="review-location">{review.location}</div>
        </div>
      </div>
      <RatingStars rating={review.rating} size="sm" />
      <p className="review-text">"{review.text}"</p>
      {review.painting && (
        <div className="review-painting-tag">Purchased: {review.painting}</div>
      )}
    </div>
  );
}