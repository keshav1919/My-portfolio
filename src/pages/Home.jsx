import { Award, BriefcaseBusiness, Cake, GraduationCap, Mail, Download, ArrowRight, UserRound, FolderKanban, Wrench } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { AppButton } from '../components/common/AppButton';
import { AnimatedCard } from '../components/common/AnimatedCard';
import { SectionTitle } from '../components/common/SectionTitle';
import { ProfileHeader } from '../components/portfolio/ProfileHeader';
import { StatCard } from '../components/portfolio/StatCard';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { useToast } from '../context/ToastContext';
import { isConfigured } from '../utils/links';

const quickLinks = [
  { label: 'About Me', path: '/about', icon: UserRound, text: 'My story, goals and journey.' },
  { label: 'Projects', path: '/projects', icon: FolderKanban, text: 'Selected interfaces and web apps.' },
  { label: 'Skills', path: '/skills', icon: Wrench, text: 'Frontend tools and strengths.' },
  { label: 'Contact', path: '/contact', icon: Mail, text: 'Let us discuss your website.' }
];

export default function Home() {
  const { showToast } = useToast();
  const resumeReady = isConfigured(profile.resumeUrl);
  return (
    <PageContainer>
      <SEO title="Home" description="Keshav is a frontend web developer creating responsive and modern web experiences." path="/home" />
      <section className="hero">
        <ProfileHeader compact />
        <div className="hero__actions">
          <AppButton href={resumeReady ? profile.resumeUrl : undefined} icon={Download} onClick={!resumeReady ? () => showToast('Resume link is not configured yet.') : undefined}>Download Resume</AppButton>
          <AppButton to="/contact" variant="secondary" icon={Mail}>Contact Me</AppButton>
        </div>
      </section>

      <section className="stats-grid" aria-label="Developer statistics">
        <StatCard label="Experience" value="1 Year" icon={BriefcaseBusiness} />
        <StatCard label="Projects" value="15+" icon={Award} delay={60} />
        <StatCard label="Age" value="19" icon={Cake} delay={120} />
        <StatCard label="Education" value="12th Pass" icon={GraduationCap} delay={180} />
      </section>

      <section className="section-block">
        <SectionTitle eyebrow="Explore" title="Quick navigation" description="Everything important is one tap away." />
        <div className="quick-grid">{quickLinks.map(({ label, path, icon: Icon, text }, index) => (
          <AnimatedCard key={path} className="quick-card" delay={index * 60}>
            <Icon /><h2>{label}</h2><p>{text}</p><Link to={path}>Open <ArrowRight size={16} /></Link>
          </AnimatedCard>
        ))}</div>
      </section>

      <section className="section-block">
        <SectionTitle eyebrow="Selected work" title="Recent projects" description="A few interface projects built with lightweight frontend technologies." />
        <div className="project-grid project-grid--home">{projects.slice(0, 3).map((project) => <ProjectCard key={project.id} project={project} />)}</div>
        <div className="section-action"><AppButton to="/projects" variant="secondary">View all projects</AppButton></div>
      </section>

      <section className="section-block split-section">
        <AnimatedCard className="content-card"><span className="eyebrow">Latest skills</span><h2>Modern frontend foundations</h2><div className="badge-list">{skillGroups[0].items.slice(0, 6).map((item) => <span className="badge" key={item.name}>{item.name}</span>)}</div><AppButton to="/skills" variant="ghost">View skill levels</AppButton></AnimatedCard>
        <AnimatedCard className="content-card" delay={80}><span className="eyebrow">Experience preview</span><h2>One year of practical development</h2><p>Focused on responsive layouts, reusable components, clean styling and user-friendly interactions.</p><AppButton to="/experience" variant="ghost">See experience</AppButton></AnimatedCard>
      </section>

      <section className="cta"><div><span className="eyebrow">Have a project?</span><h2>Let’s build a clean, responsive website.</h2><p>Share your idea and I will help turn it into a usable frontend experience.</p></div><AppButton to="/contact" icon={ArrowRight}>Contact Keshav</AppButton></section>
    </PageContainer>
  );
}
