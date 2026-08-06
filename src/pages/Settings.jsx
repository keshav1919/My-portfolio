import { Download, Info, LockKeyhole, LogOut, RotateCcw, Share2, Star } from 'lucide-react';
import { useState } from 'react';
import { PageContainer } from '../components/common/PageContainer';
import { SEO } from '../components/common/SEO';
import { SectionTitle } from '../components/common/SectionTitle';
import { Card } from '../components/common/Card';
import { AppButton } from '../components/common/AppButton';
import { Modal } from '../components/common/Modal';
import { ThemeSwitch } from '../components/portfolio/ThemeSwitch';
import { profile } from '../data/profile';
import { SITE, STORAGE_KEYS } from '../constants/site';
import { useInstallPrompt } from '../hooks/useInstallPrompt';
import { useToast } from '../context/ToastContext';
import { copyText } from '../utils/clipboard';
import { safeStorage } from '../utils/storage';
import { useTheme } from '../context/ThemeContext';

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
    try {
      if (navigator.share) await navigator.share(shareData);
      else { await copyText(SITE.url); showToast('Portfolio URL copied.'); }
    } catch (error) {
      if (error.name !== 'AbortError') showToast('Sharing is unavailable.', 'error');
    }
  };

  const clearPreferences = () => {
    safeStorage.remove(STORAGE_KEYS.theme);
    safeStorage.remove(STORAGE_KEYS.splash);
    setPreference('system');
    showToast('Saved preferences cleared.', 'success');
  };

  return (
    <PageContainer>
      <SEO title="Settings" description="Manage theme, PWA installation and portfolio app information." path="/settings" />
      <SectionTitle eyebrow="Settings" title="Personalize the portfolio app" description="Preferences stay on this device and no account or tracking system is connected." />
      <section className="settings-grid">
        <Card className="settings-card settings-card--wide"><h2>Interface palette</h2><p>Choose electric blue, midnight violet or follow your device setting.</p><ThemeSwitch /><div className="theme-preview"><div><span>Current preview</span><strong>{theme === 'dark' ? 'Midnight violet' : 'Electric blue'}</strong></div><span className="theme-preview__accent" /></div></Card>
        <Card className="settings-card"><h2>Application</h2><p>Version {SITE.version}</p><div className="button-stack"><AppButton icon={Download} onClick={installApp}>{installed ? 'App Installed' : 'Install App'}</AppButton><AppButton variant="secondary" icon={Share2} onClick={shareApp}>Share App</AppButton><AppButton variant="secondary" icon={Star} onClick={() => showToast('Connect this button to your future app-store rating URL.')}>Rate App</AppButton></div></Card>
        <Card className="settings-card"><h2>Information</h2><div className="button-stack"><AppButton variant="secondary" icon={LockKeyhole} onClick={() => setModal('privacy')}>Privacy Policy</AppButton><AppButton variant="secondary" icon={Info} onClick={() => setModal('about')}>About App</AppButton></div></Card>
        <Card className="settings-card"><h2>Developer</h2><div className="developer-row"><img src={profile.profileImage} alt="Keshav" /><div><strong>{profile.name}</strong><span>{profile.role}</span><span>{profile.location}</span></div></div></Card>
        <Card className="settings-card settings-card--wide"><h2>Local preferences</h2><p>Clear theme and splash-screen choices stored in your browser.</p><div className="inline-actions"><AppButton variant="secondary" icon={RotateCcw} onClick={clearPreferences}>Clear saved preferences</AppButton><AppButton variant="danger" icon={LogOut} onClick={() => showToast('No account system is connected, so there is nothing to log out from.')}>Logout (UI only)</AppButton></div></Card>
      </section>

      <Modal open={modal === 'privacy'} onClose={() => setModal(null)} title="Privacy Policy">
        <p>This portfolio does not use analytics, tracking scripts, authentication, a database or a backend contact form.</p><p>The only saved data is your theme preference and whether the splash screen has already been shown. These values stay in your browser's local storage.</p><p>External links open only when you choose them. Their own privacy policies apply after leaving this app.</p>
      </Modal>
      <Modal open={modal === 'about'} onClose={() => setModal(null)} title="About App">
        <p>Keshav Portfolio is a lightweight React and Vite Progressive Web App created to present projects, skills, experience and contact details.</p><p>It uses local data, system fonts, small SVG graphics, native browser APIs and an offline service worker to reduce bandwidth and hosting usage.</p>
      </Modal>
    </PageContainer>
  );
}
