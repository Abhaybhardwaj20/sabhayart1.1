import React, { useState } from 'react';
import ImageZoom from './ImageZoom';

export default function ProductGallery({
  images = [],
  title = '',
}) {
  const [active, setActive] = useState(0);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Main Image */}

      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          border: '1px solid var(--border)',
          background: '#f8f5ef',

          minHeight: '650px',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

          padding: '20px',
        }}
      >
        <img
          src={images[active]}
          alt={title}
          style={{
            maxWidth: '100%',
            maxHeight: '600px',

            width: 'auto',
            height: 'auto',

            objectFit: 'contain',
            display: 'block',
          }}
        />
      </div>

      {/* Thumbnails */}

      {images.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: '90px',
                height: '90px',

                borderRadius: '14px',

                overflow: 'hidden',

                cursor: 'pointer',

                background: '#f8f5ef',

                border:
                  i === active
                    ? '2px solid var(--gold)'
                    : '1px solid var(--border)',

                transition: '.3s',
              }}
            >
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}