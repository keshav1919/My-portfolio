import { useReveal } from '../../hooks/useReveal';
import { Card } from './Card';

export function AnimatedCard({ children, className = '', delay = 0, as }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''}`} style={{ '--reveal-delay': `${delay}ms` }}>
      <Card className={className} as={as}>{children}</Card>
    </div>
  );
}
