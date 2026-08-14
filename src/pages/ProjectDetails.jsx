import { ArrowLeft, ArrowUpRight, CheckCircle2, Code2, ExternalLink, FolderKanban, Github, Sparkles } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { Badge } from '../components/common/Badge';
import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { getProjectBySlug, projects } from '../data/projects';

export default function ProjectDetails({ project: propProject }) {
  const { slug } = useParams();
  const project = propProject || getProjectBySlug(slug);

  if (!project) {
    return (
      <PageContainer className="inner-page project-details-page">
        <SEO title="Project Not Found" description="The requested project could not be found." path={`/projects/${slug || 'unknown'}`} />
        <div className="py-20 text-center max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-kc-surface-2 border border-kc-border text-kc-muted mx-auto flex items-center justify-center mb-6">
            <FolderKanban className="w-8 h-8 opacity-60" />
          </div>
          <span className="eyebrow">404 &middot; Project Missing</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-kc-text mt-2 mb-3">Project Not Found</h1>
          <p className="text-kc-muted text-sm leading-relaxed mb-8">
            The project you are looking for (<code className="px-2 py-0.5 rounded bg-kc-surface-2 text-kc-accent font-mono text-xs">/projects/{slug}</code>) does not exist or has been relocated.
          </p>
          <div className="flex items-center justify-center gap-3">
            <AppButton to="/projects" icon={ArrowLeft}>Back to Projects</AppButton>
            <AppButton to="/home" variant="secondary">Go to Home</AppButton>
          </div>
        </div>
      </PageContainer>
    );
  }

  const liveUrl = project.liveUrl || project.demo;
  const githubUrl = project.githubUrl || project.github;
  const isComingSoon = project.status === 'Coming Soon';
  const cover = project.coverImage || project.image || project.thumbnail;

  return (
    <PageContainer className="inner-page project-details-page">
      <SEO
        title={`${project.title || project.name} — Selected Work`}
        description={project.shortDescription || project.description}
        path={`/projects/${project.slug}`}
      />

      {/* ─── Breadcrumb ─── */}
      <nav aria-label="Breadcrumb" className="pt-2 pb-4 text-xs font-semibold text-kc-muted flex items-center gap-2">
        <Link to="/home" className="hover:text-kc-text transition-colors">Home</Link>
        <span>/</span>
        <Link to="/projects" className="hover:text-kc-text transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-kc-accent truncate">{project.title || project.name}</span>
      </nav>

      {/* ─── Hero Header ─── */}
      <header className="page-hero pb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="eyebrow m-0">{project.category}</span>
          {project.year && (
            <span className="text-xs px-2 py-0.5 rounded-md bg-kc-surface-2 border border-kc-border text-kc-muted font-mono font-bold">
              {project.year}
            </span>
          )}
          {project.status && (
            <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
              project.status === 'Live'
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                : project.status === 'In Development'
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                : 'bg-kc-surface-2 text-kc-muted border border-kc-border'
            }`}>
              {project.status}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-kc-text m-0">
          {project.title || project.name}
        </h1>

        <p className="text-kc-muted text-base sm:text-lg leading-relaxed max-w-3xl mt-4 mb-6">
          {project.shortDescription || project.description}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {!isComingSoon && liveUrl && (
            <a
              href={liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--primary"
            >
              <span>View Live Project</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          )}

          {githubUrl && (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="button button--secondary"
            >
              <Github className="w-4 h-4" />
              <span>Source Code</span>
            </a>
          )}

          <Link to="/projects" className="button button--secondary">
            <ArrowLeft className="w-4 h-4" />
            <span>All Projects</span>
          </Link>
        </div>
      </header>

      {/* ─── Visual Showcase Browser Mockup ─── */}
      <section className="my-8 rounded-2xl overflow-hidden border border-kc-border bg-kc-surface shadow-2xl">
        <div className="bg-kc-surface-2 border-b border-kc-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-kc-muted truncate max-w-xs">
            keshavcoder.com/projects/{project.slug}
          </span>
          <div className="w-12" />
        </div>

        <div className="relative group overflow-hidden bg-kc-bg flex items-center justify-center">
          <img
            src={cover}
            alt={`${project.title || project.name} visual preview`}
            className="w-full h-auto object-cover max-h-[600px] transition-transform duration-500 group-hover:scale-[1.02]"
            loading="eager"
            decoding="async"
          />
        </div>
      </section>

      {/* ─── Project Details & Features Grid ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-12">
        {/* Left 2 Cols: Detailed Overview & Features */}
        <div className="lg:col-span-2 space-y-8">
          <div className="p-6 sm:p-8 rounded-2xl border border-kc-border bg-kc-surface">
            <div className="flex items-center gap-2 text-kc-accent font-bold text-xs uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Project Overview</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-kc-text mb-4">
              About this build
            </h2>
            <p className="text-kc-muted text-sm sm:text-base leading-relaxed whitespace-pre-line m-0">
              {project.description}
            </p>
          </div>

          {project.features && project.features.length > 0 && (
            <div className="p-6 sm:p-8 rounded-2xl border border-kc-border bg-kc-surface">
              <div className="flex items-center gap-2 text-kc-accent font-bold text-xs uppercase tracking-wider mb-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Key Highlights</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-kc-text mb-4">
                Core Features & Implementation
              </h2>
              <ul className="space-y-3 m-0 p-0 list-none">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-kc-muted">
                    <span className="w-5 h-5 rounded-full bg-kc-accent/15 text-kc-accent flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                      ✓
                    </span>
                    <span className="leading-relaxed">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right 1 Col: Tech Stack & Meta Card */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-kc-border bg-kc-surface">
            <div className="flex items-center gap-2 text-kc-accent font-bold text-xs uppercase tracking-wider mb-3">
              <Code2 className="w-4 h-4" />
              <span>Technology Stack</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.map((tech) => (
                <Badge key={tech}>{tech}</Badge>
              ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-kc-border bg-kc-surface space-y-4 text-xs">
            <div className="flex justify-between items-center py-2 border-b border-kc-border">
              <span className="text-kc-muted">Category</span>
              <strong className="text-kc-text font-bold">{project.category}</strong>
            </div>
            {project.year && (
              <div className="flex justify-between items-center py-2 border-b border-kc-border">
                <span className="text-kc-muted">Year</span>
                <strong className="text-kc-text font-mono font-bold">{project.year}</strong>
              </div>
            )}
            <div className="flex justify-between items-center py-2 border-b border-kc-border">
              <span className="text-kc-muted">Project Type</span>
              <strong className="text-kc-text font-mono font-bold capitalize">{project.projectType || 'Details'}</strong>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-kc-muted">Status</span>
              <strong className="text-kc-text font-bold">{project.status || 'Live'}</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Bottom Navigation: More Projects ─── */}
      <section className="pt-8 border-t border-kc-border flex items-center justify-between">
        <Link to="/projects" className="inline-flex items-center gap-2 text-sm font-bold text-kc-muted hover:text-kc-text transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all projects</span>
        </Link>
        <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-bold text-kc-accent hover:opacity-85 transition-opacity">
          <span>Start a project like this</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </section>
    </PageContainer>
  );
}
