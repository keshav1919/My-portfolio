import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { CommandPalette } from './CommandPalette';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Avatar } from '../ui/Avatar';
import { ProfileMenuDropdown } from '../layout/ProfileMenuDropdown';
import { Search, Menu, Sun, Moon } from 'lucide-react';

export function DashboardLayout() {
  const { profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { pathname } = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSidebarOpen(false);
        setProfileDropdownOpen(false);
        setPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close profile dropdown and mobile sidebar on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-kc-bg text-kc-text flex selection:bg-kc-accent-surface selection:text-[#090909] overflow-x-hidden">
      {/* Responsive Off-Canvas Sidebar */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main App Workspace */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Navbar with Home-style Ambient Visual Background */}
        <header className="sticky top-0 z-30 h-16 bg-kc-bg/85 backdrop-blur-xl border-b border-kc-border px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors relative overflow-hidden">
          {/* Home-style Ambient Radial Glow */}
          <div
            className="hero-ambient absolute -top-12 -right-8 w-72 h-72 opacity-25 pointer-events-none"
            aria-hidden="true"
          />

          {/* Left: Mobile Menu Trigger & Search Bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl relative z-10">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden w-9 h-9 rounded-xl bg-kc-surface-2 border border-kc-border text-kc-text flex items-center justify-center hover:bg-kc-accent/15 hover:border-kc-accent/30 transition-colors cursor-pointer shrink-0"
              aria-label="Open sidebar navigation"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="flex items-center justify-between w-full max-w-md h-10 px-3.5 rounded-xl bg-kc-surface/90 border border-kc-border hover:border-kc-border-hover text-kc-muted hover:text-kc-text transition-all text-xs font-medium cursor-pointer shadow-sm"
              aria-label="Search platform"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-kc-accent" />
                <span className="truncate">Search tools, commands, shortcuts...</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-kc-surface-2 border border-kc-border rounded">
                  Ctrl
                </kbd>
                <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-bold bg-kc-surface-2 border border-kc-border rounded">
                  K
                </kbd>
              </div>
            </button>
          </div>

          {/* Right: Theme switch + Profile Avatar Menu */}
          <div className="flex items-center gap-3 relative z-10">
            <button
              type="button"
              onClick={() => toggleTheme()}
              className="theme-button hidden sm:grid"
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Avatar with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setProfileDropdownOpen((prev) => !prev);
                }}
                className="nav-avatar-btn"
                aria-label="Open user menu"
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

        {/* Dynamic Page Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
          <Outlet />
        </main>
      </div>

      {/* Global Command Palette Modal */}
      <CommandPalette isOpen={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  );
}
export default DashboardLayout;
