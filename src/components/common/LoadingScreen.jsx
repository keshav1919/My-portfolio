import { useLocation } from 'react-router-dom';

function SkeletonLine({ className = '' }) {
  return <span className={`skeleton-block ${className}`.trim()} />;
}

export function LoadingScreen() {
  const { pathname } = useLocation();
  const homeLayout = pathname === '/home';

  return (
    <div className={`container route-skeleton ${homeLayout ? 'route-skeleton--home' : 'route-skeleton--inner'}`} role="status" aria-live="polite" aria-label="Loading page content">
      <span className="sr-only">Loading page content</span>
      <div className="route-skeleton__intro">
        <SkeletonLine className="skeleton-block--eyebrow" />
        <SkeletonLine className="skeleton-block--title" />
        <SkeletonLine className="skeleton-block--title skeleton-block--title-short" />
        <SkeletonLine className="skeleton-block--copy" />
        <SkeletonLine className="skeleton-block--copy skeleton-block--copy-short" />
        <div className="route-skeleton__actions"><SkeletonLine /><SkeletonLine /></div>
      </div>
      <div className="route-skeleton__visual"><SkeletonLine className="skeleton-block--visual-bar" /><div><SkeletonLine /><SkeletonLine /><SkeletonLine /></div></div>
      <div className="route-skeleton__cards"><SkeletonLine /><SkeletonLine /><SkeletonLine /></div>
    </div>
  );
}
