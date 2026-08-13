import React, { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../ui/Avatar';
import { ProfileMenuDropdown } from '../layout/ProfileMenuDropdown';
import {
  Shield,
  LayoutDashboard,
  Users,
  Wrench,
  Terminal,
  Keyboard,
  Map,
  BookOpen,
  Activity,
  Sun,
  Moon,
  ArrowUpRight,
  Menu,
  X,
  ArrowLeft,
  Lock,
  Sparkles
} from 'lucide-react';

const ADMIN_NAV = [
  { label: 'Overview', path: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'User Management', path: '/admin/users', icon: Users },
  { label: 'Developer Tools', path: '/admin/tools', icon: Wrench },
  { label: 'Commands', path: '/admin/commands', icon: Terminal },
  { label: 'Shortcuts', path: '/admin/shortcuts', icon: Keyboard },
  { label: 'Roadmaps', path: '/admin/roadmaps', icon: Map },
  { label: 'Resources', path: '/admin/resources', icon: BookOpen },
  { label: 'Activity Logs', path: '/admin/activity', icon: Activity },
];

export function AdminLayout() {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleLockAdmin = () => {
    sessionStorage.removeItem('kc_admin_unlocked');
    sessionStorage.removeItem('kc_admin_key_session');
    toast.info('Admin platform locked');
    navigate('/admin', { replace: true });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-text flex selection:bg-kc-accent-surface selection:text-[#090909]">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-kc-surface border-r border-kc-border flex flex-col justify-between transition-transform duration-300 ease-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-5 flex items-center justify-between border-b border-kc-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-kc-accent/15 border border-kc-accent/30 text-kc-accent flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wider uppercase text-kc-text block leading-none">
                  Admin <span className="text-kc-accent">Panel</span>
                </span>
                <span className="text-[10px] text-kc-accent font-semibold flex items-center gap-1 mt-0.5">
                  <Sparkles className="w-2.5 h-2.5" /> Key Verified
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-kc-muted hover:text-kc-text p-1 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation links */}
          <nav className="p-3 space-y-1 custom-scrollbar overflow-y-auto max-h-[calc(100vh-210px)]">
            <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-kc-muted">
              Platform Controls
            </div>

            {ADMIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.exact}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-kc-accent/15 text-kc-accent border border-kc-accent/40 shadow-kc-sm'
                        : 'text-kc-muted hover:text-kc-text hover:bg-kc-surface-2 border border-transparent'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer links with Lock Admin Button */}
        <div className="p-3 border-t border-kc-border space-y-1">
          <button
            type="button"
            onClick={handleLockAdmin}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-kc-danger hover:bg-kc-danger/10 border border-transparent hover:border-kc-danger/30 transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Admin Session</span>
            </div>
          </button>

          <Link
            to="/dashboard"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-kc-muted hover:text-kc-text hover:bg-kc-surface-2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>User Dashboard</span>
            </div>
          </Link>
          <Link
            to="/home"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-kc-muted hover:text-kc-text hover:bg-kc-surface-2 transition-colors"
          >
            <span>Portfolio Home</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Admin Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <header className="sticky top-0 z-30 h-16 bg-kc-bg/85 backdrop-blur-xl border-b border-kc-border px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-kc-surface-2 border border-kc-border text-kc-text flex items-center justify-center hover:bg-kc-accent/15 hover:border-kc-accent/30 transition-colors cursor-pointer shrink-0"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-kc-accent/15 text-kc-accent text-xs font-bold border border-kc-accent/30 hidden sm:inline-flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                HOSTINGER AI ADMIN
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleTheme()}
              className="theme-button hidden sm:grid"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={handleLockAdmin}
              className="p-2 rounded-xl text-kc-muted hover:text-kc-danger hover:bg-kc-danger/10 transition-colors cursor-pointer"
              title="Lock Admin Session"
              aria-label="Lock Admin Session"
            >
              <Lock className="w-4 h-4" />
            </button>

            {/* Profile Avatar Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileDropdownOpen((v) => !v)}
                className="nav-avatar-btn"
                aria-label="Open user profile menu"
                aria-expanded={profileDropdownOpen}
              >
                <Avatar avatarId={profile?.avatarId || 'avatar-01'} size={34} />
              </button>

              {profileDropdownOpen && (
                <ProfileMenuDropdown onClose={() => setProfileDropdownOpen(false)} />
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AdminLayout;
