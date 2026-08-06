import { Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { mainNavigation } from '../../data/navigation';
import { profile } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const { theme, setPreference } = useTheme();
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <NavLink to="/home" className="brand" aria-label="Keshav home"><span><img src={profile.brandLogo} alt="" /></span><strong>Keshav</strong></NavLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {mainNavigation.map(({ label, path }) => <NavLink key={path} to={path}>{label}</NavLink>)}
        </nav>
        <button className="icon-button" aria-label={`Switch to ${theme === 'dark' ? 'electric' : 'midnight'} palette`} onClick={() => setPreference(theme === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? <Sun /> : <Moon />}
        </button>
      </div>
    </header>
  );
}
