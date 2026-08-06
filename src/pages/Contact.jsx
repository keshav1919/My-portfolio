import { Copy, Github, Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { Card } from '../components/common/Card';
import { AppButton } from '../components/common/AppButton';
import { profile } from '../data/profile';
import { copyText } from '../utils/clipboard';
import { isConfigured } from '../utils/links';
import { useToast } from '../context/ToastContext';

const contactItems = [
  { key: 'email', label: 'Email', icon: Mail, getHref: (value) => `mailto:${value}` },
  { key: 'phone', label: 'Phone', icon: Phone, getHref: (value) => `tel:${value.replace(/\s/g, '')}` },
  { key: 'location', label: 'Location', icon: MapPin },
  { key: 'github', label: 'GitHub', icon: Github, external: true },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin, external: true },
  { key: 'portfolio', label: 'Portfolio', icon: Globe, external: true }
];

export default function Contact() {
  const { showToast } = useToast();
  const handleCopy = async (label, value) => {
    if (!isConfigured(value)) return showToast(`${label} is still a placeholder.`);
    try { await copyText(value); showToast(`${label} copied successfully.`, 'success'); }
    catch { showToast('Copy is unavailable in this browser.', 'error'); }
  };

  return (
    <PageContainer>
      <SEO title="Contact" description="Contact Keshav by email, phone or social links." path="/contact" />
      <SectionTitle eyebrow="Contact" title="Let’s discuss your next website" description="No backend form is used. Contact actions open your device's native apps or configured links." />
      <section className="contact-grid">{contactItems.map(({ key, label, icon: Icon, getHref, external }) => {
        const value = profile[key];
        const ready = key === 'location' || isConfigured(value);
        const href = getHref ? getHref(value) : value;
        return (
          <Card key={key} className="contact-card">
            <Icon aria-hidden="true" /><div><span>{label}</span><strong>{value || 'Not configured'}</strong></div>
            <div className="contact-card__actions">
              {key !== 'location' && (ready ? <a className="icon-button" href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} aria-label={`Open ${label}`}><Icon size={18} /></a> : <button className="icon-button" disabled title={`${label} is not configured`} aria-label={`${label} unavailable`}><Icon size={18} /></button>)}
              {(key === 'email' || key === 'phone') && <button className="icon-button" onClick={() => handleCopy(label, value)} aria-label={`Copy ${label}`}><Copy size={18} /></button>}
            </div>
          </Card>
        );
      })}</section>
      <section className="cta"><div><span className="eyebrow">Start a conversation</span><h2>Have a frontend project in mind?</h2><p>Add your real email in <code>src/data/profile.js</code>, then this button opens a ready mail message.</p></div><AppButton href={isConfigured(profile.email) ? `mailto:${profile.email}?subject=Frontend%20Project` : undefined} icon={Mail} disabled={!isConfigured(profile.email)}>Send Email</AppButton></section>
    </PageContainer>
  );
}
