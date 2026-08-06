import { AnimatedCard } from '../common/AnimatedCard';
export function StatCard({ label, value, icon: Icon, delay = 0 }) {
  return <AnimatedCard className="stat-card" delay={delay}><Icon aria-hidden="true" /><strong>{value}</strong><span>{label}</span></AnimatedCard>;
}
