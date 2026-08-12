import { NavLink } from 'react-router-dom';
import { mainNavigation } from '../../data/navigation';

const quickLinkPaths = ['/home', '/projects', '/skills', '/about', '/contact'];

export function MobileBottomNav() {
  const navigationItems = quickLinkPaths.map((path) => mainNavigation.find((item) => item.path === path));

  return (
    <nav className="mobile-bottom-nav" aria-label="Quick navigation">
      {navigationItems.map(({ label, path, icon: Icon }) => (
        <NavLink key={path} to={path} aria-label={label}>
          <Icon aria-hidden="true" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
