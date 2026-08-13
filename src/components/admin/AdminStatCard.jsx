import React from 'react';

export function AdminStatCard({ title, value, subtitle, icon: Icon, color = 'accent' }) {
  const colorStyles = {
    accent: 'bg-kc-accent/15 text-kc-accent border-kc-accent/30',
    emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
  };

  return (
    <div className="kc-card p-5 bg-kc-surface flex flex-col justify-between">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-bold uppercase tracking-wider text-kc-muted">
          {title}
        </span>
        {Icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${colorStyles[color] || colorStyles.accent}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-extrabold text-kc-text mb-1">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-kc-muted m-0">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
