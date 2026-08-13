import React from 'react';
import { ExternalLink, Bookmark, BookOpen } from 'lucide-react';

export function ResourceCard({ resource, isFavorite = false, onToggleFavorite }) {
  return (
    <div className="kc-card kc-card-hover p-5 flex flex-col justify-between h-full bg-kc-surface">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-kc-surface-2 border border-kc-border text-kc-accent">
            {resource.category || 'Documentation'}
          </span>

          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(resource)}
              className={`p-1 rounded-lg border transition-colors cursor-pointer ${
                isFavorite
                  ? 'bg-kc-accent/15 border-kc-accent text-kc-accent'
                  : 'border-transparent text-kc-muted hover:text-kc-text hover:bg-kc-surface-2'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isFavorite ? 'fill-kc-accent' : ''}`} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-lg bg-kc-surface-2 flex items-center justify-center text-kc-accent border border-kc-border">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-sm font-bold text-kc-text truncate m-0">
            {resource.title || resource.name}
          </h3>
        </div>

        <p className="text-xs text-kc-muted leading-relaxed line-clamp-2 mb-3">
          {resource.description}
        </p>
      </div>

      <div className="pt-3 border-t border-kc-border/70 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1">
          {(resource.tags || []).slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-kc-surface-2 text-kc-muted">
              {tag}
            </span>
          ))}
        </div>

        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-kc-accent hover:underline flex items-center gap-1 shrink-0 ml-auto"
          >
            <span>Learn</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
