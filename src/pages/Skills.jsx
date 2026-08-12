import { ArrowUpRight, Check, Code2 } from 'lucide-react';
import { useState } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { SkillCard } from '../components/portfolio/SkillCard';
import { skillGroups } from '../data/skills';

const showcases = [
  { name: 'React', label: 'Component architecture', title: 'Reusable interfaces, built in pieces.', text: 'React helps me organize interfaces into reusable components and structure page experiences around clear responsibilities.', code: ['function ProjectCard({ project }) {', '  return <article>{project.name}</article>;', '}'] },
  { name: 'JavaScript', label: 'Interface logic', title: 'Interaction that stays clear.', text: 'JavaScript powers project filtering, theme preferences, interface feedback and the practical behavior behind each page.', code: ['const filtered = projects.filter(project =>', '  project.name.includes(query)', ');'] },
  { name: 'Tailwind CSS', label: 'Responsive styling', title: 'Consistent layouts at every size.', text: 'Tailwind CSS supports fast visual iteration, responsive layout decisions and consistent spacing across interface elements.', code: ['<section className="grid gap-6 md:grid-cols-2">', '  <ProjectCard />', '</section>'] }
];

export default function Skills() {
  const [active, setActive] = useState(0);
  const selected = showcases[active];
  return (
    <PageContainer className="inner-page skills-page">
      <SEO title="Skills" description="Explore Keshav's frontend development skills, tools and strengths." path="/skills" />
      <header className="page-hero"><SectionTitle eyebrow="Tools I build with" title="A focused stack for thoughtful frontend work." description="Technologies, tools and strengths developed through practical projects and consistent learning." /></header>
      <section className="skills-layout">{skillGroups.map((group, index) => <SkillCard key={group.title} group={group} index={index} />)}</section>
      <section className="section-block tech-lab"><div className="tech-lab__tabs" role="tablist" aria-label="Technology showcase">{showcases.map((item, index) => <button key={item.name} role="tab" aria-selected={active === index} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.name}</strong><ArrowUpRight /></button>)}</div><div className="tech-lab__panel" role="tabpanel"><div className="tech-lab__copy"><span className="eyebrow">{selected.label}</span><h2>{selected.title}</h2><p>{selected.text}</p><span className="tech-lab__status"><Check /> Part of my current stack</span></div><div className="code-preview"><header><div><i /><i /><i /></div><span>{selected.name.toLowerCase()}.jsx</span></header><div>{selected.code.map((line, index) => <code key={`${line}-${index}`}><i>{String(index + 1).padStart(2, '0')}</i>{line}</code>)}</div><footer><Code2 /> Responsive preview <span>Ready</span></footer></div></div></section>
    </PageContainer>
  );
}
