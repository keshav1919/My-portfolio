import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const options = [{ id: 'light', label: 'Light', icon: Sun }, { id: 'dark', label: 'Dark', icon: Moon }, { id: 'system', label: 'System', icon: Monitor }];
export function ThemeSwitch() {
  const { preference, setPreference } = useTheme();
  return <div className="theme-switch" role="radiogroup" aria-label="Theme selection">{options.map(({ id, label, icon: Icon }) => (
    <button key={id} role="radio" aria-checked={preference === id} className={preference === id ? 'is-active' : ''} onClick={() => setPreference(id)}><Icon /><span>{label}</span></button>
  ))}</div>;
}
