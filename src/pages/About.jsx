import { ArrowUpRight, Download, MapPin } from 'lucide-react';
import { AppButton } from '../components/common/AppButton';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { SocialLinks } from '../components/portfolio/SocialLinks';
import { useToast } from '../context/ToastContext';
import { profile } from '../data/profile';
import { timeline } from '../data/timeline';
import { isConfigured } from '../utils/links';

export default function About() {
  const { showToast } = useToast();
  const resumeReady = isConfigured(profile.resumeUrl);
  return (
    <PageContainer className="inner-page about-page">
      <SEO title="About" description="Learn about Keshav, his frontend journey, education and development goals." path="/about" />
      <header className="page-hero"><SectionTitle eyebrow="About Keshav" title="Building experiences where design meets code." description="A frontend developer, continuous learner and UI enthusiast based in Punjab, India." /></header>
      <section className="about-feature">
        <div className="about-feature__image"><img src={profile.profileImage} alt="Keshav, frontend web developer" width="900" height="1100" decoding="async" /><span><MapPin /> {profile.location}</span></div>
        <div className="about-feature__copy"><span className="eyebrow">My approach</span><h2>Clean ideas.<br />Careful execution.</h2><p>{profile.bio}</p><p>I continue to learn through documentation, practical projects and consistent frontend practice. My goal is to build useful production applications and grow toward full stack development.</p><SocialLinks /><AppButton href={resumeReady ? profile.resumeUrl : undefined} variant="secondary" icon={resumeReady ? Download : ArrowUpRight} onClick={!resumeReady ? () => showToast('Resume link is not configured yet.') : undefined}>{resumeReady ? 'Download resume' : 'Resume coming soon'}</AppButton></div>
      </section>
      <section className="section-block about-facts"><article><span>01</span><small>Experience</small><strong>{profile.experience}</strong></article><article><span>02</span><small>Role</small><strong>{profile.role}</strong></article><article><span>03</span><small>Education</small><strong>{profile.education}</strong></article><article><span>04</span><small>Location</small><strong>{profile.location}</strong></article></section>
      <section className="section-block journey-section"><SectionTitle number="05" eyebrow="Learning timeline" title="A practical journey in frontend development." /><div className="timeline">{timeline.map((item) => <article key={`${item.year}-${item.title}`} className="timeline__item"><span>{item.year}</span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</div></section>
    </PageContainer>
  );
}
