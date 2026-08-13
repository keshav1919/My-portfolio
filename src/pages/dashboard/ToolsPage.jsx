import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ToolCard } from '../../components/dashboard/ToolCard';
import { getTools, getUserFavorites, toggleUserFavorite } from '../../services/firestoreService';
import { Wrench, Search, Filter } from 'lucide-react';
import { CardSkeleton } from '../../components/ui/Skeleton';

export function ToolsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [tools, setTools] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [toolsData, favs] = await Promise.all([
          getTools(),
          user ? getUserFavorites(user.uid) : Promise.resolve([]),
        ]);
        if (isMounted) {
          setTools(toolsData);
          setFavorites(favs);
        }
      } catch (err) {
        console.warn('[ToolsPage error]', err);
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
      const added = await toggleUserFavorite(user.uid, { ...item, type: 'tool' });
      if (added) {
        setFavorites((prev) => [...prev, { id: item.id, itemData: item }]);
        toast.success(`Saved "${item.title || item.name}" to favorites`);
      } else {
        setFavorites((prev) => prev.filter((f) => f.id !== item.id));
        toast.info(`Removed from favorites`);
      }
    } catch {
      toast.error('Failed to update favorite');
    }
  };

  const categories = ['All', ...new Set(tools.map((t) => t.category).filter(Boolean))];

  const filteredTools = tools.filter((tool) => {
    const matchesCat = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      `${tool.title || tool.name || ''} ${tool.description || ''} ${(tool.tags || []).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Wrench className="w-5 h-5 text-kc-accent" />
          <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">Developer Tools Directory</h1>
        </div>
        <p className="text-xs sm:text-sm text-kc-muted m-0">
          Hand-picked modern frontend tools, performance analyzers, SVG optimizers, and color utilities.
        </p>
      </div>

      {/* Controls & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="kc-input-wrapper flex-1 max-w-md">
          <span className="kc-input-icon-left">
            <Search />
          </span>
          <input
            type="text"
            placeholder="Filter tools by name, description, or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="kc-input has-left-icon text-xs sm:text-sm h-10"
          />
        </div>

        {/* Category Pills */}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filteredTools.length === 0 ? (
        <div className="kc-card p-12 text-center text-kc-muted text-sm">
          No tools found matching your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={favorites.some((f) => f.id === tool.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default ToolsPage;
