import { ArrowUpRight, Braces, Brush, Lightbulb, Wrench } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';

const icons = { Frontend: Braces, Styling: Brush, Tools: Wrench, Strengths: Lightbulb };

export function SkillCard({ group, index = 0 }) {
  const Icon = icons[group.title] || Braces;
  return (
    <Card className="skill-card" as="article">
      <div className="skill-card__top"><span>{String(index + 1).padStart(2, '0')}</span><Icon aria-hidden="true" /></div>
      <h2>{group.title}</h2>
      <p>{group.description}</p>
      <div className="badge-list">{group.items.map((item) => <Badge key={item}>{item}</Badge>)}</div>
      <ArrowUpRight className="skill-card__arrow" aria-hidden="true" />
    </Card>
  );
}
