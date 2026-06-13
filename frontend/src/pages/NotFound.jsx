import { Link } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-art">🎨</div>
      <h1 className="notfound-code">404</h1>
      <h2 className="notfound-title">This canvas is blank</h2>
      <p className="notfound-msg">The page you're looking for doesn't exist or has been moved.</p>
      <div className="notfound-actions">
        <Link to="/" className="notfound-btn">Go home</Link>
        <Link to="/shop" className="notfound-btn notfound-btn--outline">Browse paintings</Link>
      </div>
    </div>
  );
}