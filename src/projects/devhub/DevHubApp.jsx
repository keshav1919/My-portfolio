import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useSaved } from '../../context/SavedContext';
import { PageContainer } from '../../components/common/PageContainer';
import { SEO } from '../../components/common/SEO';
import { ToolCard } from '../../components/dashboard/ToolCard';
import { CommandCard } from '../../components/dashboard/CommandCard';
import { ShortcutRow } from '../../components/dashboard/ShortcutRow';
import { ResourceCard } from '../../components/dashboard/ResourceCard';
import { RoadmapViewer } from '../../components/dashboard/RoadmapViewer';
import {
  getTools,
  getCommands,
  getShortcuts,
  getResources,
  getRoadmap,
  getUserRoadmapProgress,
  toggleUserRoadmapStep,
} from '../../services/firestoreService';
import { CardSkeleton } from '../../components/ui/Skeleton';
import {
  Wrench,
  Terminal,
  Keyboard,
  Map,
  BookOpen,
  Bookmark,
  Search,
  X,
  Sparkles,
  ArrowUpRight,
  Layers,
  CheckCircle2,
  Code2,
  ExternalLink,
  Laptop,
  Command
} from 'lucide-react';

export default function DevHubApp() {
  const { user } = useAuth();
  const { isSaved, toggleSave, savedItems } = useSaved();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'tools' | 'commands' | 'shortcuts' | 'roadmaps' | 'resources' | 'saved'
  const [roadmapType, setRoadmapType] = useState('frontend'); // 'frontend' | 'javascript' | 'react'
  const [os, setOs] = useState('windows'); // 'windows' | 'mac'
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Content state
  const [tools, setTools] = useState([]);
  const [commands, setCommands] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [resources, setResources] = useState([]);
  const [roadmapSteps, setRoadmapSteps] = useState([]);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load all initial tool catalog content
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const [toolsData, commandsData, shortcutsData, resourcesData] = await Promise.all([
          getTools(),
          getCommands(),
          getShortcuts(),
          getResources(),
        ]);
        if (isMounted) {
          setTools(toolsData || []);
          setCommands(commandsData || []);
          setShortcuts(shortcutsData || []);
          setResources(resourcesData || []);
        }
      } catch (err) {
        console.warn('[DevHub] Data load error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => { isMounted = false; };
  }, []);

  // Load roadmap steps when tab or roadmapType changes
  useEffect(() => {
    let isMounted = true;
    async function loadRoadmap() {
      try {
        const [steps, progress] = await Promise.all([
          getRoadmap(roadmapType),
          user ? getUserRoadmapProgress(user.uid, roadmapType) : Promise.resolve([]),
        ]);
        if (isMounted) {
          setRoadmapSteps(steps || []);
          setCompletedSteps(progress || []);
        }
      } catch (err) {
        console.warn('[DevHub] Roadmap load error:', err);
      }
    }
    if (activeTab === 'roadmaps' || activeTab === 'overview') {
      loadRoadmap();
    }
    return () => { isMounted = false; };
  }, [roadmapType, activeTab, user]);

  const handleToggleRoadmapStep = async (stepId) => {
    if (!user) return;
    try {
      const updated = await toggleUserRoadmapStep(user.uid, roadmapType, stepId);
      setCompletedSteps(updated);
    } catch (err) {
      console.warn('[DevHub] toggle roadmap error:', err);
    }
  };

  // Filtered tools
  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tools.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [tools, selectedCategory, search]);

  // Filtered commands
  const filteredCommands = useMemo(() => {
    const q = search.trim().toLowerCase();
    return commands.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = !q ||
        item.title?.toLowerCase().includes(q) ||
        item.command?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [commands, selectedCategory, search]);

  // Filtered shortcuts
  const filteredShortcuts = useMemo(() => {
    const q = search.trim().toLowerCase();
    return shortcuts.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = !q ||
        item.title?.toLowerCase().includes(q) ||
        item.category?.toLowerCase().includes(q) ||
        (item.keys && Object.values(item.keys).join(' ').toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [shortcuts, selectedCategory, search]);

  // Filtered resources
  const filteredResources = useMemo(() => {
    const q = search.trim().toLowerCase();
    return resources.filter((item) => {
      const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesSearch = !q ||
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [resources, selectedCategory, search]);

  const toolCategories = useMemo(() => ['All', ...new Set(tools.map((t) => t.category).filter(Boolean))], [tools]);
  const commandCategories = useMemo(() => ['All', ...new Set(commands.map((c) => c.category).filter(Boolean))], [commands]);
  const resourceCategories = useMemo(() => ['All', ...new Set(resources.map((r) => r.category).filter(Boolean))], [resources]);

  return (
    <PageContainer className="inner-page devhub-app py-8">
      <SEO
        title="DevHub — All-In-One Developer Utility Workspace"
        description="Comprehensive developer toolbox featuring web utilities, terminal cheat sheets, VS Code shortcuts, interactive roadmaps, and curated resources."
        path="/projects/devhub"
      />

      {/* ─── Breadcrumb ─── */}
      <nav aria-label="Breadcrumb" className="pb-4 text-xs font-semibold text-kc-muted flex items-center gap-2">
        <Link to="/home" className="hover:text-kc-text transition-colors">Home</Link>
        <span>/</span>
        <Link to="/projects" className="hover:text-kc-text transition-colors">Projects</Link>
        <span>/</span>
        <span className="text-kc-accent truncate">DevHub</span>
      </nav>

      {/* ─── App Header Banner ─── */}
      <div className="p-6 sm:p-8 rounded-3xl border border-kc-border bg-gradient-to-br from-kc-surface via-kc-surface to-kc-surface-2 mb-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-kc-accent/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-kc-accent/15 text-kc-accent border border-kc-accent/30 uppercase tracking-wider">
                Unified Workspace
              </span>
              <span className="text-xs text-kc-muted font-mono">v2.0</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-kc-text tracking-tight m-0">
              DevHub <span className="text-kc-accent">&middot;</span> Developer Tools
            </h1>
            <p className="text-xs sm:text-sm text-kc-muted mt-2 max-w-2xl leading-relaxed m-0">
              Your centralized productivity suite featuring web utilities, terminal commands, shortcuts, roadmaps, and developer documentation in one place.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-2xl bg-kc-surface border border-kc-border text-center">
              <span className="block text-base font-extrabold text-kc-accent font-mono">{tools.length}+</span>
              <span className="text-[10px] font-bold text-kc-muted uppercase">Tools</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-kc-surface border border-kc-border text-center">
              <span className="block text-base font-extrabold text-kc-accent font-mono">{commands.length}+</span>
              <span className="text-[10px] font-bold text-kc-muted uppercase">Commands</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-kc-surface border border-kc-border text-center">
              <span className="block text-base font-extrabold text-kc-accent font-mono">{shortcuts.length}+</span>
              <span className="text-[10px] font-bold text-kc-muted uppercase">Shortcuts</span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Navigation Tabs ─── */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-3 mb-6 border-b border-kc-border scrollbar-none">
        {[
          { id: 'overview', label: 'Overview', icon: Layers },
          { id: 'tools', label: 'Web Tools', icon: Wrench, count: tools.length },
          { id: 'commands', label: 'Commands', icon: Terminal, count: commands.length },
          { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard, count: shortcuts.length },
          { id: 'roadmaps', label: 'Roadmaps', icon: Map },
          { id: 'resources', label: 'Resources', icon: BookOpen, count: resources.length },
          { id: 'saved', label: 'Saved', icon: Bookmark, count: savedItems.length },
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => {
              setActiveTab(id);
              setSelectedCategory('All');
              setSearch('');
            }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
              activeTab === id
                ? 'bg-kc-accent-surface text-[#090909] border-kc-accent-surface shadow-sm'
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

      {/* ─── Search & Category Bar (for list views) ─── */}
      {activeTab !== 'roadmaps' && activeTab !== 'overview' && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-kc-muted pointer-events-none" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-9 rounded-xl bg-kc-surface border border-kc-border text-xs text-kc-text placeholder:text-kc-muted focus:border-kc-accent outline-none transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-kc-muted hover:text-kc-text"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* OS Switch for Shortcuts */}
          {activeTab === 'shortcuts' && (
            <div className="flex items-center gap-1 bg-kc-surface border border-kc-border p-1 rounded-xl">
              <button
                onClick={() => setOs('windows')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  os === 'windows' ? 'bg-kc-accent-surface text-[#090909]' : 'text-kc-muted hover:text-kc-text'
                }`}
              >
                Windows / Linux
              </button>
              <button
                onClick={() => setOs('mac')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  os === 'mac' ? 'bg-kc-accent-surface text-[#090909]' : 'text-kc-muted hover:text-kc-text'
                }`}
              >
                macOS
              </button>
            </div>
          )}

          {/* Categories */}
          {activeTab === 'tools' && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {toolCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat ? 'bg-kc-text text-kc-bg font-bold' : 'text-kc-muted hover:text-kc-text bg-kc-surface'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 1: OVERVIEW ─── */}
      {activeTab === 'overview' && (
        <div className="space-y-10 animate-fade-in">
          {/* Quick Launch Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-kc-accent" />
                <h2 className="text-base sm:text-lg font-bold text-kc-text m-0">Featured Developer Tools</h2>
              </div>
              <button
                onClick={() => setActiveTab('tools')}
                className="text-xs font-bold text-kc-accent hover:underline flex items-center gap-1"
              >
                View all ({tools.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {tools.slice(0, 6).map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isSaved(tool.id)}
                  onToggleFavorite={() => toggleSave({ ...tool, type: 'tool' })}
                />
              ))}
            </div>
          </div>

          {/* Quick Terminal Commands Preview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-kc-accent" />
                <h2 className="text-base sm:text-lg font-bold text-kc-text m-0">Essential CLI & Git Commands</h2>
              </div>
              <button
                onClick={() => setActiveTab('commands')}
                className="text-xs font-bold text-kc-accent hover:underline flex items-center gap-1"
              >
                View all ({commands.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {commands.slice(0, 3).map((cmd) => (
                <CommandCard
                  key={cmd.id}
                  command={cmd}
                  isFavorite={isSaved(cmd.id)}
                  onToggleFavorite={() => toggleSave({ ...cmd, type: 'command' })}
                />
              ))}
            </div>
          </div>

          {/* Interactive Roadmaps Teaser */}
          <div className="p-6 sm:p-8 rounded-2xl border border-kc-border bg-kc-surface flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-kc-accent font-bold text-xs uppercase tracking-wider">
                <Map className="w-4 h-4" />
                <span>Interactive Learning Paths</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-kc-text m-0">
                Frontend, JavaScript & React Roadmaps
              </h3>
              <p className="text-xs text-kc-muted m-0 max-w-xl">
                Step-by-step developer learning trajectories with interactive check-offs that sync with your account.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('roadmaps')}
              className="px-5 py-2.5 rounded-xl bg-kc-accent text-[#090909] font-bold text-xs hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
            >
              <span>Explore Roadmaps</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ─── TAB 2: WEB TOOLS ─── */}
      {activeTab === 'tools' && (
        <div className="animate-fade-in">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((n) => <CardSkeleton key={n} />)}
            </div>
          ) : filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  isFavorite={isSaved(tool.id)}
                  onToggleFavorite={() => toggleSave({ ...tool, type: 'tool' })}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-kc-muted text-xs">No tools matching your search.</div>
          )}
        </div>
      )}

      {/* ─── TAB 3: COMMANDS ─── */}
      {activeTab === 'commands' && (
        <div className="animate-fade-in">
          {filteredCommands.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCommands.map((cmd) => (
                <CommandCard
                  key={cmd.id}
                  command={cmd}
                  isFavorite={isSaved(cmd.id)}
                  onToggleFavorite={() => toggleSave({ ...cmd, type: 'command' })}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-kc-muted text-xs">No commands matching your search.</div>
          )}
        </div>
      )}

      {/* ─── TAB 4: SHORTCUTS ─── */}
      {activeTab === 'shortcuts' && (
        <div className="animate-fade-in space-y-3">
          {filteredShortcuts.length > 0 ? (
            filteredShortcuts.map((sc) => (
              <ShortcutRow
                key={sc.id}
                shortcut={sc}
                os={os}
                isFavorite={isSaved(sc.id)}
                onToggleFavorite={() => toggleSave({ ...sc, type: 'shortcut' })}
              />
            ))
          ) : (
            <div className="py-12 text-center text-kc-muted text-xs">No shortcuts matching your search.</div>
          )}
        </div>
      )}

      {/* ─── TAB 5: ROADMAPS ─── */}
      {activeTab === 'roadmaps' && (
        <div className="animate-fade-in space-y-6">
          {/* Roadmap Selector */}
          <div className="flex items-center gap-2 border-b border-kc-border pb-4">
            {[
              { id: 'frontend', label: 'Frontend Developer', desc: 'Core web foundations' },
              { id: 'javascript', label: 'JavaScript Mastery', desc: 'Modern ES6+ & DOM' },
              { id: 'react', label: 'React Ecosystem', desc: 'Hooks, state & architecture' },
            ].map((rm) => (
              <button
                key={rm.id}
                onClick={() => setRoadmapType(rm.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  roadmapType === rm.id
                    ? 'bg-kc-text text-kc-bg border-kc-text'
                    : 'bg-kc-surface border-kc-border text-kc-muted hover:text-kc-text'
                }`}
              >
                {rm.label}
              </button>
            ))}
          </div>

          <RoadmapViewer
            title={`${roadmapType === 'frontend' ? 'Frontend Developer' : roadmapType === 'javascript' ? 'JavaScript' : 'React.js'} Roadmap`}
            subtitle="Follow step-by-step milestones. Click items to check them off as completed."
            steps={roadmapSteps}
            completedIds={completedSteps}
            onToggleStep={handleToggleRoadmapStep}
          />
        </div>
      )}

      {/* ─── TAB 6: RESOURCES ─── */}
      {activeTab === 'resources' && (
        <div className="animate-fade-in">
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResources.map((res) => (
                <ResourceCard
                  key={res.id}
                  resource={res}
                  isFavorite={isSaved(res.id)}
                  onToggleFavorite={() => toggleSave({ ...res, type: 'resource' })}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-kc-muted text-xs">No resources matching your search.</div>
          )}
        </div>
      )}

      {/* ─── TAB 7: SAVED ─── */}
      {activeTab === 'saved' && (
        <div className="animate-fade-in">
          {savedItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedItems.map((fav) => {
                const item = fav.itemData || fav;
                const id = String(fav.id || '');
                if (id.startsWith('cmd-')) {
                  return (
                    <CommandCard
                      key={fav.id}
                      command={item}
                      isFavorite={true}
                      onToggleFavorite={() => toggleSave(item)}
                    />
                  );
                }
                if (id.startsWith('sc-')) {
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
                if (id.startsWith('res-')) {
                  return (
                    <ResourceCard
                      key={fav.id}
                      resource={item}
                      isFavorite={true}
                      onToggleFavorite={() => toggleSave(item)}
                    />
                  );
                }
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
            <div className="py-16 text-center max-w-sm mx-auto">
              <Bookmark className="w-8 h-8 opacity-40 mx-auto mb-3 text-kc-muted" />
              <h4 className="text-sm font-bold text-kc-text mb-1">No saved items yet</h4>
              <p className="text-xs text-kc-muted">Bookmark any tool, command, or shortcut above to access it quickly here.</p>
            </div>
          )}
        </div>
      )}
    </PageContainer>
  );
}
