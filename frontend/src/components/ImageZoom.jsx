import React, { useState, useRef } from 'react';

export default function ImageZoom({ src, alt }) {
  const [zoomed,   setZoomed]   = useState(false);
  const [pos,      setPos]      = useState({ x: 50, y: 50 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    setPos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
      onMouseEnter={() => setZoomed(true)}
      onMouseLeave={() => setZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: '100%', height: '100%', objectFit: 'cover',
          transform: zoomed ? 'scale(2)' : 'scale(1)',
          transformOrigin: `${pos.x}% ${pos.y}%`,
          transition: zoomed ? 'transform 0.1s ease' : 'transform 0.4s ease',
          display: 'block',
        }}
        onError={e => { e.target.style.opacity = '0.3'; }}
      />
    </div>
  );
}