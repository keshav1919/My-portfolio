import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ShortcutRow } from '../../components/dashboard/ShortcutRow';
import { getShortcuts, getUserFavorites, toggleUserFavorite } from '../../services/firestoreService';
import { Keyboard, Search } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function ShortcutsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [shortcuts, setShortcuts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [scData, favs] = await Promise.all([
          getShortcuts(),
          user ? getUserFavorites(user.uid) : Promise.resolve([]),
        ]);
        if (isMounted) {
          setShortcuts(scData);
          setFavorites(favs);
        }
      } catch (err) {
        console.warn('[ShortcutsPage error]', err);
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
      const added = await toggleUserFavorite(user.uid, { ...item, type: 'shortcut' });
      if (added) {
        setFavorites((prev) => [...prev, { id: item.id, itemData: item }]);
        toast.success(`Saved "${item.title}" to favorites`);
      } else {
        setFavorites((prev) => prev.filter((f) => f.id !== item.id));
        toast.info(`Removed from favorites`);
      }
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const categories = ['All', ...new Set(shortcuts.map((s) => s.category).filter(Boolean))];

  const filteredShortcuts = shortcuts.filter((sc) => {
    const matchesCat = selectedCategory === 'All' || sc.category === selectedCategory;
    const shortcutKeysStr = Array.isArray(sc.keys) ? sc.keys.join(' ') : sc.keys;
    const matchesSearch =
      `${sc.title || ''} ${sc.description || ''} ${shortcutKeysStr}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Keyboard className="w-5 h-5 text-kc-accent" />
          <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">VS Code Keyboard Shortcuts (Windows)</h1>
        </div>
        <p className="text-xs sm:text-sm text-kc-muted m-0">
          Supercharge your coding speed with essential VS Code editor, multi-cursor, and navigation shortcuts.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="kc-input-wrapper flex-1 max-w-md">
          <span className="kc-input-icon-left">
            <Search />
          </span>
          <input
            type="text"
            placeholder="Search by action, key combination, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="kc-input has-left-icon text-xs sm:text-sm h-10"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-kc-accent text-[#090909] font-bold shadow-sm'
                  : 'bg-kc-surface text-kc-muted hover:text-kc-text border border-kc-border hover:bg-kc-surface-2'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      ) : filteredShortcuts.length === 0 ? (
        <div className="kc-card p-12 text-center text-kc-muted text-sm">
          No shortcuts found matching your search.
        </div>
      ) : (
        <div className="space-y-3">
          {filteredShortcuts.map((sc) => (
            <ShortcutRow
              key={sc.id}
              shortcut={sc}
              isFavorite={favorites.some((f) => f.id === sc.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default ShortcutsPage;
