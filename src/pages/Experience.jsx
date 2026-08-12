import { ArrowUpRight, BriefcaseBusiness, GraduationCap, Rocket } from 'lucide-react';
import { AppButton } from '../components/common/AppButton';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { timeline } from '../data/timeline';

const responsibilities = ['Build responsive user interfaces', 'Create reusable React components', 'Translate designs into clean layouts', 'Test mobile and desktop behavior', 'Improve usability and visual consistency'];
const goals = ['Learn React Native', 'Learn Node.js', 'Improve backend development knowledge', 'Become a Full Stack Developer', 'Build useful production applications'];

export default function Experience() {
  return (
    <PageContainer className="inner-page experience-page">
      <SEO title="Experience & Education" description="Keshav's frontend development journey, education and future goals." path="/experience" />
      <header className="page-hero"><SectionTitle eyebrow="My journey" title="Learning by building, one layer at a time." description="A practical path centered on frontend development, self-learning and steady progress." /></header>
      <section className="experience-feature"><article><span className="experience-feature__icon"><BriefcaseBusiness /></span><span className="eyebrow">Experience</span><h2>Frontend Developer</h2><strong>1 Year Experience</strong><p>Built responsive frontend pages and reusable interface components with HTML, CSS, JavaScript, Tailwind CSS and React.</p><ul>{responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article><div><article><span className="experience-feature__icon"><GraduationCap /></span><span className="eyebrow">Education</span><h2>12th Pass</h2><p>Continuing education through documentation, projects and consistent coding practice.</p></article><article><span className="experience-feature__icon"><Rocket /></span><span className="eyebrow">Next chapter</span><h2>Growing toward full stack development</h2><ul>{goals.map((item) => <li key={item}>{item}</li>)}</ul></article></div></section>
      <section className="section-block journey-section"><SectionTitle number="02" eyebrow="Development timeline" title="Milestones in my learning journey." /><div className="timeline">{timeline.map((item) => <article key={`${item.year}-${item.title}`} className="timeline__item"><span>{item.year}</span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</div></section>
      <section className="cta cta--compact"><div><span className="eyebrow">Work together</span><h2>Have a frontend project in mind?</h2></div><AppButton to="/contact" icon={ArrowUpRight}>Start a conversation</AppButton></section>
    </PageContainer>
  );
}
