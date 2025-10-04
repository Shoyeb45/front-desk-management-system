// src/components/theme-toggle.tsx
'use client';

import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const getIcon = () => {
    if (theme === 'light') return '☀️';
    if (theme === 'dark') return '🌙';
    return '💻';
  };

  return (
    <button
      onClick={cycleTheme}
      className="p-2 rounded-lg bg-background-secondary border border-border 
                 hover:bg-background-tertiary transition-colors"
      aria-label="Toggle theme"
    >
      <span className="text-xl">{getIcon()}</span>
    </button>
  );
}