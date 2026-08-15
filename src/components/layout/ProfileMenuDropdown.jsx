import { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../ui/Avatar';
import {
  User,
  Bookmark,
  ArrowUpRight,
  LogOut,
  Contrast,
  LogIn,
  UserPlus,
  KeyRound
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        !e.target.closest('.nav-avatar-btn')
      ) {
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
  const displayName = profile?.name || user?.displayName || 'Developer';
  const displayEmail = user?.email || 'user@example.com';
  const avatarId = profile?.avatarId || 'avatar-01';

  /* Shared menu-item class using theme tokens */
  const itemClass = 'flex items-center gap-3 rounded-[8px] hover:bg-kc-surface-2 text-kc-muted hover:text-kc-text transition-colors';
  const itemStyle = { padding: '9px 12px' };

  return (
    <div
      ref={dropdownRef}
      style={{ padding: '8px', borderRadius: '14px' }}
      className="absolute top-full right-0 mt-2 w-[calc(100vw-24px)] sm:w-72 max-w-72 bg-kc-surface border border-kc-border shadow-2xl shadow-black/20 dark:shadow-black/60 z-[150] animate-scale-in select-none text-[13.5px] font-medium text-kc-text"
      onClick={(e) => e.stopPropagation()}
    >
      {/* ─── Header: Fully Clickable User Info Block (Redirects to Profile) ─── */}
      {isLoggedIn ? (
        <Link
          to="/profile"
          onClick={onClose}
          style={{ padding: '8px 10px', borderRadius: '10px' }}
          className="mb-1 flex items-center gap-3 hover:bg-kc-surface-2 transition-colors group cursor-pointer border-b border-kc-border/60 pb-2.5"
          title="View full profile"
        >
          <div className="shrink-0 transition-transform group-hover:scale-105">
            <Avatar avatarId={avatarId} size={36} />
          </div>
          <div className="min-w-0 flex-1 pr-1">
            <div className="flex items-center justify-between gap-1">
              <p className="font-bold text-[13.5px] text-kc-text truncate m-0 leading-tight tracking-tight group-hover:text-kc-accent transition-colors">
                {displayName}
              </p>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-kc-accent/15 text-kc-accent border border-kc-accent/30 uppercase tracking-wider shrink-0">
                PRO
              </span>
            </div>
            <p className="text-[11.5px] text-kc-muted truncate m-0 mt-0.5 font-normal">
              {displayEmail}
            </p>
          </div>
        </Link>
      ) : (
        <div
          style={{ padding: '8px 6px' }}
          className="border-b border-kc-border mb-1 flex items-center gap-2"
        >
          <Link
            to="/login"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[8px] bg-kc-text text-kc-bg text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            <LogIn className="w-4 h-4" />
            Log in
          </Link>
          <Link
            to="/signup"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-[8px] border border-kc-border text-kc-muted text-[13px] font-semibold hover:bg-kc-surface-2 transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Sign up
          </Link>
        </div>
      )}

      {/* ─── Main Nav Group: Profile, Saved, View Portfolio ─── */}
      <div className="py-0.5 space-y-0.5">
        {isLoggedIn && (
          <Link to="/profile" onClick={onClose} style={itemStyle} className={itemClass}>
            <User className="w-4 h-4 text-kc-muted shrink-0" />
            <span>Profile</span>
          </Link>
        )}

        <Link to="/saved" onClick={onClose} style={itemStyle} className={itemClass}>
          <Bookmark className="w-4 h-4 text-kc-muted shrink-0" />
          <span>Saved</span>
        </Link>

        <Link to="/meta-2fa" onClick={onClose} style={itemStyle} className={itemClass}>
          <KeyRound className="w-4 h-4 text-kc-muted shrink-0" />
          <span>Meta 2FA</span>
        </Link>

        <Link to="/home" onClick={onClose} style={itemStyle} className={`${itemClass} justify-between`}>
          <div className="flex items-center gap-3">
            <ArrowUpRight className="w-4 h-4 text-kc-muted shrink-0" />
            <span>View Portfolio</span>
          </div>
        </Link>
      </div>

      {/* ─── Divider & Dark Mode Switch ─── */}
      <div className="border-t border-kc-border my-1 pt-1">
        <div
          role="button"
          tabIndex={0}
          style={itemStyle}
          className="flex items-center justify-between rounded-[8px] hover:bg-kc-surface-2 transition-colors cursor-pointer select-none"
          onClick={(e) => {
            e.stopPropagation();
            toggleTheme();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleTheme();
            }
          }}
        >
          <div className="flex items-center gap-3 text-kc-muted">
            <Contrast className="w-4 h-4 text-kc-muted shrink-0" />
            <span>Theme</span>
          </div>

          {/* Pill Toggle */}
          <div
            aria-hidden="true"
            style={{
              width: 40,
              height: 22,
              borderRadius: 9999,
              padding: 2,
              backgroundColor: theme === 'dark' ? 'var(--accent)' : 'var(--accent-muted)',
              transition: 'background-color 0.2s ease',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 9999,
                backgroundColor: '#ffffff',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                transition: 'transform 0.2s ease',
                transform: theme === 'dark' ? 'translateX(18px)' : 'translateX(0px)',
              }}
            />
          </div>
        </div>
      </div>

      {/* ─── Divider & Log Out (only if logged in) ─── */}
      {isLoggedIn && (
        <div className="border-t border-kc-border mt-1 pt-1">
          <button
            type="button"
            onClick={handleLogout}
            style={itemStyle}
            className="w-full flex items-center gap-3 rounded-[8px] text-kc-muted hover:text-kc-danger hover:bg-kc-danger/10 transition-colors cursor-pointer text-left font-medium text-[13.5px] border-none bg-transparent"
          >
            <LogOut className="w-4 h-4 text-kc-muted shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      )}
    </div>
  );
}
export default ProfileMenuDropdown;
