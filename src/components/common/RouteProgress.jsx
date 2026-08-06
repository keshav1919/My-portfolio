import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteProgress() {
  const { pathname } = useLocation();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
    const frame = window.requestAnimationFrame(() => setActive(true));
    const done = window.setTimeout(() => setActive(false), 880);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [pathname]);

  return (
    <div className={`route-progress ${active ? 'is-active' : ''}`} role="progressbar" aria-label="Loading page">
      <span key={pathname} />
    </div>
  );
}
