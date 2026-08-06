import { useEffect } from 'react';
import { SITE } from '../../constants/site';

export function SEO({ title, description = SITE.description, path = '/' }) {
  useEffect(() => {
    document.title = `${title} | ${SITE.name}`;
    const setMeta = (selector, attr, value) => {
      const element = document.querySelector(selector);
      if (element) element.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[property="og:title"]', 'content', `${title} | ${SITE.name}`);
    setMeta('meta[property="og:description"]', 'content', description);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `${SITE.url.replace(/\/$/, '')}${path}`;
  }, [title, description, path]);
  return null;
}
