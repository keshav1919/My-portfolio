export function Card({ children, className = '', as: Tag = 'div' }) {
  return <Tag className={`card ${className}`.trim()}>{children}</Tag>;
}
