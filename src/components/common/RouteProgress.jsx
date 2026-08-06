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
      <span className="route-progress__line" key={`line-${pathname}`} />
      <span className="route-progress__storm" key={`storm-${pathname}`} aria-hidden="true">
        <i className="route-progress__branch route-progress__branch--one" />
        <i className="route-progress__branch route-progress__branch--two" />
        <i className="route-progress__branch route-progress__branch--three" />
      </span>
    </div>
  );
}
