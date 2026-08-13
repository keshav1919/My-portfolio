import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ContentModal } from '../../components/admin/ContentModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  getResources,
  createContentItem,
  updateContentItem,
  deleteContentItem,
  logAdminAction
} from '../../services/firestoreService';
import { BookOpen, Plus, Edit2, Trash2, Search, ExternalLink } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminResourcesPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deletingItem, setDeletingItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const loadData = async () => {
    try {
      const data = await getResources();
      setResources(data);
    } catch (err) {
      console.warn('[AdminResourcesPage load]', err);
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
        await updateContentItem('resources', editingItem.id, formData);
        await logAdminAction(user?.uid || 'admin', 'EDIT_RESOURCE', `Updated resource: ${formData.title}`, 'resource', editingItem.id);
        toast.success('Resource updated');
      } else {
        await createContentItem('resources', formData);
        await logAdminAction(user?.uid || 'admin', 'CREATE_RESOURCE', `Created resource: ${formData.title}`, 'resource');
        toast.success('Resource added');
      }
      setModalOpen(false);
      setEditingItem(null);
      await loadData();
    } catch {
      toast.error('Failed to save resource');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingItem) return;
    setActionLoading(true);
    try {
      await deleteContentItem('resources', deletingItem.id);
      await logAdminAction(user?.uid || 'admin', 'DELETE_RESOURCE', `Deleted resource: ${deletingItem.title}`, 'resource', deletingItem.id);
      toast.success('Resource deleted');
      setDeletingItem(null);
      await loadData();
    } catch {
      toast.error('Failed to delete resource');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = resources.filter((r) =>
    `${r.title || r.name || ''} ${r.category || ''} ${(r.tags || []).join(' ')}`
      .toLowerCase()
      .includes(search.toLowerCase().trim())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-kc-accent" />
            <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">Resources Management</h1>
          </div>
          <p className="text-xs sm:text-sm text-kc-muted m-0">
            Curate documentation, official guides, and external learning platforms.
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
          <span>Add New Resource</span>
        </button>
      </div>

      <div className="kc-input-wrapper max-w-md">
        <span className="kc-input-icon-left">
          <Search />
        </span>
        <input
          type="text"
          placeholder="Search resources by title, category, tags..."
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
            No resources found.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-kc-border bg-kc-surface-2/60 text-kc-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">Resource</th>
                  <th className="p-4">Category</th>
                  <th className="p-4 hidden sm:table-cell">Tags</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kc-border/60">
                {filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-kc-surface-2/40 transition-colors">
                    <td className="p-4">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-kc-text truncate">{res.title || res.name}</span>
                          {res.url && (
                            <a href={res.url} target="_blank" rel="noreferrer" className="text-kc-accent hover:underline">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                        <p className="text-kc-muted line-clamp-1 max-w-sm m-0 mt-0.5">{res.description}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-kc-surface-2 border border-kc-border text-kc-muted font-semibold text-[10px]">
                        {res.category || 'Docs'}
                      </span>
                    </td>

                    <td className="p-4 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(res.tags || []).slice(0, 2).map((tag) => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-kc-surface-2 text-kc-muted">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingItem(res);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-kc-surface-2 text-kc-muted hover:text-kc-text border border-kc-border cursor-pointer"
                          title="Edit Resource"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingItem(res)}
                          className="p-1.5 rounded-lg bg-kc-danger/10 text-kc-danger border border-kc-danger/30 hover:bg-kc-danger/20 cursor-pointer"
                          title="Delete Resource"
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
        type="resources"
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
        title={`Delete Resource "${deletingItem?.title}"?`}
        message="Are you sure you want to delete this resource?"
        confirmText="Delete Resource"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </div>
  );
}
export default AdminResourcesPage;
