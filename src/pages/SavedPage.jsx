import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSaved } from '../context/SavedContext';
import { PageContainer } from '../components/common/PageContainer';
import { SectionTitle } from '../components/common/SectionTitle';
import { SEO } from '../components/common/SEO';
import { EmptyState } from '../components/common/EmptyState';
import { ToolCard } from '../components/dashboard/ToolCard';
import { CommandCard } from '../components/dashboard/CommandCard';
import { ShortcutRow } from '../components/dashboard/ShortcutRow';
import { ResourceCard } from '../components/dashboard/ResourceCard';
import { CardSkeleton } from '../components/ui/Skeleton';
import {
  Bookmark,
  Sparkles,
  ArrowRight,
  LogIn,
  Layers,
  Wrench,
  Terminal,
  Keyboard,
  BookOpen
} from 'lucide-react';

export default function SavedPage() {
  const { user } = useAuth();
  const { savedItems, loading, toggleSave } = useSaved();
  const [tab, setTab] = useState('all'); // 'all' | 'tools' | 'commands' | 'shortcuts' | 'resources'

  const filtered = useMemo(() => {
    return savedItems.filter((fav) => {
      const itemType = fav.type || fav.itemData?.type || '';
      const id = String(fav.id || '');
      if (tab === 'all') return true;
      if (tab === 'tools') return itemType === 'tool' || id.startsWith('tool-');
      if (tab === 'commands') return itemType === 'command' || id.startsWith('cmd-');
      if (tab === 'shortcuts') return itemType === 'shortcut' || id.startsWith('sc-');
      if (tab === 'resources') return itemType === 'resource' || id.startsWith('res-');
      return true;
    });
  }, [savedItems, tab]);

  return (
    <PageContainer className="inner-page saved-page py-8">
      <SEO
        title="Saved Items — Developer Workspace"
        description="Your bookmarked tools, terminal commands, shortcuts and developer resources."
        path="/saved"
      />

      {/* Header */}
      <header className="page-hero pb-6">
        <SectionTitle
          eyebrow="Saved Collection"
          title="Your Bookmarked Tools & Resources"
          description="Everything you have saved for quick access across your developer workflow."
        />
      </header>

      {/* Unauthenticated Banner */}
      {!user && (
        <div className="p-6 rounded-2xl border border-kc-border bg-kc-surface flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-kc-accent/15 text-kc-accent flex items-center justify-center shrink-0">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-kc-text m-0">Sign in to save and sync</h3>
              <p className="text-xs text-kc-muted m-0 mt-0.5">
                Log in to securely persist your saved tools, commands, and shortcuts across devices.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              to="/login"
              className="px-4 py-2 rounded-xl bg-kc-text text-kc-bg text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <LogIn className="w-3.5 h-3.5" />
              Log In
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-xl border border-kc-border text-kc-text text-xs font-bold hover:bg-kc-surface-2 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-kc-border pb-4 mb-6">
        {[
          { id: 'all', label: 'All Items', icon: Layers, count: savedItems.length },
          { id: 'tools', label: 'Tools', icon: Wrench },
          { id: 'commands', label: 'Commands', icon: Terminal },
          { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
          { id: 'resources', label: 'Resources', icon: BookOpen },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer border ${
              tab === id
                ? 'bg-kc-accent-surface text-[#090909] border-kc-accent-surface'
                : 'bg-kc-surface border-kc-border text-kc-muted hover:text-kc-text hover:bg-kc-surface-2'
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

      {/* Main Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <CardSkeleton key={n} />
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
          {filtered.map((fav) => {
            const item = fav.itemData || fav;
            const itemType = fav.type || item.type || '';
            const id = String(fav.id || '');

            if (itemType === 'command' || id.startsWith('cmd-')) {
              return (
                <CommandCard
                  key={fav.id}
                  command={item}
                  isFavorite={true}
                  onToggleFavorite={() => toggleSave(item)}
                />
              );
            }

            if (itemType === 'shortcut' || id.startsWith('sc-')) {
              return (
                <div key={fav.id} className="sm:col-span-2 lg:col-span-3">
                  <ShortcutRow
                    shortcut={item}
                    isFavorite={true}
                    onToggleFavorite={() => toggleSave(item)}
                  />
                </div>
              );
            }

            if (itemType === 'resource' || id.startsWith('res-')) {
              return (
                <ResourceCard
                  key={fav.id}
                  resource={item}
                  isFavorite={true}
                  onToggleFavorite={() => toggleSave(item)}
                />
              );
            }

            // Default to ToolCard
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
        <div className="py-16 text-center max-w-md mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-kc-surface-2 border border-kc-border text-kc-muted flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-6 h-6 opacity-60" />
          </div>
          <h3 className="text-base font-bold text-kc-text mb-1">No saved items yet</h3>
          <p className="text-xs text-kc-muted leading-relaxed mb-6">
            Bookmark helpful tools, CLI commands, VS Code shortcuts, and docs from DevHub to access them instantly here.
          </p>
          <Link
            to="/projects/devhub"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-kc-accent text-[#090909] font-bold text-xs hover:opacity-90 transition-opacity"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Explore DevHub Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </PageContainer>
  );
}
