import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { mainNavigation } from '../../data/navigation';

const quickLinkPaths = ['/home', '/projects', '/skills', '/about', '/contact'];

export function MobileBottomNav() {
  const [isHidden, setIsHidden] = useState(false);
  const navigationItems = quickLinkPaths.map((path) => mainNavigation.find((item) => item.path === path));

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`mobile-bottom-nav ${isHidden ? 'is-hidden' : ''}`} aria-label="Quick navigation">
      {navigationItems.map(({ label, path, icon: Icon }) => (
        <NavLink key={path} to={path} aria-label={label}>
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
