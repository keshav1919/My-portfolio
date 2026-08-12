import { Search, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EmptyState } from '../components/common/EmptyState';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { projects } from '../data/projects';

export default function Projects() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const categories = useMemo(() => ['All', ...new Set(projects.map((project) => project.category))], []);
  const filtered = useMemo(() => projects.filter((project) => {
    const text = `${project.name} ${project.description} ${project.technologies.join(' ')}`.toLowerCase();
    return (category === 'All' || project.category === category) && text.includes(query.trim().toLowerCase());
  }), [category, query]);
  return (
    <PageContainer className="inner-page projects-page">
      <SEO title="Selected Work" description="Explore Keshav's selected frontend projects and interface work." path="/projects" />
      <header className="page-hero"><SectionTitle eyebrow="Selected work" title="Projects shaped around real interfaces." description="Responsive websites and UI concepts built to develop strong hierarchy, clean interaction and practical frontend skills." /></header>
      <section className="project-controls" aria-label="Project filters"><label className="search-box"><Search /><span className="sr-only">Search projects</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by project or technology" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X /></button>}</label><div className="filter-list" role="group" aria-label="Filter by category">{categories.map((item) => <button key={item} className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div></section>
      {filtered.length ? <section className="project-list">{filtered.map((project) => <ProjectCard key={project.id} project={project} index={projects.indexOf(project)} />)}</section> : <EmptyState title="No matching projects" text="Try another search or project category." />}
    </PageContainer>
  );
}
