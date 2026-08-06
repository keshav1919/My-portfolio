import { Github, Linkedin, Globe } from 'lucide-react';
import { profile } from '../../data/profile';

const links = [
  { key: 'github', label: 'GitHub', icon: Github },
  { key: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { key: 'portfolio', label: 'Portfolio', icon: Globe }
];

export function SocialLinks() {
  return <div className="social-links">{links.map(({ key, label, icon: Icon }) => profile[key]
    ? <a key={key} href={profile[key]} target="_blank" rel="noopener noreferrer" aria-label={`Open ${label}`}><Icon /></a>
    : <button key={key} disabled title={`${label} URL is not configured`} aria-label={`${label} unavailable`}><Icon /></button>
  )}</div>;
}
