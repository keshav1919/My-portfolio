import { ExternalLink, Github } from 'lucide-react';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { AppButton } from '../common/AppButton';
import { useReveal } from '../../hooks/useReveal';

export function ProjectCard({ project }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`reveal project-card-wrap ${visible ? 'is-visible' : ''}`}>
      <Card className="project-card" as="article">
        <img src={project.image} alt={`${project.name} project preview`} width="800" height="480" loading="lazy" decoding="async" onError={(e) => { e.currentTarget.hidden = true; }} />
        <div className="project-card__body">
          <span className="project-category">{project.category}</span>
          <h2>{project.name}</h2>
          <p>{project.description}</p>
          <div className="badge-list">{project.technologies.map((tech) => <Badge key={tech}>{tech}</Badge>)}</div>
          <div className="project-actions">
            <AppButton href={project.github || undefined} disabled={!project.github} title={!project.github ? 'GitHub URL is not configured' : undefined} variant="secondary" icon={Github} aria-label={`${project.name} GitHub repository${project.github ? '' : ' unavailable'}`}>GitHub</AppButton>
            <AppButton href={project.demo || undefined} disabled={!project.demo} title={!project.demo ? 'Live demo URL is not configured' : undefined} icon={ExternalLink} aria-label={`${project.name} live demo${project.demo ? '' : ' unavailable'}`}>Live Demo</AppButton>
          </div>
        </div>
      </Card>
    </div>
  );
}
