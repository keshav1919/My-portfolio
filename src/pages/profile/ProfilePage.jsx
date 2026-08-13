import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/ui/Avatar';
import { AvatarPicker } from '../../components/ui/AvatarPicker';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Github,
  Linkedin,
  Globe,
  Calendar,
  Clock,
  Sparkles,
  LogOut,
  Edit3,
  Check,
  X,
  Plus,
  Shield,
  ArrowLeft,
  LayoutDashboard
} from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, updateProfileData, logout, isAdmin } = useAuth();
  const { toast } = useToast();

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
        name: profile.name || user?.displayName || '',
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

  // Helper formatting dates
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    if (timestamp.toDate) {
      return timestamp.toDate().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }
    return new Date(timestamp).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-kc-bg text-kc-text pb-24">
      {/* Top Header */}
      <header className="border-b border-kc-border bg-kc-surface/60 backdrop-blur-md sticky top-0 z-40">
        <div className="app-container py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="p-2 rounded-xl text-kc-muted hover:text-kc-text hover:bg-kc-surface-2 transition-colors"
              aria-label="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-bold text-kc-text m-0">Developer Profile</h1>
              <p className="text-xs text-kc-muted m-0">Manage your identity and workspace settings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="kc-btn-secondary text-xs h-9 px-3">
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Dashboard</span>
            </Link>
            {isAdmin && (
              <Link to="/admin" className="kc-btn-secondary text-xs h-9 px-3 border-kc-accent/40 text-kc-accent">
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="app-container max-w-4xl py-8 space-y-8 animate-fade-in">
        {/* Profile Card Header */}
        <div className="kc-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-kc-surface to-kc-surface/90">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-kc-border">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <Avatar avatarId={formData.avatarId} size={84} className="ring-4 ring-kc-border shadow-kc-md" />
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker((prev) => !prev)}
                  className="absolute -bottom-1 -right-1 bg-kc-surface border border-kc-border text-kc-accent p-1.5 rounded-full shadow hover:bg-kc-surface-2 transition-transform hover:scale-110 cursor-pointer"
                  title="Change Avatar"
                  aria-label="Change Avatar"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                </button>
              </div>

              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-2xl font-extrabold text-kc-text m-0">{formData.name || 'Developer'}</h2>
                  {isAdmin && (
                    <span className="px-2.5 py-0.5 rounded-full bg-kc-accent/15 text-kc-accent text-xs font-bold border border-kc-accent/30">
                      ADMIN
                    </span>
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                    Active
                  </span>
                </div>
                <p className="text-sm text-kc-muted mt-1 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{formData.primaryRole}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{formData.location}</span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="kc-btn-primary text-sm h-10 px-4 w-full sm:w-auto cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setShowAvatarPicker(false);
                    }}
                    disabled={saving}
                    className="kc-btn-secondary text-sm h-10 px-4 flex-1 sm:flex-initial cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Cancel</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="kc-btn-primary text-sm h-10 px-5 flex-1 sm:flex-initial cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{saving ? 'Saving...' : 'Save'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Avatar Picker Drawer */}
          {showAvatarPicker && (
            <div className="mt-6 p-4 rounded-2xl bg-kc-surface-2/60 border border-kc-border animate-slide-up">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-kc-muted">Choose your Avatar</span>
                <button
                  type="button"
                  onClick={() => setShowAvatarPicker(false)}
                  className="text-xs text-kc-muted hover:text-kc-text cursor-pointer"
                >
                  Close
                </button>
              </div>
              <AvatarPicker
                selectedId={formData.avatarId}
                onSelect={(id) => {
                  setFormData((prev) => ({ ...prev, avatarId: id }));
                  if (!isEditing) {
                    // Instant save if outside full edit mode
                    updateProfileData({ avatarId: id });
                    toast.success('Avatar updated');
                    setShowAvatarPicker(false);
                  }
                }}
              />
            </div>
          )}

          {/* Bio Section */}
          <div className="pt-6">
            <label className="block text-xs font-bold uppercase tracking-wider text-kc-muted mb-2">About & Bio</label>
            {isEditing ? (
              <textarea
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell other developers about your journey and frontend focus..."
                className="kc-input h-auto py-3 resize-none"
              />
            ) : (
              <p className="text-sm text-kc-text/90 leading-relaxed max-w-2xl">
                {formData.bio || 'No bio specified yet.'}
              </p>
            )}
          </div>
        </div>

        {/* Detailed Information & Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Identity & Contact Details */}
          <div className="kc-card p-6 space-y-4">
            <h3 className="text-base font-bold text-kc-text flex items-center gap-2 pb-3 border-b border-kc-border">
              <User className="w-4 h-4 text-kc-accent" />
              <span>Details & Links</span>
            </h3>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-kc-muted mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="kc-input text-sm"
                />
              ) : (
                <p className="text-sm font-semibold text-kc-text">{formData.name}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-xs font-semibold text-kc-muted mb-1">Email Address</label>
              <div className="flex items-center gap-2 text-sm text-kc-muted bg-kc-surface-2 px-3 py-2 rounded-xl border border-kc-border">
                <Mail className="w-4 h-4 shrink-0" />
                <span className="truncate">{user?.email || profile?.email}</span>
                <span className="ml-auto text-[11px] font-bold text-emerald-400">Verified</span>
              </div>
            </div>

            {/* Primary Role */}
            <div>
              <label className="block text-xs font-semibold text-kc-muted mb-1">Primary Role</label>
              {isEditing ? (
                <input
                  type="text"
                  name="primaryRole"
                  value={formData.primaryRole}
                  onChange={handleChange}
                  placeholder="e.g. Frontend Web Developer"
                  className="kc-input text-sm"
                />
              ) : (
                <p className="text-sm text-kc-text">{formData.primaryRole}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-semibold text-kc-muted mb-1">Location</label>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  className="kc-input text-sm"
                />
              ) : (
                <p className="text-sm text-kc-text">{formData.location}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-xs font-semibold text-kc-muted mb-1">Experience</label>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="e.g. 1 Year in React"
                  className="kc-input text-sm"
                />
              ) : (
                <p className="text-sm text-kc-text">{formData.experience}</p>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-2 space-y-3">
              <div>
                <label className="block text-xs font-semibold text-kc-muted mb-1">GitHub URL</label>
                {isEditing ? (
                  <div className="relative">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kc-muted" />
                    <input
                      type="url"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="https://github.com/username"
                      className="kc-input pl-9 text-sm"
                    />
                  </div>
                ) : formData.github ? (
                  <a
                    href={formData.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-kc-accent hover:underline flex items-center gap-1.5"
                  >
                    <Github className="w-3.5 h-3.5" /> {formData.github}
                  </a>
                ) : (
                  <span className="text-xs text-kc-muted">Not specified</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-kc-muted mb-1">LinkedIn URL</label>
                {isEditing ? (
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kc-muted" />
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      placeholder="https://linkedin.com/in/username"
                      className="kc-input pl-9 text-sm"
                    />
                  </div>
                ) : formData.linkedin ? (
                  <a
                    href={formData.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-kc-accent hover:underline flex items-center gap-1.5"
                  >
                    <Linkedin className="w-3.5 h-3.5" /> {formData.linkedin}
                  </a>
                ) : (
                  <span className="text-xs text-kc-muted">Not specified</span>
                )}
              </div>
            </div>
          </div>

          {/* Technical Skills & Activity Stats */}
          <div className="kc-card p-6 space-y-6 flex flex-col justify-between">
            <div>
              <h3 className="text-base font-bold text-kc-text flex items-center gap-2 pb-3 border-b border-kc-border">
                <Sparkles className="w-4 h-4 text-kc-accent" />
                <span>Skills & Tech Stack</span>
              </h3>

              <div className="flex flex-wrap gap-2 py-4">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-kc-surface-2 border border-kc-border text-xs font-semibold text-kc-text"
                  >
                    <span>{skill}</span>
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-kc-muted hover:text-kc-danger transition-colors cursor-pointer"
                        aria-label={`Remove ${skill}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>

              {isEditing && (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add a new skill (e.g. Next.js)..."
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill(e)}
                    className="kc-input text-xs h-9"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="kc-btn-secondary text-xs h-9 px-3 shrink-0 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
              )}
            </div>

            {/* Account Metadata */}
            <div className="pt-4 border-t border-kc-border space-y-2 text-xs text-kc-muted">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Joined Date:
                </span>
                <span className="text-kc-text font-semibold">{formatDate(profile?.createdAt)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Last Active:
                </span>
                <span className="text-kc-text font-semibold">{formatDate(profile?.lastLoginAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* EXCLUSIVE LOGOUT SECTION (UX RULE #24) */}
        <div className="pt-8 border-t border-kc-border/80 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-kc-surface/40 border border-kc-border">
          <div>
            <h4 className="text-sm font-bold text-kc-text m-0">Account Session</h4>
            <p className="text-xs text-kc-muted mt-0.5">End your current session across this browser.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="kc-btn-danger text-sm px-6 h-11 w-full sm:w-auto cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign out of KeshavCoder</span>
          </button>
        </div>
      </main>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Sign Out of KeshavCoder"
        message="Are you sure you want to sign out of your KeshavCoder workspace?"
        confirmText="Yes, Sign Out"
        isDanger={true}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
export default ProfilePage;
