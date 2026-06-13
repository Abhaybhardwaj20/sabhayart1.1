import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryCard.css';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/shop?category=${category.id}`}
      className="category-card"
    >
      <img
        src={category.image}
        alt={category.label}
        className="category-image"
      />

      <div className="category-overlay" />

      <div className="category-content">
        <div className="category-icon">
          {category.emoji}
        </div>

        <h3>{category.label}</h3>

        <p>{category.count} works</p>
      </div>
    </Link>
  );
}