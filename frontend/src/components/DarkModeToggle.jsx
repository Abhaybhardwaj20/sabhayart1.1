import React from 'react';
import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Light mode' : 'Dark mode'}
      style={{
        background: 'none', border: '1px solid var(--border)',
        color: 'var(--soft)', width: '38px', height: '38px',
        borderRadius: '50%', fontSize: '1.1rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.3s', cursor: 'pointer',
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}