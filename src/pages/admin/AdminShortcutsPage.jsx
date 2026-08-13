import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ContentModal } from '../../components/admin/ContentModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  getShortcuts,
  createContentItem,
  updateContentItem,
  deleteContentItem,
  logAdminAction
} from '../../services/firestoreService';
import { Keyboard, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminShortcutsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [shortcuts, setShortcuts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      const data = await getShortcuts();
      setShortcuts(data);
    } catch (err) {
      console.warn('[AdminShortcutsPage load]', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (formData) => {
    setActionLoading(true);
    try {
      if (editingItem?.id) {
        await updateContentItem('shortcuts', editingItem.id, formData);
        await logAdminAction(user?.uid || 'admin', 'EDIT_SHORTCUT', `Updated shortcut: ${formData.title}`, 'shortcut', editingItem.id);
        toast.success('Shortcut updated successfully');
      } else {
        await createContentItem('shortcuts', formData);
        await logAdminAction(user?.uid || 'admin', 'CREATE_SHORTCUT', `Created shortcut: ${formData.title}`, 'shortcut');
        toast.success('Shortcut created successfully');
      }
      setModalOpen(false);
      setEditingItem(null);
      await loadData();
    } catch {
      toast.error('Failed to save shortcut');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setActionLoading(true);
    try {
      await deleteContentItem('shortcuts', deletingItem.id);
      await logAdminAction(user?.uid || 'admin', 'DELETE_SHORTCUT', `Deleted shortcut: ${deletingItem.title}`, 'shortcut', deletingItem.id);
      toast.success('Shortcut deleted');
      setDeletingItem(null);
      await loadData();
    } catch {
      toast.error('Failed to delete shortcut');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = shortcuts.filter((s) => {
    const keysStr = Array.isArray(s.keys) ? s.keys.join(' ') : s.keys;
    return `${s.title || ''} ${keysStr} ${s.category || ''}`
      .toLowerCase()
      .includes(search.toLowerCase().trim());
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Keyboard className="w-5 h-5 text-kc-accent" />
            <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">VS Code Shortcuts Management</h1>
          </div>
          <p className="text-xs sm:text-sm text-kc-muted m-0">
            Maintain Windows keyboard shortcuts and productivity tips.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingItem(null);
            setModalOpen(true);
          }}
          className="kc-btn-primary text-xs h-10 px-4 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Shortcut</span>
        </button>
      </div>

      <div className="kc-input-wrapper max-w-md">
        <span className="kc-input-icon-left">
          <Search />
        </span>
        <input
          type="text"
          placeholder="Search shortcuts by title, key, or category..."
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
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-kc-muted text-sm">
            No shortcuts found.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-kc-border bg-kc-surface-2/60 text-kc-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Title & Description</th>
                  <th className="p-4">Key Combination</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kc-border/60">
                {filtered.map((sc) => (
                  <tr key={sc.id} className="hover:bg-kc-surface-2/40 transition-colors">
                    <td className="p-4">
                      <div className="min-w-0 max-w-xs">
                        <p className="font-bold text-kc-text truncate m-0">{sc.title}</p>
                        <p className="text-kc-muted line-clamp-1 m-0 mt-0.5">{sc.description}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1 flex-wrap">
                        {(Array.isArray(sc.keys) ? sc.keys : [sc.keys]).map((k, i) => (
                          <kbd key={i} className="px-2 py-0.5 text-xs font-mono font-bold bg-black/40 text-kc-accent border border-kc-border rounded">
                            {k}
                          </kbd>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-kc-surface-2 border border-kc-border text-kc-muted font-semibold text-[10px]">
                        {sc.category || 'General'}
                      </span>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(sc);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-kc-surface-2 text-kc-muted hover:text-kc-text border border-kc-border cursor-pointer"
                          title="Edit Shortcut"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(sc)}
                          className="p-1.5 rounded-lg bg-kc-danger/10 text-kc-danger border border-kc-danger/30 hover:bg-kc-danger/20 cursor-pointer"
                          title="Delete Shortcut"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ContentModal
        isOpen={modalOpen}
        type="shortcuts"
        initialData={editingItem}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        onSave={handleSave}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingItem)}
        title={`Delete Shortcut "${deletingItem?.title}"?`}
        message="Are you sure you want to delete this shortcut?"
        confirmText="Delete Shortcut"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
}
export default AdminShortcutsPage;
