import React, { useState } from 'react';
import { Copy, Check, Terminal, Bookmark } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

export function CommandCard({ command, isFavorite = false, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(command.command);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="kc-card kc-card-hover p-5 flex flex-col justify-between h-full bg-kc-surface">
      <div>
        {/* Category & Favorite Header */}
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-kc-surface-2 border border-kc-border text-kc-accent">
            {command.category || 'Terminal'}
          </span>

          {onToggleFavorite && (
            <button
              type="button"
              onClick={() => onToggleFavorite(command)}
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

        {/* Title */}
        <h3 className="text-sm font-bold text-kc-text mb-1 truncate">
          {command.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-kc-muted leading-relaxed line-clamp-2 mb-3">
          {command.description}
        </p>

        {/* Command Code Box with Copy */}
        <div className="relative group/box rounded-xl bg-[#090909] border border-kc-border p-3 font-mono text-xs text-[#a8d5b5] flex items-center justify-between gap-2 overflow-x-auto custom-scrollbar">
          <span className="truncate select-all">{command.command}</span>
          <button
            type="button"
            onClick={handleCopy}
            className={`shrink-0 flex items-center gap-1 text-[11px] font-sans font-bold px-2 py-1 rounded-lg transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-kc-surface-2 text-kc-muted hover:text-kc-text hover:bg-kc-surface-2/90 border border-kc-border'
            }`}
            title="Copy command"
            aria-label="Copy command"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tags */}
      {(command.tags || []).length > 0 && (
        <div className="pt-3 mt-3 border-t border-kc-border/60 flex flex-wrap gap-1.5">
          {command.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-kc-surface-2 text-kc-muted">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
