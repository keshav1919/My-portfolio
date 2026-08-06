import { NavLink } from 'react-router-dom';
import { mainNavigation } from '../../data/navigation';

export function MobileBottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {mainNavigation.map(({ label, path, icon: Icon }) => (
        <NavLink key={path} to={path} aria-label={label}><Icon size={20} /><span>{label}</span></NavLink>
      ))}
    </nav>
  );
}
