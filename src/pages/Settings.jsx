import { Download, Info, LockKeyhole, RotateCcw, Share2 } from 'lucide-react';
import { useState } from 'react';
import { AppButton } from '../components/common/AppButton';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { ThemeSwitch } from '../components/portfolio/ThemeSwitch';
import { SITE, STORAGE_KEYS } from '../constants/site';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { profile } from '../data/profile';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { copyText } from '../utils/clipboard';
import { safeStorage } from '../utils/storage';

export default function Settings() {
  const [modal, setModal] = useState(null);
  const { canInstall, installed, install } = useInstallPrompt();
  const { showToast } = useToast();
  const { theme, setPreference } = useTheme();
  const installApp = async () => {
    if (installed) return showToast('The app is already installed.');
    if (!canInstall) return showToast('Install is not available here. Use your browser menu and choose “Install app” or “Add to Home screen”.');
    const accepted = await install();
    showToast(accepted ? 'Installation started.' : 'Installation was cancelled.', accepted ? 'success' : 'info');
  };
  const shareApp = async () => {
    const shareData = { title: SITE.name, text: SITE.description, url: SITE.url };
    try { if (navigator.share) await navigator.share(shareData); else { await copyText(SITE.url); showToast('Portfolio URL copied.'); } }
    catch (error) { if (error.name !== 'AbortError') showToast('Sharing is unavailable.', 'error'); }
  };
  const clearPreferences = () => {
    safeStorage.remove(STORAGE_KEYS.theme);
    safeStorage.remove(STORAGE_KEYS.splash);
    setPreference('dark');
    showToast('Saved preferences cleared.', 'success');
  };
  return (
    <PageContainer className="inner-page settings-page">
      <SEO title="Settings" description="Manage theme, PWA installation and portfolio app information." path="/settings" />
      <header className="page-hero"><SectionTitle eyebrow="Settings" title="Make the portfolio feel like yours." description="Theme and app preferences stay on this device. No account or tracking system is connected." /></header>
      <section className="settings-grid">
        <Card className="settings-card settings-card--wide"><h2>Interface palette</h2><p>Choose the deep dark portfolio, a soft light version, or follow your device setting.</p><ThemeSwitch /><div className="theme-preview"><div><span>Current preview</span><strong>{theme === 'dark' ? 'Deep dark' : 'Soft light'}</strong></div><span className="theme-preview__accent" /></div></Card>
        <Card className="settings-card"><h2>Portfolio app</h2><p>Version {SITE.version}. Install it to your device or share it with someone.</p><div className="button-stack"><AppButton icon={Download} onClick={installApp}>{installed ? 'App installed' : 'Install app'}</AppButton><AppButton variant="secondary" icon={Share2} onClick={shareApp}>Share portfolio</AppButton></div></Card>
        <Card className="settings-card"><h2>Information</h2><p>Read how this lightweight portfolio handles data and works as an app.</p><div className="button-stack"><AppButton variant="secondary" icon={LockKeyhole} onClick={() => setModal('privacy')}>Privacy policy</AppButton><AppButton variant="secondary" icon={Info} onClick={() => setModal('about')}>About this app</AppButton></div></Card>
        <Card className="settings-card"><h2>Developer</h2><div className="developer-row"><img src={profile.profileImage} alt="Keshav" /><div><strong>{profile.name}</strong><span>{profile.role}</span><span>{profile.location}</span></div></div></Card>
        <Card className="settings-card"><h2>Local preferences</h2><p>Clear the theme and splash-screen choices saved in your browser.</p><AppButton variant="secondary" icon={RotateCcw} onClick={clearPreferences}>Clear preferences</AppButton></Card>
      </section>
      <Modal open={modal === 'privacy'} onClose={() => setModal(null)} title="Privacy policy"><p>This portfolio does not use analytics, tracking scripts, authentication, a database or a backend contact form.</p><p>The only saved data is your theme preference. It stays in your browser&apos;s local storage.</p><p>External links open only when you choose them. Their own privacy policies apply after leaving this app.</p></Modal>
      <Modal open={modal === 'about'} onClose={() => setModal(null)} title="About this app"><p>Keshav Portfolio is a lightweight React and Vite Progressive Web App created to present projects, skills, experience and contact details.</p><p>It uses local data, native browser APIs and an offline service worker to reduce bandwidth and hosting usage.</p></Modal>
    </PageContainer>
  );
}
