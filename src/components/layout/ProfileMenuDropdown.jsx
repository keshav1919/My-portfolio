import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import {
  User,
  Bookmark,
  Map,
  Wrench,
  Terminal,
  Keyboard,
  BookOpen,
  ArrowUpRight,
  Send,
  LogOut,
  Shield,
  LayoutDashboard,
  Contrast,
  LogIn,
  UserPlus
} from 'lucide-react';

export function ProfileMenuDropdown({ onClose }) {
  const dropdownRef = useRef(null);
  const { user, profile, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Escape key and outside pointer listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (onClose) onClose();
      }
    };

    const handlePointerDown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (onClose) onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [onClose]);

  const handleLogout = async () => {
    try {
      if (onClose) onClose();
      await logout();
      toast.info('Logged out successfully');
      navigate('/home');
    } catch {
      toast.error('Failed to log out');
    }
  };

  const isLoggedIn = !!user;
  const displayName = profile?.name || user?.displayName || '';
  const displayEmail = user?.email || '';

  /* Shared menu-item class (no highlight) */
  const itemClass = 'flex items-center gap-3 rounded-[8px] hover:bg-[#f4f4f5] dark:hover:bg-[#222225] text-[#27272a] dark:text-[#d4d4d8] hover:text-[#09090b] dark:hover:text-[#ffffff] transition-colors';
  const itemStyle = { padding: '8px 12px' };

  return (
    <>
      {/* Invisible Outside Click Catcher */}
      <div
        className="fixed inset-0 z-[140] bg-transparent"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        style={{ padding: '8px', borderRadius: '12px', right: 20 }}
        className="fixed top-[60px] w-72 sm:w-80 bg-[#ffffff] dark:bg-[#18181a] border border-[#e4e4e7] dark:border-[#27272a] shadow-2xl shadow-black/15 dark:shadow-black/60 z-[150] animate-scale-in select-none text-[13.5px] font-medium text-[#18181b] dark:text-[#f4f4f5]"
        onClick={(e) => e.stopPropagation()}
      >

        {/* ─── Header: Logged-in user info OR Login/Signup ─── */}
        {isLoggedIn ? (
          <div
            style={itemStyle}
            className="border-b border-[#f4f4f5] dark:border-[#27272a] mb-1 flex items-center justify-between"
          >
            <div className="min-w-0 pr-2">
              <p className="font-bold text-[14px] text-[#09090b] dark:text-[#fafafa] truncate m-0 leading-tight tracking-tight">
                {displayName}
              </p>
              <p className="text-[12px] text-[#71717a] dark:text-[#9593a8] truncate m-0 mt-0.5 font-normal">
                {displayEmail}
              </p>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#673de6]/15 text-[#673de6] dark:text-[#a382ff] border border-[#673de6]/30 uppercase tracking-wider shrink-0">
              PRO
            </span>
          </div>
        ) : (
          <div
            style={itemStyle}
            className="border-b border-[#f4f4f5] dark:border-[#27272a] mb-1 flex items-center gap-2"
          >
            <Link
              to="/login"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[8px] bg-[#09090b] dark:bg-[#fafafa] text-[#fafafa] dark:text-[#09090b] text-[13px] font-semibold hover:opacity-90 transition-opacity"
            >
              <LogIn className="w-4 h-4" />
              Log in
            </Link>
            <Link
              to="/signup"
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[8px] border border-[#e4e4e7] dark:border-[#27272a] text-[#27272a] dark:text-[#d4d4d8] text-[13px] font-semibold hover:bg-[#f4f4f5] dark:hover:bg-[#222225] transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              Sign up
            </Link>
          </div>
        )}

        {/* ─── Group 1: Profile & Dashboard (only when logged in) ─── */}
        {isLoggedIn && (
          <div className="py-0.5 space-y-0.5">
            <Link to="/profile" onClick={onClose} style={itemStyle} className={itemClass}>
              <User className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
              <span>Profile & Account</span>
            </Link>

            <Link to="/dashboard" onClick={onClose} style={itemStyle} className={itemClass}>
              <LayoutDashboard className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
              <span>Developer Dashboard</span>
            </Link>

            <Link to="/dashboard/favorites" onClick={onClose} style={itemStyle} className={itemClass}>
              <Bookmark className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
              <span>Saved Favorites</span>
            </Link>
          </div>
        )}

        {/* ─── Group 2: Developer Platform ─── */}
        <div className="border-t border-[#f4f4f5] dark:border-[#27272a] my-1 pt-1 space-y-0.5">
          <Link to="/dashboard/roadmap" onClick={onClose} style={itemStyle} className={itemClass}>
            <Map className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
            <span>Frontend Roadmaps</span>
          </Link>

          <Link to="/dashboard/tools" onClick={onClose} style={itemStyle} className={itemClass}>
            <Wrench className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
            <span>Developer Tools</span>
          </Link>

          <Link to="/dashboard/commands" onClick={onClose} style={itemStyle} className={itemClass}>
            <Terminal className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
            <span>Terminal Commands</span>
          </Link>

          <Link to="/dashboard/shortcuts" onClick={onClose} style={itemStyle} className={itemClass}>
            <Keyboard className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
            <span>VS Code Shortcuts</span>
          </Link>

          <Link to="/dashboard/resources" onClick={onClose} style={itemStyle} className={itemClass}>
            <BookOpen className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
            <span>Resources & Docs</span>
          </Link>
        </div>

        {/* ─── Group 3: Admin & Portfolio ─── */}
        <div className="border-t border-[#f4f4f5] dark:border-[#27272a] my-1 pt-1 space-y-0.5">
          {isLoggedIn && (
            <Link
              to="/admin"
              onClick={onClose}
              style={itemStyle}
              className="flex items-center gap-3 rounded-[8px] hover:bg-[#673de6]/10 text-[#673de6] dark:text-[#a382ff] font-semibold transition-colors"
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span>Admin Platform (Key)</span>
            </Link>
          )}

          <Link to="/home" onClick={onClose} style={itemStyle} className={`${itemClass} justify-between`}>
            <div className="flex items-center gap-3">
              <ArrowUpRight className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
              <span>Visit Portfolio</span>
            </div>
          </Link>

          <Link to="/contact" onClick={onClose} style={itemStyle} className={`${itemClass} justify-between`}>
            <div className="flex items-center gap-3">
              <Send className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
              <span>Hire Keshav</span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#71717a] dark:text-[#9593a8]" />
          </Link>
        </div>

        {/* ─── Group 4: Dark Mode Switch & Logout ─── */}
        <div className="border-t border-[#f4f4f5] dark:border-[#27272a] my-1 pt-1">
          {/* Dark Mode — does NOT close dropdown */}
          <div
            role="button"
            tabIndex={0}
            style={itemStyle}
            className="flex items-center justify-between rounded-[8px] hover:bg-[#f4f4f5] dark:hover:bg-[#222225] transition-colors cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation();
              toggleTheme();
              // dropdown stays open — intentionally no onClose() here
            }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTheme(); } }}
          >
            <div className="flex items-center gap-3 text-[#27272a] dark:text-[#d4d4d8]">
              <Contrast className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
              <span>Dark mode</span>
            </div>

            {/* Pill Toggle — visual only */}
            <div
              aria-hidden="true"
              style={{
                width: 44,
                height: 24,
                borderRadius: 9999,
                padding: 2,
                backgroundColor: theme === 'dark' ? '#673de6' : '#c4c4c8',
                transition: 'background-color 0.2s ease',
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 9999,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                  transition: 'transform 0.2s ease',
                  transform: theme === 'dark' ? 'translateX(20px)' : 'translateX(0px)',
                }}
              />
            </div>
          </div>

          {/* Log out */}
          {isLoggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              style={{ padding: '8px 12px' }}
              className="w-full flex items-center gap-3 rounded-[8px] text-[#27272a] dark:text-[#d4d4d8] hover:text-[#09090b] dark:hover:text-[#ffffff] hover:bg-[#f4f4f5] dark:hover:bg-[#222225] transition-colors cursor-pointer text-left font-medium text-[13.5px] border-none bg-transparent"
            >
              <LogOut className="w-4 h-4 text-[#71717a] dark:text-[#9593a8] shrink-0" />
              <span>Log out</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
}
export default ProfileMenuDropdown;
