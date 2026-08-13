import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { AdminStatCard } from '../../components/admin/AdminStatCard';
import { Avatar } from '../../components/ui/Avatar';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  getAllUsers,
  getTools,
  getCommands,
  getShortcuts,
  getResources,
  getAdminLogs,
  seedAllStarterContent
} from '../../services/firestoreService';
import {
  Users,
  UserCheck,
  ShieldAlert,
  Wrench,
  Terminal,
  Keyboard,
  BookOpen,
  Sparkles,
  Database,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminOverview() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [users, setUsers] = useState([]);
  const [tools, setTools] = useState([]);
  const [commands, setCommands] = useState([]);
  const [shortcuts, setShortcuts] = useState([]);
  const [resources, setResources] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showSeedModal, setShowSeedModal] = useState(false);

  const loadAll = async () => {
    try {
      const [u, t, c, s, r, l] = await Promise.all([
        getAllUsers(),
        getTools(),
        getCommands(),
        getShortcuts(),
        getResources(),
        getAdminLogs(10),
      ]);
      setUsers(u);
      setTools(t);
      setCommands(c);
      setShortcuts(s);
      setResources(r);
      setLogs(l);
    } catch (err) {
      console.warn('[AdminOverview load]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleSeedDatabase = async () => {
    setSeeding(true);
    try {
      await seedAllStarterContent(user?.uid || 'admin');
      toast.success('Successfully initialized Firestore with starter developer content');
      setShowSeedModal(false);
      await loadAll();
    } catch {
      toast.error('Failed to seed database');
    } finally {
      setSeeding(false);
    }
  };

  const activeUsers = users.filter((u) => u.status !== 'blocked').length;
  const blockedUsers = users.filter((u) => u.status === 'blocked').length;

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    if (timestamp.toDate) return timestamp.toDate().toLocaleDateString();
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Banner with Quick Seed Action */}
      <div className="kc-card p-6 bg-gradient-to-r from-kc-surface via-kc-surface to-kc-surface-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-kc-border">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-kc-accent" />
            <h1 className="text-xl sm:text-2xl font-extrabold text-kc-text m-0">Platform Overview</h1>
          </div>
          <p className="text-xs sm:text-sm text-kc-muted mt-1 m-0">
            Monitor real-time accounts, content inventories, and platform activity logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSeedModal(true)}
          disabled={seeding}
          className="kc-btn-secondary text-xs h-10 px-4 shrink-0 flex items-center gap-2 cursor-pointer border-kc-accent/40"
        >
          <Database className="w-4 h-4 text-kc-accent" />
          <span>{seeding ? 'Seeding...' : 'Seed Initial Database'}</span>
        </button>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <AdminStatCard
          title="Total Registered"
          value={loading ? '...' : users.length}
          subtitle="Total accounts in Firestore"
          icon={Users}
          color="accent"
        />
        <AdminStatCard
          title="Active Users"
          value={loading ? '...' : activeUsers}
          subtitle="Users with unrestricted access"
          icon={UserCheck}
          color="emerald"
        />
        <AdminStatCard
          title="Blocked Users"
          value={loading ? '...' : blockedUsers}
          subtitle="Restricted account status"
          icon={ShieldAlert}
          color="rose"
        />
        <AdminStatCard
          title="Content Inventory"
          value={loading ? '...' : tools.length + commands.length + shortcuts.length + resources.length}
          subtitle="Tools, commands & resources"
          icon={Wrench}
          color="amber"
        />
      </div>

      {/* Content Counts Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link to="/admin/tools" className="kc-card p-4 hover:border-kc-accent/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-kc-muted mb-1">
            <span>Tools</span>
            <Wrench className="w-3.5 h-3.5 text-kc-accent" />
          </div>
          <span className="text-xl font-bold text-kc-text">{tools.length}</span>
        </Link>

        <Link to="/admin/commands" className="kc-card p-4 hover:border-kc-accent/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-kc-muted mb-1">
            <span>Commands</span>
            <Terminal className="w-3.5 h-3.5 text-kc-accent" />
          </div>
          <span className="text-xl font-bold text-kc-text">{commands.length}</span>
        </Link>

        <Link to="/admin/shortcuts" className="kc-card p-4 hover:border-kc-accent/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-kc-muted mb-1">
            <span>Shortcuts</span>
            <Keyboard className="w-3.5 h-3.5 text-kc-accent" />
          </div>
          <span className="text-xl font-bold text-kc-text">{shortcuts.length}</span>
        </Link>

        <Link to="/admin/resources" className="kc-card p-4 hover:border-kc-accent/40 transition-colors">
          <div className="flex items-center justify-between text-xs text-kc-muted mb-1">
            <span>Resources</span>
            <BookOpen className="w-3.5 h-3.5 text-kc-accent" />
          </div>
          <span className="text-xl font-bold text-kc-text">{resources.length}</span>
        </Link>
      </div>

      {/* Recent Users and Activity Logs Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Users */}
        <div className="kc-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-kc-border mb-4">
              <h2 className="text-base font-bold text-kc-text m-0 flex items-center gap-2">
                <Users className="w-4 h-4 text-kc-accent" />
                <span>Recent Registrations</span>
              </h2>
              <Link to="/admin/users" className="text-xs font-semibold text-kc-accent hover:underline flex items-center gap-1">
                <span>View All ({users.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
              </div>
            ) : users.length === 0 ? (
              <p className="text-xs text-kc-muted py-6 text-center">No users registered yet.</p>
            ) : (
              <div className="space-y-3">
                {users.slice(0, 5).map((u) => (
                  <div key={u.uid} className="flex items-center justify-between p-3 rounded-xl bg-kc-surface-2/60 border border-kc-border">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar avatarId={u.avatarId || 'avatar-01'} size={36} />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-kc-text truncate m-0">{u.name || 'Developer'}</p>
                        <p className="text-[11px] text-kc-muted truncate m-0">{u.email}</p>
                      </div>
                    </div>
                    <span className="text-[11px] text-kc-muted shrink-0 ml-2">
                      {formatDate(u.createdAt)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div className="kc-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-kc-border mb-4">
              <h2 className="text-base font-bold text-kc-text m-0 flex items-center gap-2">
                <Clock className="w-4 h-4 text-kc-accent" />
                <span>Recent Admin Activity</span>
              </h2>
              <Link to="/admin/activity" className="text-xs font-semibold text-kc-accent hover:underline flex items-center gap-1">
                <span>All Logs</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {logs.length === 0 ? (
              <p className="text-xs text-kc-muted py-6 text-center">No admin actions logged yet.</p>
            ) : (
              <div className="space-y-3">
                {logs.slice(0, 5).map((l) => (
                  <div key={l.id} className="p-3 rounded-xl bg-kc-surface-2/60 border border-kc-border text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-kc-accent">{l.action}</span>
                      <span className="text-[10px] text-kc-muted">{formatDate(l.createdAt)}</span>
                    </div>
                    <p className="text-kc-text/90 m-0">{l.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal for Database Seeding */}
      <ConfirmDialog
        isOpen={showSeedModal}
        title="Initialize / Seed Firestore Database"
        message="This will write all default starter developer tools, commands, shortcuts, roadmaps, and resources into your live Firestore database collections. Are you sure you want to proceed?"
        confirmText="Yes, Seed Content"
        isDanger={false}
        loading={seeding}
        onConfirm={handleSeedDatabase}
        onCancel={() => setShowSeedModal(false)}
      />
    </div>
  );
}
export default AdminOverview;
