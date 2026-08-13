import React, { useState } from 'react';
import { Copy, Check, Bookmark, Keyboard } from 'lucide-react';
import { copyToClipboard } from '../../utils/clipboard';

export function ShortcutRow({ shortcut, isFavorite = false, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);

  const shortcutString = Array.isArray(shortcut.keys) ? shortcut.keys.join(' + ') : shortcut.keys;

  const handleCopy = async () => {
    const success = await copyToClipboard(shortcutString);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-kc-surface border border-kc-border hover:border-kc-border-hover transition-colors">
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-kc-surface-2 flex items-center justify-center text-kc-accent shrink-0 border border-kc-border mt-0.5 sm:mt-0">
          <Keyboard className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-bold text-kc-text m-0 truncate">
              {shortcut.title}
            </h4>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-kc-surface-2 text-kc-muted">
              {shortcut.category || 'General'}
            </span>
          </div>
          <p className="text-xs text-kc-muted m-0 mt-0.5 line-clamp-1">
            {shortcut.description}
          </p>
        </div>
      </div>

      {/* Keys badge + Copy + Favorite */}
      <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
        {/* Keys pill */}
        <div className="flex items-center gap-1">
          {(Array.isArray(shortcut.keys) ? shortcut.keys : [shortcut.keys]).map((key, i) => (
            <kbd
              key={i}
              className="px-2 py-1 text-xs font-mono font-bold bg-[#090909] text-kc-accent border border-kc-border rounded-lg shadow-sm"
            >
              {key}
            </kbd>
          ))}
        </div>

        {/* Copy Button */}
        <button
          type="button"
          onClick={handleCopy}
          className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
            copied
              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
              : 'bg-kc-surface-2 text-kc-muted hover:text-kc-text border-kc-border'
          }`}
          title="Copy shortcut combination"
          aria-label="Copy shortcut combination"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Favorite Button */}
        {onToggleFavorite && (
          <button
            type="button"
            onClick={() => onToggleFavorite(shortcut)}
            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-kc-accent/15 border-kc-accent text-kc-accent'
                : 'border-transparent text-kc-muted hover:text-kc-text hover:bg-kc-surface-2'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-kc-accent' : ''}`} />
          </button>
        )}
      </div>
    </div>
  );
}
