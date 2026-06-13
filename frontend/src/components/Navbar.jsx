import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectCartCount } from '../redux/cartSlice';
import { logout } from '../redux/authSlice';
import { paintings } from '../data/paintings';
import './Navbar.css';

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false);
  const [sidebarOpen,   setSidebarOpen]   = useState(false);
  const [searchQuery,   setSearchQuery]   = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch,    setShowSearch]    = useState(false);
  const [categoryOpen,  setCategoryOpen]  = useState(false);

  const cartCount = useSelector(selectCartCount);
  const { user }  = useSelector(s => s.auth);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const location  = useLocation();
  const searchRef = useRef();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    const q = searchQuery.toLowerCase();
    const results = paintings.filter(p =>
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).slice(0, 5);
    setSearchResults(results);
  }, [searchQuery]);

  // Close search on outside click
  useEffect(() => {
    const handler = e => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
        setSearchResults([]);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navLinks = [
    { label: 'Home',    to: '/' },
    { label: 'Shop',    to: '/shop' },
    { label: 'About',   to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  const categories = ['Abstract', 'Nature', 'Landscape', 'Portrait', 'Floral', 'Spiritual'];

  return (
    <>
      {/* Sidebar overlay */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <Link to="/" className="nav-logo" onClick={() => setSidebarOpen(false)}>
              SabhayaArt <span>Studio</span>
            </Link>
          </div>

          <nav className="sidebar-nav">
            <span className="sidebar-label">Navigation</span>
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`nav-item ${location.pathname === link.to ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}

            <span className="sidebar-label" style={{ marginTop: '20px' }}>Categories</span>
            <div
              className={`nav-item ${categoryOpen ? 'open' : ''}`}
              onClick={() => setCategoryOpen(o => !o)}
              style={{ cursor: 'pointer', justifyContent: 'space-between' }}
            >
              <span>Browse All</span>
              <span className="nav-arrow">▶</span>
            </div>
            <div className={`submenu ${categoryOpen ? 'open' : ''}`}>
              {categories.map(cat => (
                <Link
                  key={cat}
                  to={`/shop?category=${cat.toLowerCase()}`}
                  className="sub-item"
                  onClick={() => setSidebarOpen(false)}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </nav>

          {user && (
            <>
              <div className="sidebar-divider" />
              <nav className="sidebar-nav">
                <span className="sidebar-label">Account</span>
                <Link to="/profile"  className="nav-item">My Profile</Link>
                <Link to="/orders"   className="nav-item">My Orders</Link>
                <Link to="/wishlist" className="nav-item">Wishlist</Link>
                <button className="nav-item logout-item" onClick={handleLogout}>Log Out</button>
              </nav>
            </>
          )}

          {user?.role === 'admin' && (
            <>
              <div className="sidebar-divider" />
              <nav className="sidebar-nav">
                <span className="sidebar-label">Admin</span>
                <Link to="/admin"           className="nav-item">Dashboard</Link>
                <Link to="/admin/products"  className="nav-item">Products</Link>
                <Link to="/admin/orders"    className="nav-item">Orders</Link>
                <Link to="/admin/analytics" className="nav-item">Analytics</Link>
              </nav>
            </>
          )}
        </div>
      </aside>

      {/* Main Navbar */}
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <button
          className={`hamburger ${sidebarOpen ? 'open' : ''}`}
          onClick={() => setSidebarOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <Link to="/" className="nav-logo">
          SabhayaArt <span>Studio</span>
        </Link>

        {/* Desktop nav links */}
        <nav className="nav-links-desktop">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link-desktop ${location.pathname === link.to ? 'active' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Search */}
        <div className="nav-search" ref={searchRef}>
          <input
            type="text"
            placeholder="Search paintings..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearch(true)}
          />
          <span className="nav-search-icon">🔍</span>

          {showSearch && searchResults.length > 0 && (
            <div className="search-results show">
              {searchResults.map(p => (
                <div
                  key={p.id}
                  className="search-result-item"
                  onClick={() => {
                    navigate(`/product/${p.id}`);
                    setShowSearch(false);
                    setSearchQuery('');
                  }}
                >
                  <img src={p.image} alt={p.title} className="search-result-thumb" onError={e => e.target.style.display='none'} />
                  <div>
                    <div className="search-result-name">{p.title}</div>
                    <div className="search-result-price">₹{p.price.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="nav-actions">
          <Link to="/wishlist" className="nav-btn icon-btn" title="Wishlist">♡</Link>

          <Link to="/cart" className="nav-btn cart-btn-main">
            <span>🛒</span>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <button className="nav-btn" onClick={handleLogout}>
              <span>👤</span>
              <span className="hide-sm">{user.name?.split(' ')[0]}</span>
            </button>
          ) : (
            <Link to="/login" className="nav-btn login-nav-btn">
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>
    </>
  );
}