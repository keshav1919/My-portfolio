import { ArrowUpRight, Github } from 'lucide-react';
import { Badge } from '../common/Badge';
import { useReveal } from '../../hooks/useReveal';

export function ProjectCard({ project, index = 0 }) {
  const { ref, visible } = useReveal();
  return (
    <article ref={ref} className={`project-showcase reveal ${visible ? 'is-visible' : ''} project-showcase--${index % 3}`}>
      <div className="project-showcase__copy">
        <div className="project-showcase__meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{project.category}</span></div>
        <h2>{project.name}</h2>
        <p>{project.description}</p>
        <div className="badge-list">{project.technologies.map((tech) => <Badge key={tech}>{tech}</Badge>)}</div>
        <div className="project-links">
          {project.demo && <a href={project.demo} target="_blank" rel="noopener noreferrer">View project <ArrowUpRight /></a>}
          {project.github && <a href={project.github} target="_blank" rel="noopener noreferrer">GitHub <Github /></a>}
        </div>
      </div>
      <a className="project-showcase__visual" href={project.demo || project.github} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.name} project`}>
        <div className="project-browser" aria-hidden="true"><span /><span /><span /><small>keshav.dev/{project.name.toLowerCase().replace(/\s/g, '-')}</small></div>
        <img src={project.image} alt={`${project.name} project preview`} width="1200" height="750" loading="lazy" decoding="async" />
        <span className="project-view">View <ArrowUpRight /></span>
      </a>
    </article>
  );
}
