import { BriefcaseBusiness, GraduationCap, Rocket } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { AnimatedCard } from '../components/common/AnimatedCard';

const responsibilities = ['Build responsive user interfaces', 'Create reusable React components', 'Translate designs into clean layouts', 'Test mobile and desktop behavior', 'Improve usability and visual consistency'];
const goals = ['Learn React Native', 'Learn Node.js', 'Improve backend development knowledge', 'Become a Full Stack Developer', 'Build useful production applications'];

export default function Experience() {
  return (
    <PageContainer>
      <SEO title="Experience & Education" description="Keshav's frontend experience, education and future development goals." path="/experience" />
      <SectionTitle eyebrow="Journey" title="Experience, education and next steps" description="A practical path centered on frontend work and continuous self-learning." />
      <section className="experience-grid">
        <AnimatedCard className="experience-card"><BriefcaseBusiness /><span className="eyebrow">Experience</span><h2>Frontend Developer</h2><strong>1 Year Experience</strong><p>Built responsive frontend pages and reusable interface components with HTML, CSS, JavaScript, Tailwind CSS and React.</p><ul>{responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></AnimatedCard>
        <AnimatedCard className="experience-card" delay={70}><GraduationCap /><span className="eyebrow">Education</span><h2>12th Pass</h2><p>Focused on self-learning and practical web development through projects, documentation and consistent coding practice.</p></AnimatedCard>
        <AnimatedCard className="experience-card" delay={140}><Rocket /><span className="eyebrow">Future goals</span><h2>Grow into full stack development</h2><ul>{goals.map((item) => <li key={item}>{item}</li>)}</ul></AnimatedCard>
      </section>
    </PageContainer>
  );
}
