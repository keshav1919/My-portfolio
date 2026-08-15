import { BriefcaseBusiness, FolderKanban, Home, KeyRound, Mail, UserRound, Wrench } from 'lucide-react';

export const mainNavigation = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Work', path: '/projects', icon: FolderKanban },
  { label: 'Meta 2FA', path: '/meta-2fa', icon: KeyRound },
  { label: 'About', path: '/about', icon: UserRound },
  { label: 'Skills', path: '/skills', icon: Wrench },
  { label: 'Experience', path: '/experience', icon: BriefcaseBusiness },
  { label: 'Contact', path: '/contact', icon: Mail }
];
