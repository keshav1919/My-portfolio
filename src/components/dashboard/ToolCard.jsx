import React from 'react';
import { ExternalLink, Bookmark, Wrench } from 'lucide-react';

export function ToolCard({ tool, isFavorite = false, onToggleFavorite }) {
  return (
    <div className="kc-card kc-card-hover p-5 flex flex-col justify-between h-full group bg-kc-surface">
      <div>
        {/* Top bar: Category + Favorite Button */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-kc-surface-2 border border-kc-border text-kc-muted group-hover:border-kc-accent/30 transition-colors">
            {tool.category || 'Developer Tool'}
          </span>

          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(tool)}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-kc-accent/15 border-kc-accent text-kc-accent shadow-sm'
                  : 'border-transparent text-kc-muted hover:text-kc-text hover:bg-kc-surface-2'
              }`}
              title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-kc-accent' : ''}`} />
            </button>
          )}
        </div>

        {/* Title & Description */}
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-7 h-7 rounded-lg bg-kc-surface-2 flex items-center justify-center text-kc-accent border border-kc-border">
            <Wrench className="w-3.5 h-3.5" />
          </div>
          <h3 className="text-base font-bold text-kc-text m-0 group-hover:text-kc-accent transition-colors truncate">
            {tool.title || tool.name}
          </h3>
        </div>

        <p className="text-xs text-kc-muted leading-relaxed line-clamp-2 mb-4">
          {tool.description}
        </p>
      </div>

      {/* Tags & Action Link */}
      <div className="pt-3 border-t border-kc-border/70 flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-6">
          {(tool.tags || []).slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-kc-surface-2 text-kc-muted">
              {tag}
            </span>
          ))}
        </div>

        {tool.url && (
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-kc-accent hover:underline flex items-center gap-1 shrink-0 ml-auto"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
