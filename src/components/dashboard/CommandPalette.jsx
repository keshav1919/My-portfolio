import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Terminal, Wrench, BookOpen, Command as CmdIcon, ArrowRight, ExternalLink } from 'lucide-react';
import {
  STARTER_TOOLS,
  STARTER_COMMANDS,
  STARTER_SHORTCUTS,
  STARTER_ROADMAP_FRONTEND,
  STARTER_RESOURCES
} from '../../data/starterContent';

export function CommandPalette({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Combine items for unified search
  const allItems = [
    ...STARTER_TOOLS.map((t) => ({ ...t, itemType: 'Tool', icon: Wrench, route: '/dashboard/tools' })),
    ...STARTER_COMMANDS.map((c) => ({ ...c, itemType: 'Command', icon: Terminal, route: '/dashboard/commands' })),
    ...STARTER_SHORTCUTS.map((s) => ({ ...s, itemType: 'Shortcut', icon: CmdIcon, route: '/dashboard/shortcuts' })),
    ...STARTER_RESOURCES.map((r) => ({ ...r, itemType: 'Resource', icon: BookOpen, route: '/dashboard/resources' })),
    ...STARTER_ROADMAP_FRONTEND.map((f) => ({ ...f, itemType: 'Roadmap', icon: BookOpen, route: '/dashboard/roadmap' })),
  ];

  const filtered = query.trim()
    ? allItems.filter((item) => {
        const text = `${item.title || item.name || ''} ${item.description || ''} ${item.category || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
        return text.includes(query.toLowerCase());
      }).slice(0, 10)
    : allItems.slice(0, 8);

  const handleSelect = (item) => {
    onClose();
    if (item.url && item.itemType === 'Resource') {
      window.open(item.url, '_blank');
    } else {
      navigate(item.route);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(filtered.length, 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(filtered.length, 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[150] flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-kc-surface border border-kc-border rounded-2xl shadow-kc-lg overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-kc-border gap-3">
          <Search className="w-5 h-5 text-kc-muted shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools, commands, shortcuts, roadmaps... (Esc to close)"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-kc-text placeholder:text-kc-muted text-sm sm:text-base outline-none font-medium"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-kc-muted hover:text-kc-text p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] uppercase font-bold text-kc-muted px-2 py-0.5 rounded bg-kc-surface-2 border border-kc-border hidden sm:inline-block">
            ESC
          </span>
        </div>

        {/* Search Results List */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-kc-muted">
              No results found for &ldquo;<span className="text-kc-text font-semibold">{query}</span>&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((item, idx) => {
                const Icon = item.icon || Terminal;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={`${item.itemType}-${item.id || idx}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-kc-surface-2 text-kc-text border border-kc-accent/40'
                        : 'text-kc-text hover:bg-kc-surface-2 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-kc-surface flex items-center justify-center text-kc-accent shrink-0 border border-kc-border">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">{item.title || item.name}</span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-kc-surface border border-kc-border text-kc-muted">
                            {item.itemType}
                          </span>
                        </div>
                        <p className="text-xs text-kc-muted truncate max-w-md">
                          {item.description || item.command}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-kc-muted shrink-0 pl-2">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2.5 bg-kc-surface-2/70 border-t border-kc-border flex items-center justify-between text-[11px] text-kc-muted">
          <span>Navigate with <kbd className="font-mono font-bold text-kc-text">↑</kbd> <kbd className="font-mono font-bold text-kc-text">↓</kbd></span>
          <span>Press <kbd className="font-mono font-bold text-kc-text">Enter</kbd> to jump</span>
        </div>
      </div>
    </div>
  );
}
