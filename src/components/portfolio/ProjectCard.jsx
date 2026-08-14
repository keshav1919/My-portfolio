import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../common/Badge';
import { useReveal } from '../../hooks/useReveal';

export function ProjectCard({ project, index = 0 }) {
  const { ref, visible } = useReveal();
  
  const title = project.title || project.name;
  const description = project.shortDescription || project.description;
  const image = project.coverImage || project.thumbnail || project.image;
  const liveUrl = project.liveUrl || project.demo;
  const githubUrl = project.githubUrl || project.github;
  const slug = project.slug || project.name?.toLowerCase().replace(/\s+/g, '-');
  const internalLink = `/projects/${slug}`;
  const isExternalOnly = project.projectType === 'external' && liveUrl;
  const primaryHref = isExternalOnly ? liveUrl : internalLink;

  return (
    <article ref={ref} className={`project-showcase reveal ${visible ? 'is-visible' : ''} project-showcase--${index % 3}`}>
      <div className="project-showcase__copy">
        <div className="project-showcase__meta">
          <span>{String(index + 1).padStart(2, '0')}</span>
          <span>{project.category}</span>
          {project.status && project.status !== 'Live' && (
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-kc-surface-2 border border-kc-border text-kc-accent">
              {project.status}
            </span>
          )}
        </div>
        
        <h2>
          {isExternalOnly ? (
            <a href={primaryHref} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            <Link to={internalLink}>
              {title}
            </Link>
          )}
        </h2>

        <p>{description}</p>

        <div className="badge-list">
          {project.technologies?.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>

        <div className="project-links">
          {isExternalOnly ? (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer">
              <span>Live site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <Link to={internalLink}>
              <span>View details</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          )}

          {!isExternalOnly && liveUrl && project.status !== 'Coming Soon' && (
            <a href={liveUrl} target="_blank" rel="noopener noreferrer" title="Direct live link">
              <span>Live demo</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          )}

          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer">
              <span>GitHub</span>
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {isExternalOnly ? (
        <a
          className="project-showcase__visual"
          href={liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title} external website`}
        >
          <div className="project-browser" aria-hidden="true">
            <span /><span /><span />
            <small>keshavcoder.com/projects/{slug}</small>
          </div>
          <img src={image} alt={`${title} preview`} width="1200" height="750" loading="lazy" decoding="async" />
          <span className="project-view">View <ArrowUpRight /></span>
        </a>
      ) : (
        <Link
          className="project-showcase__visual"
          to={internalLink}
          aria-label={`View ${title} project`}
        >
          <div className="project-browser" aria-hidden="true">
            <span /><span /><span />
            <small>keshavcoder.com/projects/{slug}</small>
          </div>
          <img src={image} alt={`${title} preview`} width="1200" height="750" loading="lazy" decoding="async" />
          <span className="project-view">Explore <ArrowUpRight /></span>
        </Link>
      )}
    </article>
  );
}
