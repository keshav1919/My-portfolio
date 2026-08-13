import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ToolCard } from '../../components/dashboard/ToolCard';
import { CommandCard } from '../../components/dashboard/CommandCard';
import { ShortcutRow } from '../../components/dashboard/ShortcutRow';
import { ResourceCard } from '../../components/dashboard/ResourceCard';
import { getUserFavorites, toggleUserFavorite } from '../../services/firestoreService';
import { Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function FavoritesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // 'all' | 'tools' | 'commands' | 'shortcuts' | 'resources'

  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!user) return;
      try {
        const favs = await getUserFavorites(user.uid);
        if (isMounted) setFavorites(favs);
      } catch (err) {
        console.warn('[FavoritesPage error]', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [user]);

  const handleToggleFavorite = async (item) => {
    if (!user) return;
    try {
      await toggleUserFavorite(user.uid, item);
      setFavorites((prev) => prev.filter((f) => f.id !== item.id));
      toast.info(`Removed from favorites`);
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const filtered = favorites.filter((fav) => {
    const itemType = fav.type || fav.itemData?.type;
    if (tab === 'all') return true;
    if (tab === 'tools') return itemType === 'tool' || fav.id.startsWith('tool-');
    if (tab === 'commands') return itemType === 'command' || fav.id.startsWith('cmd-');
    if (tab === 'shortcuts') return itemType === 'shortcut' || fav.id.startsWith('sc-');
    if (tab === 'resources') return itemType === 'resource' || fav.id.startsWith('res-');
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-5 h-5 text-amber-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">Your Saved Favorites</h1>
          </div>
          <p className="text-xs sm:text-sm text-kc-muted m-0">
            Quickly access all bookmarked tools, commands, shortcuts, and learning resources.
          </p>
        </div>

        <span className="text-xs font-bold text-kc-muted bg-kc-surface px-3 py-1.5 rounded-xl border border-kc-border shrink-0 self-start sm:self-auto">
          {favorites.length} saved {favorites.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-kc-border pb-2 overflow-x-auto custom-scrollbar">
        {[
          { id: 'all', label: 'All Items' },
          { id: 'tools', label: 'Tools' },
          { id: 'commands', label: 'Commands' },
          { id: 'shortcuts', label: 'Shortcuts' },
          { id: 'resources', label: 'Resources' },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
              tab === t.id
                ? 'bg-kc-accent text-[#090909] font-bold shadow-sm'
                : 'text-kc-muted hover:text-kc-text hover:bg-kc-surface-2'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Grid or Empty state */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="kc-card p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-kc-surface-2 flex items-center justify-center text-kc-muted">
            <Bookmark className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-kc-text mb-1">No favorites saved yet</h3>
            <p className="text-xs text-kc-muted max-w-sm mx-auto">
              Click the bookmark icon on any tool, command, shortcut, or resource to save it here.
            </p>
          </div>
          <Link to="/dashboard/tools" className="kc-btn-primary text-xs h-9 px-4">
            <span>Explore Developer Tools</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((fav) => {
            const item = fav.itemData || fav;
            const isTool = fav.type === 'tool' || fav.id.startsWith('tool-') || item.url;
            const isCmd = fav.type === 'command' || fav.id.startsWith('cmd-') || item.command;
            const isSc = fav.type === 'shortcut' || fav.id.startsWith('sc-') || item.keys;

            if (isCmd) {
              return (
                <div key={fav.id} className="sm:col-span-2 lg:col-span-1">
                  <CommandCard
                    command={item}
                    isFavorite={true}
                    onToggleFavorite={() => handleToggleFavorite(item)}
                  />
                </div>
              );
            }

            if (isSc) {
              return (
                <div key={fav.id} className="col-span-full">
                  <ShortcutRow
                    shortcut={item}
                    isFavorite={true}
                    onToggleFavorite={() => handleToggleFavorite(item)}
                  />
                </div>
              );
            }

            if (isTool) {
              return (
                <ToolCard
                  key={fav.id}
                  tool={item}
                  isFavorite={true}
                  onToggleFavorite={() => handleToggleFavorite(item)}
                />
              );
            }

            return (
              <ResourceCard
                key={fav.id}
                resource={item}
                isFavorite={true}
                onToggleFavorite={() => handleToggleFavorite(item)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
export default FavoritesPage;
