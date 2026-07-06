import React, { useEffect, useState } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  return [theme, setTheme];
}

export default function ThemeToggle(){
  const [theme, setTheme] = useTheme();

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="px-3 py-2 rounded-lg bg-white/10 text-white/90 dark:bg-black/10"
    >
      {theme === 'light' ? '🌞 Light' : '🌙 Dark'}
    </button>
  );
}
