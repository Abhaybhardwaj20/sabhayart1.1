import React from 'react';
import './LoadingSkeleton.css';

export function CardSkeleton() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-body">
        <div className="skeleton-line short shimmer" />
        <div className="skeleton-line shimmer" />
        <div className="skeleton-line medium shimmer" />
        <div className="skeleton-footer shimmer" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 6 }) {
  return (
    <div className="grid">
      {Array(count).fill(0).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
}