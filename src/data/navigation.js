import { BriefcaseBusiness, FolderKanban, Home, Mail, UserRound, Wrench } from 'lucide-react';

export const mainNavigation = [
  { label: 'Home', path: '/home', icon: Home },
  { label: 'Work', path: '/projects', icon: FolderKanban },
  { label: 'About', path: '/about', icon: UserRound },
  { label: 'Skills', path: '/skills', icon: Wrench },
  { label: 'Experience', path: '/experience', icon: BriefcaseBusiness },
  { label: 'Contact', path: '/contact', icon: Mail }
];
