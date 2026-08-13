import React from 'react';
import { Avatar } from '../ui/Avatar';
import { X, Mail, MapPin, Calendar, Clock, Shield, Briefcase, Github, Linkedin, Globe } from 'lucide-react';

export function UserDetailModal({ user, isOpen, onClose, onToggleStatus, onToggleRole, actionLoading = false }) {
  if (!isOpen || !user) return null;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="kc-card w-full max-w-lg p-6 bg-kc-surface shadow-kc-lg border-kc-border max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-kc-border">
          <div className="flex items-center gap-3">
            <Avatar avatarId={user.avatarId || 'avatar-01'} size={52} className="ring-2 ring-kc-border" />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-kc-text m-0">{user.name || 'Developer'}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  user.role === 'admin' ? 'bg-kc-accent/15 text-kc-accent' : 'bg-kc-surface-2 text-kc-muted'
                }`}>
                  {user.role || 'user'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                  user.status === 'blocked' ? 'bg-kc-danger/15 text-kc-danger' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  {user.status || 'active'}
                </span>
              </div>
              <p className="text-xs text-kc-muted m-0 mt-0.5">{user.email}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-kc-muted hover:text-kc-text p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Details list */}
        <div className="py-4 space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-kc-surface-2">
              <span className="text-kc-muted block text-[10px] uppercase font-bold mb-1">UID</span>
              <span className="text-kc-text font-mono truncate block">{user.uid}</span>
            </div>
            <div className="p-3 rounded-xl bg-kc-surface-2">
              <span className="text-kc-muted block text-[10px] uppercase font-bold mb-1">Primary Role</span>
              <span className="text-kc-text font-semibold truncate block">{user.primaryRole || 'Frontend Developer'}</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-kc-surface-2 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-kc-muted flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Registered:</span>
              <span className="text-kc-text font-semibold">{formatDate(user.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-kc-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Last Login:</span>
              <span className="text-kc-text font-semibold">{formatDate(user.lastLoginAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-kc-muted flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Location:</span>
              <span className="text-kc-text font-semibold">{user.location || 'Not specified'}</span>
            </div>
          </div>

          {user.bio && (
            <div className="p-3 rounded-xl bg-kc-surface-2">
              <span className="text-kc-muted block text-[10px] uppercase font-bold mb-1">Bio</span>
              <p className="text-kc-text m-0 leading-relaxed">{user.bio}</p>
            </div>
          )}

          {(user.skills || []).length > 0 && (
            <div>
              <span className="text-kc-muted block text-[10px] uppercase font-bold mb-1.5">Skills</span>
              <div className="flex flex-wrap gap-1.5">
                {user.skills.map((skill) => (
                  <span key={skill} className="px-2.5 py-0.5 rounded-lg bg-kc-surface-2 text-kc-text text-[11px] font-semibold border border-kc-border">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-kc-border flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggleRole(user)}
            disabled={actionLoading}
            className="kc-btn-secondary text-xs h-9 px-3"
          >
            {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(user)}
            disabled={actionLoading}
            className={`text-xs h-9 px-4 rounded-xl font-bold transition-colors cursor-pointer ${
              user.status === 'blocked' ? 'kc-btn-primary' : 'kc-btn-danger'
            }`}
          >
            {user.status === 'blocked' ? 'Unblock User' : 'Block User'}
          </button>
        </div>
      </div>
    </div>
  );
}
