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

  const categories = useMemo(
    () => ['All', ...new Set(projects.map((project) => project.category).filter(Boolean))],
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((project) => {
      const title = (project.title || project.name || '').toLowerCase();
      const desc = (project.shortDescription || project.description || '').toLowerCase();
      const tech = (project.technologies || []).join(' ').toLowerCase();
      const cat = (project.category || '').toLowerCase();
      const slug = (project.slug || '').toLowerCase();

      const matchesCategory = category === 'All' || project.category === category;
      const matchesSearch = !q || title.includes(q) || desc.includes(q) || tech.includes(q) || cat.includes(q) || slug.includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [category, query]);

  return (
    <PageContainer className="inner-page projects-page">
      <SEO
        title="Selected Work"
        description="Explore Keshav's selected frontend projects, web applications and interface work."
        path="/projects"
      />

      <header className="page-hero">
        <SectionTitle
          eyebrow="Selected work"
          title="Projects shaped around real interfaces."
          description="Responsive websites, web apps and UI concepts built with modern frontend foundations, clean interaction and scalable structure."
        />
      </header>

      <section className="project-controls" aria-label="Project filters">
        <label className="search-box">
          <Search />
          <span className="sr-only">Search projects</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by project, technology or category..."
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <X />
            </button>
          )}
        </label>

        <div className="filter-list" role="group" aria-label="Filter by category">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'is-active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      {filtered.length ? (
        <section className="project-list">
          {filtered.map((project, index) => (
            <ProjectCard key={project.id || project.slug} project={project} index={index} />
          ))}
        </section>
      ) : (
        <EmptyState
          title="No matching projects"
          text="Try another search term or select a different project category."
        />
      )}
    </PageContainer>
  );
}
