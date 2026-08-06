import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { EmptyState } from '../components/common/EmptyState';
import { projects } from '../data/projects';

export default function Projects() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], []);
  const filtered = useMemo(() => projects.filter((project) => {
    const matchesCategory = category === 'All' || project.category === category;
    const searchable = `${project.name} ${project.description} ${project.technologies.join(' ')}`.toLowerCase();
    return matchesCategory && searchable.includes(query.trim().toLowerCase());
  }), [category, query]);

  return (
    <PageContainer>
      <SEO title="Projects" description="Search and explore Keshav's frontend portfolio projects." path="/projects" />
      <SectionTitle eyebrow="Portfolio" title="Projects and interface work" description="All project information is stored locally, so filtering works instantly without API requests." />
      <section className="project-controls" aria-label="Project filters">
        <label className="search-box"><Search aria-hidden="true" /><span className="sr-only">Search projects</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search projects..." />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}</label>
        <div className="filter-list" role="group" aria-label="Filter by category">{categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>
      </section>
      {filtered.length ? <section className="project-grid">{filtered.map((project) => <ProjectCard key={project.id} project={project} />)}</section> : <EmptyState title="No matching projects" text="Clear the search or select another category." />}
    </PageContainer>
  );
}
