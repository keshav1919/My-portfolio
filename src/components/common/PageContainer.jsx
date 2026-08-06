export function PageContainer({ children, className = '' }) {
  return <div className={`container page-container ${className}`.trim()}>{children}</div>;
}
