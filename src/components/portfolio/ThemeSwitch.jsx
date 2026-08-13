import { Monitor, Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const options = [
  { id: 'dark', label: 'Deep dark', icon: Moon },
  { id: 'light', label: 'Soft light', icon: Sun },
  { id: 'system', label: 'System', icon: Monitor }
];

export function ThemeSwitch() {
  const { preference, setPreference } = useTheme();

  const handleSelect = (e, id) => {
    if (document.startViewTransition && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      const x = e?.clientX ?? window.innerWidth / 2;
      const y = e?.clientY ?? window.innerHeight / 2;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = document.startViewTransition(() => {
        setPreference(id);
      });

      transition.ready.then(() => {
        const clipPath = [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ];
        document.documentElement.animate(
          { clipPath: [clipPath[0], clipPath[1]] },
          {
            duration: 450,
            easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      });
    } else {
      setPreference(id);
    }
  };

  return (
    <div className="theme-switch" role="radiogroup" aria-label="Theme selection">
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          role="radio"
          aria-checked={preference === id}
          className={preference === id ? 'is-active' : ''}
          onClick={(e) => handleSelect(e, id)}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
