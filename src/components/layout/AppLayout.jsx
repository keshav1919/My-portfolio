import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { ScrollToTopButton } from '../common/ScrollToTopButton';

export function AppLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="main-content"><Outlet /></main>
      <footer className="footer"><div className="container">© {new Date().getFullYear()} Keshav. Built with React and care.</div></footer>
      <MobileBottomNav />
      <ScrollToTopButton />
    </>
  );
}
