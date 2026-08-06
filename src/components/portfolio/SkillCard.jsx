import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { ProgressBar } from './ProgressBar';
export function SkillCard({ group }) {
  return (
    <Card className="skill-card">
      <h2>{group.title}</h2>
      {group.type === 'progress'
        ? <div className="progress-list">{group.items.map((item) => <ProgressBar key={item.name} label={item.name} value={item.value} />)}</div>
        : <div className="badge-list">{group.items.map((item) => <Badge key={item}>{item}</Badge>)}</div>}
    </Card>
  );
}
