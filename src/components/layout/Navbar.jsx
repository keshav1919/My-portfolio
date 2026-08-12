import { Menu, Moon, Settings, Sun, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { mainNavigation } from '../../data/navigation';
import { BrandMark } from '../common/BrandMark';

export function Navbar() {
  const { theme, setPreference } = useTheme();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);
  useEffect(() => {
    if (!open) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [open]);

  return (
    <header className={`topbar ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''}`}>
      <div className="container topbar__inner">
        <NavLink className="brand" to="/home" aria-label="Keshav home"><BrandMark /></NavLink>
        <div className="topbar__actions">
          <button className="theme-button" onClick={() => setPreference(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>
          <NavLink className="nav-cta" to="/contact">Let&apos;s talk <span aria-hidden="true">↗</span></NavLink>
          <button className="menu-button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="primary-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      <nav id="primary-navigation" className={`desktop-nav ${open ? 'is-open' : ''}`} aria-label="Primary navigation">
        <span className="mobile-menu-label">Navigation</span>
        {mainNavigation.map(({ label, path, icon: Icon }, index) => (
          <NavLink key={path} to={path}>
            <span className="desktop-nav__index">{String(index + 1).padStart(2, '0')}</span>
            <span>{label}</span>
            <Icon className="desktop-nav__mobile-icon" aria-hidden="true" />
          </NavLink>
        ))}
        <div className="mobile-menu-footer">
          <NavLink to="/settings"><Settings aria-hidden="true" /> Settings</NavLink>
          <a className="button" href="mailto:keshav8847426788@gmail.com">Let&apos;s talk <span aria-hidden="true">↗</span></a>
        </div>
      </nav>
    </header>
  );
}
