import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../constants/site';
import { safeStorage } from '../utils/storage';

const ThemeContext = createContext(null);
const getSystemTheme = () => (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

export function ThemeProvider({ children }) {
  const [preference, setPreference] = useState(() => safeStorage.get(STORAGE_KEYS.theme, 'dark'));
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);
  const theme = preference === 'system' ? systemTheme : preference;

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!media) return undefined;
    const update = (event) => setSystemTheme(event.matches ? 'dark' : 'light');
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, []);

  // Update theme on document element (Never animated on direct page load/refresh)
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    safeStorage.set(STORAGE_KEYS.theme, preference);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#0b0a14' : '#f8f8fc';
  }, [theme, preference]);

  /**
   * Premium circular expanding theme switch animation:
   * Consistently starts from TOP-RIGHT corner and expands toward BOTTOM-LEFT for both modes.
   */
  const toggleTheme = useCallback(() => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    // Respect prefers-reduced-motion or fallback if View Transitions API is unsupported
    if (
      !document.startViewTransition ||
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setPreference(nextTheme);
      return;
    }

    // Always start strictly from TOP-RIGHT corner (x = right edge, y = top edge)
    const x = window.innerWidth;
    const y = 0;

    // Full diagonal distance from top-right corner to bottom-left corner
    const endRadius = Math.hypot(window.innerWidth, window.innerHeight);

    const transition = document.startViewTransition(() => {
      setPreference(nextTheme);
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 800,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          pseudoElement: '::view-transition-new(root)',
        }
      );
    });
  }, [theme]);

  const value = useMemo(() => ({ theme, preference, setPreference, toggleTheme }), [theme, preference, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
export default ThemeProvider;
