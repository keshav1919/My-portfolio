import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Avatar } from '../../components/ui/Avatar';
import { ToolCard } from '../../components/dashboard/ToolCard';
import { CommandCard } from '../../components/dashboard/CommandCard';
import { ShortcutRow } from '../../components/dashboard/ShortcutRow';
import {
  getTools,
  getCommands,
  getShortcuts,
  getUserRoadmapProgress,
  getUserFavorites,
  toggleUserFavorite
} from '../../services/firestoreService';
import {
  Map,
  Wrench,
  Terminal,
  Keyboard,
  ArrowRight,
  Sparkles,
  Bookmark
} from 'lucide-react';

export function DashboardOverview() {
  const { user, profile } = useAuth();
  const { toast } = useToast();

  const [tools, setTools] = useState([]);
  const [commands, setCommands] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [roadmapProgress, setRoadmapProgress] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const displayName = profile?.name || user?.displayName || 'Developer';

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [toolsData, cmdsData, scData, progress, favs] = await Promise.all([
          getTools(),
          getCommands(),
          getShortcuts(),
          user ? getUserRoadmapProgress(user.uid, 'frontend') : Promise.resolve([]),
          user ? getUserFavorites(user.uid) : Promise.resolve([]),
        ]);
        if (isMounted) {
          setTools(toolsData);
          setCommands(cmdsData);
          setShortcuts(scData);
          setRoadmapProgress(progress);
          setFavorites(favs);
        }
      } catch (err) {
        console.warn('[DashboardOverview error]', err);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, [user]);

  const handleToggleFavorite = async (item) => {
    if (!user) return;
    try {
      const added = await toggleUserFavorite(user.uid, item);
      if (added) {
        setFavorites((prev) => [...prev, { id: item.id, itemData: item }]);
        toast.success(`Added "${item.title || item.name}" to favorites`);
      } else {
        setFavorites((prev) => prev.filter((f) => f.id !== item.id));
        toast.info(`Removed from favorites`);
      }
    } catch {
      toast.error('Could not update favorite');
    }
  };

  const isFavorite = (id) => favorites.some((f) => f.id === id);

  const totalRoadmapPhases = 21;
  const fePercent = Math.round((roadmapProgress.length / totalRoadmapPhases) * 100);

  return (
    <div className="space-y-8 sm:space-y-10 animate-fade-in pb-16">
      {/* 1. Welcoming Hero Banner */}
      <div className="kc-card p-6 sm:p-9 bg-gradient-to-br from-kc-surface via-kc-surface to-kc-surface-2 border border-kc-border relative overflow-hidden shadow-kc-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Avatar avatarId={profile?.avatarId || 'avatar-01'} size={68} className="ring-2 ring-kc-accent/30 shadow-lg shrink-0" />
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-kc-text m-0 tracking-tight">
                  {getGreeting()}, {displayName}!
                </h1>
                <Sparkles className="w-6 h-6 text-kc-accent shrink-0" />
              </div>
              <p className="text-sm sm:text-base text-kc-muted mt-1.5 m-0 max-w-2xl leading-relaxed">
                Welcome to your developer control center. Explore roadmaps, copy CLI snippets, and use production-ready tools.
              </p>
            </div>
          </div>

          <Link
            to="/dashboard/roadmap"
            className="kc-btn-primary text-sm sm:text-base h-12 px-7 shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 shadow-lg shadow-kc-accent/25"
          >
            <span>Resume Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2. Four Prominent Quick-Access Hub Cards (Hostinger AI Workspace Style) */}
      <div>
        <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-kc-muted mb-4">
          Quick Access Hub
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          {/* Card 1: Roadmaps */}
          <Link
            to="/dashboard/roadmap"
            className="kc-card p-6 hover:border-kc-accent/40 hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between shadow-sm hover:shadow-kc-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-kc-accent/15 border border-kc-accent/30 text-kc-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Map className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-kc-text text-lg m-0 mb-1.5 tracking-tight">Learning Roadmaps</h3>
              <p className="text-xs sm:text-sm text-kc-muted m-0 leading-relaxed">
                Step-by-step Frontend, JavaScript & React skill paths.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-kc-border/70 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-kc-accent">{fePercent}% Complete</span>
              <ArrowRight className="w-4 h-4 text-kc-muted group-hover:text-kc-accent group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Card 2: Developer Tools */}
          <Link
            to="/dashboard/tools"
            className="kc-card p-6 hover:border-kc-accent/40 hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between shadow-sm hover:shadow-kc-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-kc-text text-lg m-0 mb-1.5 tracking-tight">Developer Tools</h3>
              <p className="text-xs sm:text-sm text-kc-muted m-0 leading-relaxed">
                Generators, formatters, and modern UI design utilities.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-kc-border/70 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-kc-muted">{tools.length || '10+'} Tools</span>
              <ArrowRight className="w-4 h-4 text-kc-muted group-hover:text-kc-accent group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Card 3: Essential Commands */}
          <Link
            to="/dashboard/commands"
            className="kc-card p-6 hover:border-kc-accent/40 hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between shadow-sm hover:shadow-kc-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-kc-text text-lg m-0 mb-1.5 tracking-tight">Commands & CLI</h3>
              <p className="text-xs sm:text-sm text-kc-muted m-0 leading-relaxed">
                1-click copy terminal snippets for Git, npm, and Docker.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-kc-border/70 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-kc-muted">{commands.length || '12+'} Snippets</span>
              <ArrowRight className="w-4 h-4 text-kc-muted group-hover:text-kc-accent group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

          {/* Card 4: Bookmarks & Favorites */}
          <Link
            to="/dashboard/favorites"
            className="kc-card p-6 hover:border-kc-accent/40 hover:-translate-y-1.5 transition-all duration-200 group flex flex-col justify-between shadow-sm hover:shadow-kc-md"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Bookmark className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-kc-text text-lg m-0 mb-1.5 tracking-tight">Saved Favorites</h3>
              <p className="text-xs sm:text-sm text-kc-muted m-0 leading-relaxed">
                Your bookmarked tools, terminal commands, and shortcuts.
              </p>
            </div>
            <div className="mt-5 pt-3.5 border-t border-kc-border/70 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-bold text-kc-accent">{favorites.length} Saved</span>
              <ArrowRight className="w-4 h-4 text-kc-muted group-hover:text-kc-accent group-hover:translate-x-1 transition-all" />
            </div>
          </Link>

        </div>
      </div>

      {/* 3. Featured Tools (Clean 3 Cards) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Wrench className="w-5 h-5 text-kc-accent" />
            <h2 className="text-lg sm:text-xl font-bold text-kc-text m-0">Recommended Tools</h2>
          </div>
          <Link to="/dashboard/tools" className="text-xs sm:text-sm font-bold text-kc-accent hover:underline flex items-center gap-1">
            <span>View All Tools</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.slice(0, 3).map((tool) => (
            <ToolCard
              key={tool.id}
              tool={tool}
              isFavorite={isFavorite(tool.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 4. Essential Commands (Clean 2 Snippets) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-kc-accent" />
            <h2 className="text-lg sm:text-xl font-bold text-kc-text m-0">Essential CLI Commands</h2>
          </div>
          <Link to="/dashboard/commands" className="text-xs sm:text-sm font-bold text-kc-accent hover:underline flex items-center gap-1">
            <span>All Commands</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {commands.slice(0, 2).map((cmd) => (
            <CommandCard
              key={cmd.id}
              command={cmd}
              isFavorite={isFavorite(cmd.id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      </section>

      {/* 5. VS Code Shortcut of the Day */}
      {shortcuts.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Keyboard className="w-5 h-5 text-kc-accent" />
              <h2 className="text-lg sm:text-xl font-bold text-kc-text m-0">VS Code Shortcut of the Day</h2>
            </div>
            <Link to="/dashboard/shortcuts" className="text-xs sm:text-sm font-bold text-kc-accent hover:underline flex items-center gap-1">
              <span>All Shortcuts</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <ShortcutRow
            shortcut={shortcuts[0]}
            isFavorite={isFavorite(shortcuts[0].id)}
            onToggleFavorite={handleToggleFavorite}
          />
        </section>
      )}
    </div>
  );
}
export default DashboardOverview;
