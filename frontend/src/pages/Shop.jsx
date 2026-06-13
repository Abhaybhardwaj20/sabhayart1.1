import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PaintingCard from '../components/PaintingCard';
import API from '../api/axios';
import { ENDPOINTS } from '../api/endpoints';
import './Shop.css';

const CATEGORIES = [
  'All',
  'Abstract',
  'Nature',
  'Landscape',
  'Portrait',
  'Floral',
  'Spiritual',
];

const STYLES = [
  'Acrylic',
  'Oil',
  'Watercolour',
  'Mixed Media',
];

const SIZES = [
  'Small',
  'Medium',
  'Large',
  'XL',
];

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest First' },
];

// Normalize DB painting shape to what PaintingCard expects
const normalize = (p) => ({
  ...p,
  id: p._id,
  image: p.images?.[0]?.url || p.image || '',
  reviews: p.numReviews || 0,
});

export default function Shop() {
  const [searchParams] = useSearchParams();

  const [activeCategory, setActiveCategory] = useState(
    searchParams.get('category') || 'all'
  );

  const [activeStyle, setActiveStyle] = useState('');
  const [activeSize, setActiveSize] = useState('');

  const [sort, setSort] = useState('default');
  const [maxPrice, setMaxPrice] = useState(10000);

  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Fetch paintings from API once on mount
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(ENDPOINTS.PRODUCTS);
        const list = data.data?.paintings || data.paintings || [];
        setPaintings(list.map(normalize));
      } catch {
        setPaintings([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    let result = [...paintings];

    // Category Filter
    if (activeCategory !== 'all') {
      result = result.filter(
        painting =>
          painting.category?.toLowerCase() ===
          activeCategory.toLowerCase()
      );
    }

    // Badge Filter
    const badge = searchParams.get('badge');

    if (badge) {
      result = result.filter(
        painting => painting.badge === badge
      );
    }

    // Price Filter
    result = result.filter(
      painting => painting.price <= maxPrice
    );

    // Sorting
    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;

      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;

      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;

      case 'newest':
        result.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      default:
        break;
    }

    setFiltered(result);
  }, [
    paintings,
    activeCategory,
    activeStyle,
    activeSize,
    maxPrice,
    sort,
    searchParams,
  ]);

  return (
    <div className="shop-page">

      {/* TOP FILTER BAR */}

      <div className="filter-bar">

        <button
          className="filter-toggle-btn"
          onClick={() =>
            setSidebarOpen(prev => !prev)
          }
        >
          {sidebarOpen
            ? '← Hide Filters'
            : '☰ Filters'}
        </button>

        <div className="filter-sep" />

        {CATEGORIES.map(category => (
          <button
            key={category}
            className={`fpill ${
              activeCategory ===
                category.toLowerCase()
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setActiveCategory(
                category.toLowerCase()
              )
            }
          >
            {category}
          </button>
        ))}

        <div className="filter-sep" />

        <select
          className="sort-select"
          value={sort}
          onChange={e =>
            setSort(e.target.value)
          }
        >
          {SORT_OPTIONS.map(option => (
            <option
              key={option.value}
              value={option.value}
            >
              {option.label}
            </option>
          ))}
        </select>

      </div>

      {/* BODY */}

      <div className="shop-body">

        {/* SIDEBAR */}

        <aside
          className={`shop-sidebar ${
            sidebarOpen ? '' : 'collapsed'
          }`}
        >

          {/* PRICE */}

          <div className="sidebar-section">

            <span className="sidebar-label">
              Price Range
            </span>

            <div className="price-label">
              <span>₹0</span>
              <span>
                ₹
                {maxPrice.toLocaleString(
                  'en-IN'
                )}
              </span>
            </div>

            <input
              type="range"
              min="500"
              max="10000"
              step="100"
              value={maxPrice}
              className="price-range"
              onChange={e =>
                setMaxPrice(
                  Number(e.target.value)
                )
              }
            />

          </div>

          <div className="sidebar-divider" />

          {/* CATEGORY */}

          <div className="sidebar-section">

            <span className="sidebar-label">
              Category
            </span>

            {CATEGORIES.map(category => (
              <button
                key={category}
                className={`nav-item ${
                  activeCategory ===
                  category.toLowerCase()
                    ? 'active'
                    : ''
                }`}
                onClick={() =>
                  setActiveCategory(
                    category.toLowerCase()
                  )
                }
              >
                {category}
              </button>
            ))}

          </div>

          <div className="sidebar-divider" />

          {/* STYLE */}

          <div className="sidebar-section">

            <span className="sidebar-label">
              Style
            </span>

            <div className="style-pills">

              {STYLES.map(style => (
                <button
                  key={style}
                  className={`style-pill ${
                    activeStyle === style
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveStyle(
                      activeStyle === style
                        ? ''
                        : style
                    )
                  }
                >
                  {style}
                </button>
              ))}

            </div>

          </div>

          <div className="sidebar-divider" />

          {/* SIZE */}

          <div className="sidebar-section">

            <span className="sidebar-label">
              Canvas Size
            </span>

            <div className="size-pills">

              {SIZES.map(size => (
                <button
                  key={size}
                  className={`size-pill ${
                    activeSize === size
                      ? 'active'
                      : ''
                  }`}
                  onClick={() =>
                    setActiveSize(
                      activeSize === size
                        ? ''
                        : size
                    )
                  }
                >
                  {size}
                </button>
              ))}

            </div>

          </div>

        </aside>

        {/* MAIN */}

        <main className="shop-main">

          <div className="shop-results-header">

            <span className="results-count">
              {filtered.length}{' '}
              painting
              {filtered.length !== 1
                ? 's'
                : ''}
            </span>

          </div>

          {loading ? (

            <div className="no-results">
              <p>Loading paintings…</p>
            </div>

          ) : filtered.length > 0 ? (

            <div className="grid">

              {filtered.map(painting => (
                <PaintingCard
                  key={painting.id}
                  painting={painting}
                />
              ))}

            </div>

          ) : (

            <div className="no-results">

              <span>🎨</span>

              <h3>
                No paintings found
              </h3>

              <p>
                Try changing filters
              </p>

              <button
                onClick={() => {
                  setActiveCategory('all');
                  setActiveStyle('');
                  setActiveSize('');
                  setMaxPrice(10000);
                }}
              >
                Clear All Filters
              </button>

            </div>

          )}

        </main>

      </div>

    </div>
  );
}