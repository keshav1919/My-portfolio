import { ArrowDownRight, ArrowUpRight, Check, Code2, Github, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppButton } from '../components/common/AppButton';
import { AnimatedStat } from '../components/common/AnimatedStat';
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

const promoViews = [
  { name: 'Exchange', className: 'exchange' },
  { name: 'Insights', className: 'insights' },
  { name: 'System', className: 'system' }
];

const promoSparks = [
  { x: 9, y: 18, delay: -1.2, duration: 4.6 },
  { x: 88, y: 15, delay: -3.1, duration: 5.4 },
  { x: 76, y: 37, delay: -2.2, duration: 4.9 },
  { x: 13, y: 48, delay: -.5, duration: 5.8 },
  { x: 91, y: 62, delay: -4.2, duration: 6.1 },
  { x: 18, y: 78, delay: -2.8, duration: 5.2 },
  { x: 70, y: 84, delay: -1.7, duration: 4.7 },
  { x: 45, y: 27, delay: -4.8, duration: 6.4 }
];

function PromoView({ view, index }) {
  if (view.className === 'exchange') {
    return (
      <section className={`promo-view promo-view--${view.className}`} style={{ '--view-index': index }}>
        <div className="promo-view__heading"><span>UI FLOW 01</span><strong>Exchange</strong><small>Simple, clear and fast.</small></div>
        <div className="promo-swap-card"><small>You send <b>MAX</b></small><div><span className="promo-token promo-token--lavender">K</span><strong>1,240</strong><em>KSH</em></div></div>
        <span className="promo-swap-icon">↕</span>
        <div className="promo-swap-card"><small>You receive <b>LIVE</b></small><div><span className="promo-token promo-token--mint">U</span><strong>4,872</strong><em>UIX</em></div></div>
        <div className="promo-slide"><i /><span>Slide to preview</span><b>››</b></div>
      </section>
    );
  }

  if (view.className === 'insights') {
    return (
      <section className={`promo-view promo-view--${view.className}`} style={{ '--view-index': index }}>
        <div className="promo-view__heading"><span>UI FLOW 02</span><strong>Insights</strong><small>Responsive data, instantly readable.</small></div>
        <div className="promo-metric"><small>Interaction score</small><strong>98.6%</strong><span>+12.4% this week</span></div>
        <div className="promo-chart" aria-hidden="true">{[42, 63, 48, 76, 58, 88, 69, 96].map((height, itemIndex) => <i key={height} style={{ '--bar-height': `${height}%`, '--bar-index': itemIndex }} />)}</div>
        <div className="promo-activity"><span><i />Responsive states</span><b>Ready</b></div>
        <div className="promo-activity"><span><i />Motion system</span><b>Live</b></div>
      </section>
    );
  }

  return (
    <section className={`promo-view promo-view--${view.className}`} style={{ '--view-index': index }}>
      <div className="promo-view__heading"><span>UI FLOW 03</span><strong>Design system</strong><small>Reusable pieces for every screen.</small></div>
      <div className="promo-component-grid"><span className="is-wide"><i /><b>Navigation</b><small>Adaptive layout</small></span><span><i /><b>Cards</b><small>Clear hierarchy</small></span><span><i /><b>Motion</b><small>Soft feedback</small></span><span className="is-wide"><i /><b>Theme tokens</b><small>Light ↔ Dark</small></span></div>
      <div className="promo-system-line"><i /><span /><span /><span /></div>
    </section>
  );
}

function PromoDevice({ type, theme }) {
  return (
    <div className={`promo-device promo-device--${type}`}>
      <div className="promo-device__screen">
        <div className={`promo-app promo-app--${theme}`}>
          <header className="promo-app__header"><b>K/UX</b><span>Product preview</span><i className="promo-theme-indicator">{theme === 'light' ? '☼' : '◐'}</i></header>
          <div className="promo-spark-field">{promoSparks.map((spark, index) => <i key={`${spark.x}-${spark.y}`} style={{ '--spark-x': `${spark.x}%`, '--spark-y': `${spark.y}%`, '--spark-delay': `${spark.delay}s`, '--spark-duration': `${spark.duration}s`, '--spark-index': index }} />)}</div>
          <div className="promo-app__tour">{promoViews.map((view, index) => <PromoView key={view.name} view={view} index={index} />)}</div>
          <footer className="promo-app__nav">{promoViews.map((view, index) => <span key={view.name} style={{ '--nav-index': index }}><i />{view.name}</span>)}</footer>
          <div className="promo-page-dots"><i /><i /><i /></div>
        </div>
      </div>
    </div>
  );
}

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
          <div className="hero-device-showcase" aria-hidden="true">
            <div className="device-promo-scene device-promo-scene--iphone">
              <PromoDevice type="iphone" theme="light" />
              <span className="device-promo-chip device-promo-chip--mode">☼ Light interface</span>
              <span className="device-promo-chip device-promo-chip--tour">Code-built · 3 views</span>
            </div>
            <div className="device-promo-scene device-promo-scene--macbook">
              <PromoDevice type="macbook" theme="dark" />
              <span className="device-promo-chip device-promo-chip--mode">◐ Dark interface</span>
              <span className="device-promo-chip device-promo-chip--tour">Same UI · desktop</span>
            </div>
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

      <section className="stats-band" aria-label="Portfolio facts"><AnimatedStat value={1} label={<>BCA<br />First Year</>} /><AnimatedStat value={projects.length} label={<>Portfolio<br />Projects</>} /><AnimatedStat value={1} suffix="+" label={<>Year in Web<br />Development</>} /></section>

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
