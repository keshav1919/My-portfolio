import React, { useState, useEffect } from 'react';
import { getAdminLogs } from '../../services/firestoreService';
import { Activity, Clock, Shield, Search } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminActivityPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminLogs(50);
        setLogs(data);
      } catch (err) {
        console.warn('[AdminActivityPage load]', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Recent';
    if (timestamp.toDate) return timestamp.toDate().toLocaleString();
    return new Date(timestamp).toLocaleString();
  };

  const filteredLogs = logs.filter((l) =>
    `${l.action || ''} ${l.description || ''} ${l.targetType || ''}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-kc-accent" />
          <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">Admin Activity Audit Logs</h1>
        </div>
        <p className="text-xs sm:text-sm text-kc-muted m-0">
          Chronological record of administrative operations, privilege adjustments, and database updates.
        </p>
      </div>

      <div className="kc-input-wrapper max-w-md">
        <span className="kc-input-icon-left">
          <Search />
        </span>
        <input
          type="text"
          placeholder="Filter activity logs by action, description, target..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="kc-input has-left-icon text-xs sm:text-sm h-10"
        />
      </div>

      <div className="kc-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-kc-muted text-sm">
            No activity logs recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-kc-border/60">
            {filteredLogs.map((log) => (
              <div key={log.id} className="p-4 sm:p-5 hover:bg-kc-surface-2/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-kc-accent/10 border border-kc-accent/20 text-kc-accent flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    <Shield className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-kc-text">{log.action}</span>
                      {log.targetType && (
                        <span className="px-2 py-0.5 rounded bg-kc-surface-2 border border-kc-border text-[10px] text-kc-muted uppercase font-semibold">
                          {log.targetType}
                        </span>
                      )}
                    </div>
                    <p className="text-kc-muted m-0 mt-0.5 leading-relaxed">
                      {log.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-kc-muted text-[11px] shrink-0 self-end sm:self-auto">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatDate(log.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
export default AdminActivityPage;
