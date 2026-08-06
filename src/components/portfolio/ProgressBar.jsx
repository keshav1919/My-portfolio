import { useReveal } from '../../hooks/useReveal';
export function ProgressBar({ label, value }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className="progress-item">
      <div className="progress-item__label"><span>{label}</span><strong>{value}%</strong></div>
      <div className="progress" role="progressbar" aria-label={`${label} proficiency`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={value}>
        <span style={{ '--progress-value': visible ? `${value}%` : '0%' }} />
      </div>
    </div>
  );
}
