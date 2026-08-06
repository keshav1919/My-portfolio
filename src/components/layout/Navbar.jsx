import { Github, Moon, Sun } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { mainNavigation } from '../../data/navigation';
import { profile } from '../../data/profile';
import { useTheme } from '../../context/ThemeContext';

export function Navbar() {
  const { theme, setPreference } = useTheme();
  return (
    <header className="topbar">
      <div className="container topbar__inner">
        <NavLink to="/home" className="brand" aria-label="Keshav home">
          <span className="brand__mark"><img src={profile.brandLogo} alt="" /></span>
          <span className="brand__identity"><strong>Keshav <span>Coder</span></strong><small>Frontend developer</small></span>
        </NavLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {mainNavigation.map(({ label, path, icon: Icon }) => <NavLink key={path} to={path}><Icon aria-hidden="true" /><span>{label}</span></NavLink>)}
        </nav>
        <div className="topbar__actions">
          <a className="header-github" href={profile.github} target="_blank" rel="noopener noreferrer"><Github aria-hidden="true" /><span>GitHub</span></a>
          <button className="icon-button" aria-label={`Switch to ${theme === 'dark' ? 'electric' : 'midnight'} palette`} onClick={() => setPreference(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>
        </div>
      </div>
    </header>
  );
}
