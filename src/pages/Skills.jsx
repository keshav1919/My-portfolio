import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { SkillCard } from '../components/portfolio/SkillCard';
import { skillGroups } from '../data/skills';

export default function Skills() {
  return (
    <PageContainer>
      <SEO title="Skills" description="Keshav's frontend development skills, tools and soft skills." path="/skills" />
      <SectionTitle eyebrow="Capabilities" title="Skills built through practice" description="Progress values are honest self-assessments and remain readable without relying on color." />
      <section className="skills-layout">{skillGroups.map((group) => <SkillCard key={group.title} group={group} />)}</section>
    </PageContainer>
  );
}
