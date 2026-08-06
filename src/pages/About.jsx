import { Download } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { AppButton } from '../components/common/AppButton';
import { Card } from '../components/common/Card';
import { SectionTitle } from '../components/common/SectionTitle';
import { ProfileHeader } from '../components/portfolio/ProfileHeader';
import { profile } from '../data/profile';
import { timeline } from '../data/timeline';
import { useToast } from '../context/ToastContext';
import { isConfigured } from '../utils/links';

export default function About() {
  const { showToast } = useToast();
  const resumeReady = isConfigured(profile.resumeUrl);
  return (
    <PageContainer>
      <SEO title="About" description="Learn about Keshav, his frontend journey, education and goals." path="/about" />
      <SectionTitle eyebrow="About" title="Developer, learner and UI enthusiast" description="A practical journey built through consistent learning and real interface projects." />
      <Card className="about-profile"><ProfileHeader /><AppButton href={resumeReady ? profile.resumeUrl : undefined} icon={Download} onClick={!resumeReady ? () => showToast('Add your resume URL in src/data/profile.js first.') : undefined}>Download Resume</AppButton></Card>
      <section className="info-grid section-block">
        <Card><h2>Personal information</h2><dl className="detail-list"><div><dt>Name</dt><dd>{profile.name}</dd></div><div><dt>Age</dt><dd>{profile.age} Years</dd></div><div><dt>Role</dt><dd>{profile.role}</dd></div><div><dt>Location</dt><dd>{profile.location}</dd></div></dl></Card>
        <Card><h2>Education</h2><p><strong>{profile.education}</strong></p><p>Continuing education through self-learning, documentation, projects and daily frontend practice.</p></Card>
        <Card><h2>Goals</h2><p>Build useful production applications, improve React skills, learn React Native and grow toward full stack development.</p></Card>
      </section>
      <section className="section-block"><SectionTitle eyebrow="Career journey" title="Learning timeline" /><div className="timeline">{timeline.map((item) => <article key={`${item.year}-${item.title}`} className="timeline__item"><span>{item.year}</span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</div></section>
    </PageContainer>
  );
}
