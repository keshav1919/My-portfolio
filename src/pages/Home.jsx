import { ArrowDownRight, ArrowUpRight, Check, Code2, Github, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { ProjectCard } from '../components/portfolio/ProjectCard';
import { profile } from '../data/profile';
import { projects } from '../data/projects';
import { skillGroups } from '../data/skills';
import { timeline } from '../data/timeline';
import { useHeroMotion } from '../hooks/useHeroMotion';

const services = [
  { title: 'Frontend development', text: 'Responsive pages and reusable interface components built with modern web foundations.' },
  { title: 'Responsive websites', text: 'Layouts tested and adapted for a consistent experience across mobile, tablet and desktop.' },
  { title: 'React interfaces', text: 'Component-based applications with clean structure, routing and reusable UI patterns.' },
  { title: 'UI implementation', text: 'Careful translation of visual ideas into polished, accessible and usable interfaces.' }
];

export default function Home() {
  const coreSkills = skillGroups.flatMap((group) => group.items).slice(0, 10);
  const heroRef = useHeroMotion();
  return (
    <PageContainer className="home-page">
      <SEO title="Frontend Developer" description="Keshav builds clean, responsive and interactive web experiences with React and modern frontend technologies." path="/home" />

      <section ref={heroRef} className="hero" aria-labelledby="hero-title">
        <div className="hero-ambient" aria-hidden="true" />
        <div className="hero__topline"><span className="availability"><i /> Available for opportunities</span><span>{profile.location}</span></div>
        <div className="hero__copy">
          <p className="hero__intro">Hello, I&apos;m Keshav — frontend developer.</p>
          <h1 id="hero-title"><span className="hero-line"><span>I build digital</span></span><span className="hero-line"><span>experiences that</span></span><span className="hero-line"><span><em>feel effortless.</em></span></span></h1>
          <div className="hero-code-promo" aria-hidden="true">
            <div className="hero-code-promo__bar"><span><i /><i /><i /></span><strong>skills.tsx</strong><small>LIVE LOOP</small></div>
            <div className="hero-code-promo__screen">
              <div className="hero-code-promo__scene hero-code-promo__scene--ui">
                <span className="promo-kicker">01 / UI IMPLEMENTATION</span>
                <code><i>01</i><span><b>const</b> interface = {'{'}</span></code>
                <code><i>02</i><span>&nbsp;&nbsp;visual: <em>&apos;polished&apos;</em>,</span></code>
                <code><i>03</i><span>&nbsp;&nbsp;details: <em>&apos;thoughtful&apos;</em>,</span></code>
                <code><i>04</i><span>{'}'};</span></code>
                <strong>Clean UI.<br />Built with care.</strong>
              </div>
              <div className="hero-code-promo__scene hero-code-promo__scene--responsive">
                <span className="promo-kicker">02 / RESPONSIVE DESIGN</span>
                <code><i>01</i><span><b>@media</b> (width &lt;= 430px) {'{'}</span></code>
                <code><i>02</i><span>&nbsp;&nbsp;layout: <em>adaptive</em>;</span></code>
                <code><i>03</i><span>&nbsp;&nbsp;overflow: <em>none</em>;</span></code>
                <code><i>04</i><span>{'}'}</span></code>
                <strong>Every screen.<br />One smooth experience.</strong>
              </div>
              <div className="hero-code-promo__scene hero-code-promo__scene--react">
                <span className="promo-kicker">03 / REACT INTERFACES</span>
                <code><i>01</i><span><b>function</b> Experience() {'{'}</span></code>
                <code><i>02</i><span>&nbsp;&nbsp;<b>return</b> &lt;Interface</span></code>
                <code><i>03</i><span>&nbsp;&nbsp;&nbsp;&nbsp;clean responsive /&gt;;</span></code>
                <code><i>04</i><span>{'}'}</span></code>
                <strong>Reusable pieces.<br />Effortless results.</strong>
              </div>
              <span className="hero-code-promo__cursor">_</span>
            </div>
            <div className="hero-code-promo__footer"><span><i /> Compiled successfully</span><div><i /><i /><i /></div></div>
          </div>
          <div className="hero__support">
            <p>{profile.shortBio}</p>
            <div className="hero__actions"><AppButton to="/projects" icon={ArrowDownRight}>View my work</AppButton><AppButton to="/contact" variant="secondary" icon={ArrowUpRight}>Let&apos;s talk</AppButton></div>
          </div>
        </div>

        <div className="developer-window">
          <div className="developer-window__bar"><div><span /><span /><span /></div><small>KESHAV.DEV</small><span>01 / Portfolio</span></div>
          <div className="developer-window__body">
            <aside><span className="is-active">Overview</span><span>Projects</span><span>Skills</span><span>Journey</span><div><Code2 /><small>BUILD STATUS</small><strong>Ready</strong></div></aside>
            <div className="developer-preview">
              <div className="developer-preview__label"><span>Frontend workspace</span><i>Live</i></div>
              <div className="developer-preview__headline"><small>CRAFTING INTERFACES WITH</small><strong>CLARITY<br /><em>AND CARE.</em></strong></div>
              <div className="developer-preview__stack">{['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'].map((item) => <span key={item}>{item}</span>)}</div>
              <div className="developer-preview__footer"><span><Check /> Responsive UI</span><span><Check /> Clean code</span></div>
            </div>
          </div>
          <div className="floating-note floating-note--one"><Sparkles /><div><strong>Frontend development</strong><span>Responsive & interactive</span></div></div>
          <div className="floating-note floating-note--two"><i /><div><strong>Available</strong><span>for new projects</span></div></div>
        </div>
        <div className="hero__socials"><span>Connect</span><a href={profile.github} target="_blank" rel="noopener noreferrer"><Github /> GitHub</a><a href={`mailto:${profile.email}`}><Mail /> Email</a></div>
        <div className="scroll-cue" aria-hidden="true"><span>Scroll</span><i /></div>
      </section>

      <section className="section-block about-editorial" id="about">
        <div className="about-editorial__statement"><SectionTitle number="01" eyebrow="About" title="Building experiences where design meets code." /></div>
        <div className="about-editorial__content"><p>{profile.bio}</p><dl><div><dt>Experience</dt><dd>{profile.experience}</dd></div><div><dt>Location</dt><dd>{profile.location}</dd></div><div><dt>Focus</dt><dd>Frontend Development</dd></div><div><dt>Education</dt><dd>{profile.education}</dd></div></dl><Link className="text-link" to="/about">More about me <ArrowUpRight /></Link></div>
      </section>

      <section className="stats-band" aria-label="Portfolio facts"><div><strong>01+</strong><span>Year in web<br />development</span></div><div><strong>{String(projects.length).padStart(2, '0')}</strong><span>Portfolio<br />projects</span></div><div><strong>{profile.education}</strong><span>Current<br />education</span></div></section>

      <section className="section-block" id="work">
        <div className="section-heading-row"><SectionTitle number="02" eyebrow="Selected work" title="Projects shaped around real interfaces." description="A collection of web experiences built to explore visual hierarchy, responsiveness and thoughtful interaction." /><Link className="text-link" to="/projects">Explore all work <ArrowUpRight /></Link></div>
        <div className="project-list">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index} />)}</div>
      </section>

      <section className="section-block tools-section" id="skills">
        <div className="tools-section__intro"><SectionTitle number="03" eyebrow="Tools I build with" title="A focused stack for thoughtful frontend work." description="Every tool here is already part of my learning and project workflow." /><AppButton to="/skills" variant="secondary" icon={ArrowUpRight}>Explore my skills</AppButton></div>
        <div className="skill-rows">{coreSkills.map((skill, index) => <Link key={skill} to="/skills"><span>{String(index + 1).padStart(2, '0')}</span><strong>{skill}</strong><ArrowUpRight /></Link>)}</div>
      </section>

      <section className="section-block stack-showcase">
        <div className="stack-showcase__copy"><span className="eyebrow"><i>04</i> Development stack</span><h2>Interfaces built from reusable pieces.</h2><p>React brings structure, JavaScript adds interaction, and responsive styling makes each experience work wherever it is viewed.</p><div className="stack-tabs" aria-label="Technology stack"><span className="is-active">React</span><span>JavaScript</span><span>Tailwind</span></div></div>
        <div className="stack-interface" aria-hidden="true"><div className="stack-interface__bar"><span>Component explorer</span><small>Preview</small></div><div className="stack-interface__body"><aside><b>src</b><span>components</span><span>pages</span><span>styles</span><span>data</span></aside><div><code><i>01</i> import React from &apos;react&apos;;</code><code><i>02</i></code><code><i>03</i> export function Interface() {'{'}</code><code><i>04</i>&nbsp;&nbsp;return &lt;Experience /&gt;;</code><code><i>05</i> {'}'}</code><div className="component-preview"><span>Responsive component</span><strong>Designed once.<br />Built to adapt.</strong></div></div></div></div>
      </section>

      <section className="section-block" id="services"><SectionTitle number="05" eyebrow="What I can build" title="Frontend services grounded in my current skills." /><div className="service-grid">{services.map((service, index) => <article key={service.title}><span>{String(index + 1).padStart(2, '0')}</span><h3>{service.title}</h3><p>{service.text}</p><ArrowUpRight /></article>)}</div></section>

      <section className="section-block journey-section" id="experience"><SectionTitle number="06" eyebrow="My journey" title="Learning by building, one layer at a time." /><div className="timeline">{timeline.map((item) => <article key={`${item.year}-${item.title}`} className="timeline__item"><span>{item.year}</span><div><h2>{item.title}</h2><p>{item.text}</p></div></article>)}</div><Link className="text-link" to="/experience">See experience & education <ArrowUpRight /></Link></section>

      <section className="cta" id="contact"><div><span className="eyebrow">Have a project in mind?</span><h2>Let&apos;s build something<br />great together.</h2></div><div><p>Share your idea, goals and timeline. I&apos;d be happy to hear what you&apos;re working on.</p><AppButton to="/contact" icon={ArrowUpRight}>Start a conversation</AppButton></div></section>
    </PageContainer>
  );
}
