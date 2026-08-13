import React, { useEffect, useState, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { BrandMark } from '../common/BrandMark';
import {
  LayoutDashboard,
  Map,
  FileCode,
  Atom,
  Wrench,
  Terminal,
  Keyboard,
  BookOpen,
  Bookmark,
  User,
  Shield,
  ArrowUpRight,
  X
} from 'lucide-react';

const DASHBOARD_NAV = [
  { label: 'Overview', path: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: 'Frontend Roadmap', path: '/dashboard/roadmap', icon: Map },
  { label: 'JavaScript', path: '/dashboard/javascript', icon: FileCode },
  { label: 'React', path: '/dashboard/react', icon: Atom },
  { label: 'Developer Tools', path: '/dashboard/tools', icon: Wrench },
  { label: 'Useful Commands', path: '/dashboard/commands', icon: Terminal },
  { label: 'VS Code Shortcuts', path: '/dashboard/shortcuts', icon: Keyboard },
  { label: 'Resources', path: '/dashboard/resources', icon: BookOpen },
  { label: 'Favorites', path: '/dashboard/favorites', icon: Bookmark },
];

/** Returns true when viewport is >= 1024px (Tailwind lg) */
function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isDesktop;
}

export function DashboardSidebar({ isOpen, onClose }) {
  const { pathname } = useLocation();
  const isDesktop = useIsDesktop();

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  // Auto-close on route change (mobile)
  useEffect(() => {
    if (!isDesktop) handleClose();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, handleClose]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isOpen && !isDesktop) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, isDesktop]);

  // On desktop, sidebar is always visible. On mobile, controlled by isOpen.
  const sidebarVisible = isDesktop || isOpen;

  return (
    <>
      {/* Mobile Backdrop — only rendered when open on mobile */}
      {!isDesktop && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
          style={{ touchAction: 'none' }}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className="fixed top-0 bottom-0 left-0 z-50 w-64 bg-kc-surface border-r border-kc-border flex flex-col justify-between"
        style={{
          transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out',
          pointerEvents: sidebarVisible ? 'auto' : 'none',
        }}
      >
        {/* Brand Header */}
        <div>
          <div className="p-4 sm:p-5 flex items-center justify-between border-b border-kc-border">
            <Link to="/home" onClick={handleClose} className="flex items-center gap-2">
              <BrandMark />
            </Link>
            {/* X close button — only visible on mobile */}
            {!isDesktop && (
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-xl bg-kc-surface-2 hover:bg-kc-border text-kc-muted hover:text-kc-text flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close navigation"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 custom-scrollbar overflow-y-auto max-h-[calc(100vh-175px)]" aria-label="Dashboard navigation">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-kc-muted">
              Developer Platform
            </div>

            {DASHBOARD_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={handleClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-kc-surface-2 text-kc-text border border-kc-accent/40 shadow-kc-sm'
                        : 'text-kc-muted hover:text-kc-text hover:bg-kc-surface-2/60 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 text-kc-accent shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* Admin Key Gate Link */}
            <div className="pt-3 mt-3 border-t border-kc-border">
              <div className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-kc-accent">
                Administration
              </div>
              <NavLink
                to="/admin"
                onClick={handleClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-kc-accent/15 text-kc-accent border border-kc-accent/40'
                      : 'text-kc-muted hover:text-kc-text hover:bg-kc-surface-2/60 border border-transparent'
                  }`
                }
              >
                <Shield className="w-4 h-4 text-kc-accent shrink-0" />
                <span>Admin Panel (Key)</span>
              </NavLink>
            </div>
          </nav>
        </div>

        {/* Footer Area */}
        <div className="p-3 border-t border-kc-border space-y-1">
          <NavLink
            to="/profile"
            onClick={handleClose}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-kc-surface-2 text-kc-text border border-kc-accent/40'
                  : 'text-kc-muted hover:text-kc-text hover:bg-kc-surface-2/60 border border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-kc-muted" />
              <span>Profile Settings</span>
            </div>
          </NavLink>

          <Link
            to="/home"
            onClick={handleClose}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-kc-muted hover:text-kc-text hover:bg-kc-surface-2/40 transition-colors"
          >
            <span>Visit Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
export default DashboardSidebar;


