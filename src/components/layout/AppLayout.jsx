import { ArrowUpRight, Github, Mail, Settings } from 'lucide-react';
import { Suspense, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { mainNavigation } from '../../data/navigation';
import { profile } from '../../data/profile';
import { BrandMark } from '../common/BrandMark';
import { LoadingScreen } from '../common/LoadingScreen';
import { ScrollToTopButton } from '../common/ScrollToTopButton';
import { MobileBottomNav } from './MobileBottomNav';
import { Navbar } from './Navbar';

export function AppLayout() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]);
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Navbar />
      <main id="main-content" className="main-content"><div className="route-view" key={pathname}><Suspense fallback={<LoadingScreen />}><Outlet /></Suspense></div></main>
      <footer className="footer">
        <div className="container footer__inner">
          <div className="footer__brand"><Link to="/home" aria-label="Keshav home"><BrandMark /></Link><p>Frontend Developer<br />Punjab, India</p></div>
          <nav aria-label="Footer navigation">{mainNavigation.map(({ label, path }) => <Link key={path} to={path}>{label}</Link>)}<Link to="/settings"><Settings /> Settings</Link></nav>
          <div className="footer__contact">
            <span>Find me online</span>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Github /></a>
            <a href={`mailto:${profile.email}`}>Email <Mail /></a>
          </div>
          <div className="footer__bottom"><span>&copy; {new Date().getFullYear()} Keshav. Built with React and care.</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top <ArrowUpRight /></button></div>
        </div>
      </footer>
      <MobileBottomNav />
      <ScrollToTopButton />
    </>
  );
}
