export const SITE = {
  name: 'Keshav',
  role: 'Frontend Web Developer',
  url: import.meta.env.VITE_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''),
  version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  description: 'Frontend developer portfolio of Keshav from Punjab, India.'
};

export const STORAGE_KEYS = {
  theme: 'keshav-theme',
  splash: 'keshav-splash-seen'
};
