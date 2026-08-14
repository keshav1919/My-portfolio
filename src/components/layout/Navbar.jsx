import { Menu, Moon, Sun, X, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { mainNavigation } from '../../data/navigation';
import { BrandMark } from '../common/BrandMark';
import { Avatar } from '../ui/Avatar';
import { ProfileMenuDropdown } from './ProfileMenuDropdown';

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { user, profile } = useAuth();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);

  // Universal scroll hide/reveal animation across all devices
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Scroll Down -> hide header upward
      if (currentScrollY > lastScrollY && currentScrollY > 40 && !avatarMenuOpen && !open) {
        setIsHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scroll Up -> reveal header downward
        setIsHidden(false);
      }
      lastScrollY = Math.max(0, currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [avatarMenuOpen, open]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 15);
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  
  // Close menu and dropdown on route change
  useEffect(() => {
    setOpen(false);
    setAvatarMenuOpen(false);
    setIsHidden(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  // Close on Escape key
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setAvatarMenuOpen(false);
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, []);

  return (
    <header className={`topbar ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-menu-open' : ''} ${isHidden ? 'is-hidden' : ''}`}>
      <div className="topbar__inner">
        <NavLink className="brand" to="/home" aria-label="Keshav home" onClick={() => { setOpen(false); setAvatarMenuOpen(false); }}><BrandMark /></NavLink>

        {/* Desktop Navigation Links */}
        <nav id="primary-navigation" className="desktop-nav" aria-label="Primary navigation">
          {mainNavigation.map(({ label, path }) => (
            <NavLink key={path} to={path}>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right Topbar Actions */}
        <div className="topbar__actions">
          {/* Desktop Theme Switch */}
          <button
            className="theme-button hidden sm:grid"
            onClick={() => toggleTheme()}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          >
            {theme === 'dark' ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
          </button>

          {/* Desktop CTA */}
          <NavLink className="nav-cta hidden lg:inline-flex" to="/contact">
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </NavLink>

          {/* Profile Button (Always placed on the right) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setOpen(false);
                setAvatarMenuOpen((v) => !v);
              }}
              className="nav-avatar-btn"
              aria-label="Open user profile menu"
              aria-expanded={avatarMenuOpen}
            >
              {user ? (
                <Avatar avatarId={profile?.avatarId || 'avatar-01'} size={36} />
              ) : (
                <User className="w-4 h-4 text-kc-accent" />
              )}
            </button>

            {avatarMenuOpen && (
              <ProfileMenuDropdown onClose={() => setAvatarMenuOpen(false)} />
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <button
            className="menu-button hidden"
            onClick={() => { setAvatarMenuOpen(false); setOpen((value) => !value); }}
            aria-expanded={open}
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
export default Navbar;
