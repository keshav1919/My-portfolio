import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';
import { useSaved } from '../../context/SavedContext';
import { Avatar } from '../../components/ui/Avatar';
import { AvatarPicker } from '../../components/ui/AvatarPicker';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { SEO } from '../../components/common/SEO';
import { ToolCard } from '../../components/dashboard/ToolCard';
import { CommandCard } from '../../components/dashboard/CommandCard';
import { ShortcutRow } from '../../components/dashboard/ShortcutRow';
import { ResourceCard } from '../../components/dashboard/ResourceCard';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  Calendar,
  Sparkles,
  LogOut,
  Edit3,
  Check,
  X,
  Plus,
  Shield,
  ArrowLeft,
  Bookmark,
  Contrast,
  Layers,
  Award,
  KeyRound,
  Terminal,
  Keyboard,
  Wrench,
  BookOpen
} from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, updateProfileData, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  const { savedItems, toggleSave } = useSaved();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview'); // 'overview' | 'saved' | 'appearance' | 'account'
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [skillInput, setSkillInput] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    avatarId: 'avatar-01',
    primaryRole: '',
    location: '',
    bio: '',
    experience: '',
    github: '',
    linkedin: '',
    website: '',
    skills: [],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || user?.displayName || 'Developer',
        avatarId: profile.avatarId || 'avatar-01',
        primaryRole: profile.primaryRole || 'Frontend Developer',
        location: profile.location || 'Punjab, India',
        bio: profile.bio || 'Passionate developer building responsive and user-friendly web experiences.',
        experience: profile.experience || '1 Year Experience',
        github: profile.github || 'https://github.com/',
        linkedin: profile.linkedin || '',
        website: profile.website || '',
        skills: profile.skills || ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkill = (e) => {
    e?.preventDefault();
    const trimmed = skillInput.trim();
    if (trimmed && !formData.skills.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!isEditing) return;
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfileData(formData);
      setIsEditing(false);
      setShowAvatarPicker(false);
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.info('Signed out of KeshavCoder');
      navigate('/home', { replace: true });
    } catch {
      toast.error('Logout failed');
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Member since 2026';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      });
    }
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const username = user?.email ? user.email.split('@')[0] : 'developer';

  return (
    <div className="min-h-screen bg-kc-bg text-kc-text pb-20">
      <SEO title="User Profile — Account & Settings" description="Manage your developer profile, account details, and saved items." path="/profile" />

      {/* ─── GitHub-style Top Header Bar ─── */}
      <header className="border-b border-kc-border bg-kc-surface/70 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            to="/home"
            className="inline-flex items-center gap-2 text-xs font-bold text-kc-muted hover:text-kc-text transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/projects/devhub"
              className="px-3 py-1.5 rounded-xl border border-kc-border text-xs font-semibold text-kc-muted hover:text-kc-text hover:bg-kc-surface-2 transition-colors flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-kc-accent" />
              <span>DevHub</span>
            </Link>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-3 py-1.5 rounded-xl border border-kc-border text-xs font-semibold text-kc-muted hover:text-kc-danger hover:bg-kc-danger/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* ─── Main GitHub-Inspired 2-Column Grid ─── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ─── LEFT COLUMN: User Identity Sidebar (~300px) ─── */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="space-y-4">
              {/* Avatar with change button */}
              <div className="relative inline-block group">
                <div className="ring-2 ring-kc-border rounded-full p-1 bg-kc-surface">
                  <Avatar avatarId={formData.avatarId} size={160} />
                </div>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowAvatarPicker(true)}
                    className="absolute bottom-2 right-2 p-2.5 rounded-full bg-kc-text text-kc-bg hover:opacity-90 shadow-lg transition-transform hover:scale-105 cursor-pointer"
                    title="Change Avatar"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* User Names & Badges */}
              <div>
                <h1 className="text-2xl font-extrabold text-kc-text tracking-tight m-0 leading-tight">
                  {formData.name || 'Developer'}
                </h1>
                <p className="text-sm text-kc-muted font-normal m-0 mt-0.5">
                  @{username}
                </p>
              </div>

              {/* Role & Status Pill */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-kc-accent/15 text-kc-accent border border-kc-accent/30 uppercase tracking-wider">
                  PRO MEMBER
                </span>
                {isAdmin && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-purple-500/15 text-purple-400 border border-purple-500/30 uppercase tracking-wider flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    ADMIN
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="text-xs sm:text-sm text-kc-muted leading-relaxed m-0 pt-1">
                {formData.bio}
              </p>

              {/* Edit Profile Action Button */}
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer border ${
                  isEditing
                    ? 'bg-kc-surface-2 border-kc-border text-kc-text'
                    : 'bg-kc-surface border-kc-border text-kc-text hover:bg-kc-surface-2 hover:border-kc-border-hover shadow-sm'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5 text-kc-accent" />
                <span>{isEditing ? 'Cancel Editing' : 'Edit profile'}</span>
              </button>

              {/* Metadata Details List */}
              <div className="space-y-2.5 pt-3 border-t border-kc-border text-xs text-kc-muted">
                <div className="flex items-center gap-2.5">
                  <Briefcase className="w-4 h-4 text-kc-muted shrink-0" />
                  <span className="truncate">{formData.primaryRole}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-kc-muted shrink-0" />
                  <span className="truncate">{formData.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-kc-muted shrink-0" />
                  <span className="truncate">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4 text-kc-muted shrink-0" />
                  <span>{formatDate(profile?.createdAt)}</span>
                </div>
                {formData.github && (
                  <div className="flex items-center gap-2.5">
                    <Github className="w-4 h-4 text-kc-muted shrink-0" />
                    <a href={formData.github} target="_blank" rel="noopener noreferrer" className="hover:text-kc-accent transition-colors truncate">
                      {formData.github.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* ─── RIGHT COLUMN: GitHub-style Tabs & Content ─── */}
          <section className="lg:col-span-8 space-y-6">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1 border-b border-kc-border pb-1 overflow-x-auto scrollbar-none">
              {[
                { id: 'overview', label: 'Overview', icon: Layers },
                { id: 'saved', label: 'Saved Items', icon: Bookmark, count: savedItems.length },
                { id: 'appearance', label: 'Appearance', icon: Contrast },
                { id: 'account', label: 'Account & Security', icon: Shield },
              ].map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-4 py-2.5 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 cursor-pointer border ${
                    activeTab === id
                      ? 'bg-kc-accent-surface text-[#090909] border-kc-accent-surface'
                      : 'bg-transparent border-transparent text-kc-muted hover:text-kc-text hover:bg-kc-surface'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                  {count !== undefined && count > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20 text-inherit font-bold">
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* ─── TAB 1: OVERVIEW ─── */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl border border-kc-border bg-kc-surface">
                    <span className="text-[11px] font-bold text-kc-muted uppercase tracking-wider block mb-1">
                      Saved Bookmarks
                    </span>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-2xl font-black text-kc-accent font-mono">
                        {savedItems.length}
                      </strong>
                      <span className="text-xs text-kc-muted">items</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-kc-border bg-kc-surface">
                    <span className="text-[11px] font-bold text-kc-muted uppercase tracking-wider block mb-1">
                      Experience
                    </span>
                    <div className="flex items-baseline gap-2">
                      <strong className="text-2xl font-black text-kc-text font-mono">
                        {formData.experience || '1 Year'}
                      </strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border border-kc-border bg-kc-surface">
                    <span className="text-[11px] font-bold text-kc-muted uppercase tracking-wider block mb-1">
                      Account Status
                    </span>
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
                      <strong className="text-sm font-bold text-emerald-400">
                        Active & Verified
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Skills & Technologies Card */}
                <div className="p-6 rounded-2xl border border-kc-border bg-kc-surface">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-kc-text m-0 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-kc-accent" />
                      <span>Technical Skills & Focus</span>
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-xl text-xs font-semibold bg-kc-surface-2 border border-kc-border text-kc-text inline-flex items-center gap-1.5"
                      >
                        <span>{skill}</span>
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-kc-muted hover:text-kc-danger transition-colors cursor-pointer ml-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>

                  {isEditing && (
                    <form onSubmit={handleAddSkill} className="flex gap-2 mt-4 max-w-sm">
                      <input
                        type="text"
                        placeholder="Add new skill (e.g. Next.js)..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-kc-surface-2 border border-kc-border text-xs text-kc-text placeholder:text-kc-muted outline-none focus:border-kc-accent"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-kc-text text-kc-bg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add
                      </button>
                    </form>
                  )}
                </div>

                {/* Edit Form Panel (visible when editing) */}
                {isEditing && (
                  <form onSubmit={handleSave} className="p-6 rounded-2xl border border-kc-accent/30 bg-kc-surface space-y-4 animate-fade-in">
                    <h3 className="text-sm font-bold text-kc-text m-0 flex items-center gap-2 text-kc-accent">
                      <Edit3 className="w-4 h-4" />
                      <span>Edit Account Profile</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-bold uppercase text-kc-muted block mb-1">Display Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl bg-kc-surface-2 border border-kc-border text-xs text-kc-text outline-none focus:border-kc-accent"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-kc-muted block mb-1">Primary Role</label>
                        <input
                          type="text"
                          name="primaryRole"
                          value={formData.primaryRole}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl bg-kc-surface-2 border border-kc-border text-xs text-kc-text outline-none focus:border-kc-accent"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-kc-muted block mb-1">Location</label>
                        <input
                          type="text"
                          name="location"
                          value={formData.location}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl bg-kc-surface-2 border border-kc-border text-xs text-kc-text outline-none focus:border-kc-accent"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold uppercase text-kc-muted block mb-1">GitHub Profile URL</label>
                        <input
                          type="url"
                          name="github"
                          value={formData.github}
                          onChange={handleChange}
                          className="w-full px-3 py-2 rounded-xl bg-kc-surface-2 border border-kc-border text-xs text-kc-text outline-none focus:border-kc-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase text-kc-muted block mb-1">Short Bio</label>
                      <textarea
                        name="bio"
                        rows="3"
                        value={formData.bio}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-xl bg-kc-surface-2 border border-kc-border text-xs text-kc-text outline-none focus:border-kc-accent"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-kc-border">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 rounded-xl border border-kc-border text-xs font-bold text-kc-muted hover:bg-kc-surface-2 transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-5 py-2 rounded-xl bg-kc-accent text-[#090909] text-xs font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50 flex items-center gap-2"
                      >
                        {saving ? <span>Saving...</span> : <><span>Save changes</span><Check className="w-3.5 h-3.5" /></>}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ─── TAB 2: SAVED ITEMS ─── */}
            {activeTab === 'saved' && (
              <div className="space-y-4 animate-fade-in">
                {savedItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedItems.map((fav) => {
                      const item = fav.itemData || fav;
                      const id = String(fav.id || '');
                      if (id.startsWith('cmd-')) {
                        return (
                          <CommandCard
                            key={fav.id}
                            command={item}
                            isFavorite={true}
                            onToggleFavorite={() => toggleSave(item)}
                          />
                        );
                      }
                      if (id.startsWith('sc-')) {
                        return (
                          <div key={fav.id} className="sm:col-span-2">
                            <ShortcutRow
                              shortcut={item}
                              isFavorite={true}
                              onToggleFavorite={() => toggleSave(item)}
                            />
                          </div>
                        );
                      }
                      if (id.startsWith('res-')) {
                        return (
                          <ResourceCard
                            key={fav.id}
                            resource={item}
                            isFavorite={true}
                            onToggleFavorite={() => toggleSave(item)}
                          />
                        );
                      }
                      return (
                        <ToolCard
                          key={fav.id}
                          tool={item}
                          isFavorite={true}
                          onToggleFavorite={() => toggleSave(item)}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-16 text-center border border-kc-border rounded-2xl bg-kc-surface">
                    <Bookmark className="w-8 h-8 opacity-40 mx-auto mb-3 text-kc-muted" />
                    <h4 className="text-sm font-bold text-kc-text mb-1">No saved items yet</h4>
                    <p className="text-xs text-kc-muted mb-4">Bookmark any tool or resource from DevHub to pin it here.</p>
                    <Link
                      to="/projects/devhub"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-kc-accent hover:underline"
                    >
                      <span>Open DevHub</span>
                      <ArrowLeft className="w-3 h-3 rotate-180" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* ─── TAB 3: APPEARANCE ─── */}
            {activeTab === 'appearance' && (
              <div className="p-6 rounded-2xl border border-kc-border bg-kc-surface space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-sm font-bold text-kc-text m-0 mb-1">Theme Preferences</h3>
                  <p className="text-xs text-kc-muted m-0">Choose how KeshavCoder looks to you. Select a theme preference.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => { if (theme !== 'dark') toggleTheme(); }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      theme === 'dark'
                        ? 'border-kc-accent bg-kc-accent/5 ring-1 ring-kc-accent'
                        : 'border-kc-border bg-kc-surface-2 hover:border-kc-border-hover'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-black border border-zinc-800 flex items-center justify-center mb-3 text-white">
                      <Contrast className="w-4 h-4" />
                    </div>
                    <strong className="text-xs font-bold text-kc-text block mb-0.5">Dark Mode</strong>
                    <span className="text-[11px] text-kc-muted">High-contrast dark terminal theme.</span>
                  </button>

                  <button
                    onClick={() => { if (theme !== 'light') toggleTheme(); }}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      theme === 'light'
                        ? 'border-kc-accent bg-kc-accent/5 ring-1 ring-kc-accent'
                        : 'border-kc-border bg-kc-surface-2 hover:border-kc-border-hover'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-white border border-zinc-200 flex items-center justify-center mb-3 text-zinc-900">
                      <Contrast className="w-4 h-4" />
                    </div>
                    <strong className="text-xs font-bold text-kc-text block mb-0.5">Light Mode</strong>
                    <span className="text-[11px] text-kc-muted">Clean, high-legibility light theme.</span>
                  </button>
                </div>
              </div>
            )}

            {/* ─── TAB 4: ACCOUNT & SECURITY ─── */}
            {activeTab === 'account' && (
              <div className="p-6 rounded-2xl border border-kc-border bg-kc-surface space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-sm font-bold text-kc-text m-0 mb-1">Account Credentials</h3>
                  <p className="text-xs text-kc-muted m-0">Your authentication session and account protection details.</p>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2.5 border-b border-kc-border">
                    <span className="text-kc-muted">Email Address</span>
                    <strong className="text-kc-text font-mono">{user?.email}</strong>
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-kc-border">
                    <span className="text-kc-muted">User ID</span>
                    <strong className="text-kc-text font-mono text-[11px]">{user?.uid}</strong>
                  </div>
                  <div className="flex items-center justify-between py-2.5 border-b border-kc-border">
                    <span className="text-kc-muted">Two-Factor Authentication (OTP)</span>
                    <span className="text-emerald-400 font-bold">Enabled & Verified</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="px-4 py-2 rounded-xl bg-kc-danger/10 text-kc-danger hover:bg-kc-danger/20 font-bold text-xs transition-colors cursor-pointer flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign out of session</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Avatar Picker Modal */}
      {showAvatarPicker && (
        <AvatarPicker
          selectedId={formData.avatarId}
          onSelect={(avatarId) => {
            setFormData((prev) => ({ ...prev, avatarId }));
            setShowAvatarPicker(false);
          }}
          onClose={() => setShowAvatarPicker(false)}
        />
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <ConfirmDialog
          title="Sign out of account?"
          message="Are you sure you want to sign out? Your saved items and roadmap milestones are safely stored in your account."
          confirmText="Yes, Sign Out"
          cancelText="Cancel"
          danger={true}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </div>
  );
}

export default ProfilePage;
