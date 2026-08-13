import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ResourceCard } from '../../components/dashboard/ResourceCard';
import { getResources, getUserFavorites, toggleUserFavorite } from '../../services/firestoreService';
import { BookOpen, Search } from 'lucide-react';
import { CardSkeleton } from '../../components/ui/Skeleton';

export function ResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [resources, setResources] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [resData, favs] = await Promise.all([
          getResources(),
          user ? getUserFavorites(user.uid) : Promise.resolve([]),
        ]);
        if (isMounted) {
          setResources(resData);
          setFavorites(favs);
        }
      } catch (err) {
        console.warn('[ResourcesPage error]', err);
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
      const added = await toggleUserFavorite(user.uid, { ...item, type: 'resource' });
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

  const categories = ['All', ...new Set(resources.map((r) => r.category).filter(Boolean))];

  const filtered = resources.filter((res) => {
    const matchesCat = selectedCategory === 'All' || res.category === selectedCategory;
    const matchesSearch =
      `${res.title || res.name || ''} ${res.description || ''} ${(res.tags || []).join(' ')}`
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-5 h-5 text-kc-accent" />
          <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">Curated Learning Resources</h1>
        </div>
        <p className="text-xs sm:text-sm text-kc-muted m-0">
          Official documentation, interactive guides, UI challenges, and performance learning materials.
        </p>
      </div>

      {/* Search & Categories */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search */}
        <div className="kc-input-wrapper flex-1 max-w-md">
          <span className="kc-input-icon-left">
            <Search />
          </span>
          <input
            type="text"
            placeholder="Search docs, tutorials, official guides..."
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : filtered.length === 0 ? (
        <div className="kc-card p-12 text-center text-kc-muted text-sm">
          No resources found matching your filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isFavorite={favorites.some((f) => f.id === resource.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default ResourcesPage;
