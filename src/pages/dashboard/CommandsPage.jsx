import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { CommandCard } from '../../components/dashboard/CommandCard';
import { getCommands, getUserFavorites, toggleUserFavorite } from '../../services/firestoreService';
import { Terminal, Search } from 'lucide-react';
import { CardSkeleton } from '../../components/ui/Skeleton';

export function CommandsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [commands, setCommands] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [cmdsData, favs] = await Promise.all([
          getCommands(),
          user ? getUserFavorites(user.uid) : Promise.resolve([]),
        ]);
        if (isMounted) {
          setCommands(cmdsData);
          setFavorites(favs);
        }
      } catch (err) {
        console.warn('[CommandsPage error]', err);
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
      const added = await toggleUserFavorite(user.uid, { ...item, type: 'command' });
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

  const categories = ['All', ...new Set(commands.map((c) => c.category).filter(Boolean))];

  const filteredCommands = commands.filter((cmd) => {
    const matchesCat = selectedCategory === 'All' || cmd.category === selectedCategory;
    const matchesSearch =
      `${cmd.title || ''} ${cmd.command || ''} ${cmd.description || ''} ${(cmd.tags || []).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Terminal className="w-5 h-5 text-kc-accent" />
          <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">Essential Developer Commands</h1>
        </div>
        <p className="text-xs sm:text-sm text-kc-muted m-0">
          Frequently used Git, npm, Vite, and deployment commands with one-click copy.
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
            placeholder="Search commands, descriptions, or tags..."
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

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredCommands.length === 0 ? (
        <div className="kc-card p-12 text-center text-kc-muted text-sm">
          No commands found matching your query.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {filteredCommands.map((cmd) => (
            <CommandCard
              key={cmd.id}
              command={cmd}
              isFavorite={favorites.some((f) => f.id === cmd.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default CommandsPage;
