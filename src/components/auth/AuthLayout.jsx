import React from 'react';
import { Link } from 'react-router-dom';
import { BrandMark } from '../common/BrandMark';
import { Sun, Moon, ArrowLeft } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export function AuthLayout({ children, title, subtitle }) {
  const { theme, setPreference } = useTheme();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-kc-bg text-kc-text selection:bg-kc-accent-surface selection:text-[#090909]">
      {/* Top Bar */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link to="/home" className="flex items-center gap-2 text-kc-muted hover:text-kc-text text-sm font-semibold transition-colors group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Portfolio</span>
        </Link>
        <button
          type="button"
          onClick={() => setPreference(theme === 'dark' ? 'light' : 'dark')}
          className="theme-button"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Form Center */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[460px] animate-slide-up">
          <div className="text-center mb-6">
            <Link to="/home" className="inline-block mb-3">
              <BrandMark />
            </Link>
            {title && <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-kc-text mb-2">{title}</h1>}
            {subtitle && <p className="text-sm text-kc-muted max-w-sm mx-auto">{subtitle}</p>}
          </div>

          <div className="kc-card p-6 sm:p-8 bg-kc-surface/95 backdrop-blur-md shadow-kc-lg">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 text-center text-xs text-kc-muted">
        <span>&copy; {new Date().getFullYear()} KeshavCoder. All rights reserved.</span>
      </footer>
    </div>
  );
}
