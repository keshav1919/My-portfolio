import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ContentModal } from '../../components/admin/ContentModal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import {
  getRoadmap,
  createContentItem,
  updateContentItem,
  deleteContentItem,
  logAdminAction
} from '../../services/firestoreService';
import { Map, Plus, Edit2, Trash2 } from 'lucide-react';
import { Skeleton } from '../../components/ui/Skeleton';

export function AdminRoadmapsPage() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [roadmapType, setRoadmapType] = useState('frontend'); // 'frontend' | 'javascript' | 'react'
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [deletingStep, setDeletingStep] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const getCollectionName = () => {
    if (roadmapType === 'javascript') return 'roadmap_javascript';
    if (roadmapType === 'react') return 'roadmap_react';
    return 'roadmap_frontend';
  };

  const loadSteps = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getRoadmap(roadmapType);
      setSteps(data);
    } catch (err) {
      console.warn('[AdminRoadmaps load]', err);
    } finally {
      setLoading(false);
    }
  }, [roadmapType]);

  useEffect(() => {
    loadSteps();
  }, [loadSteps]);

  const handleSave = async (formData) => {
    setActionLoading(true);
    const col = getCollectionName();
    try {
      if (editingStep?.id) {
        await updateContentItem(col, editingStep.id, formData);
        await logAdminAction(user?.uid || 'admin', 'EDIT_ROADMAP', `Updated ${roadmapType} roadmap step: ${formData.title}`, 'roadmap', editingStep.id);
        toast.success('Step updated');
      } else {
        await createContentItem(col, formData);
        await logAdminAction(user?.uid || 'admin', 'CREATE_ROADMAP', `Created ${roadmapType} roadmap step: ${formData.title}`, 'roadmap');
        toast.success('Step added');
      }
      setModalOpen(false);
      setEditingStep(null);
      await loadSteps();
    } catch {
      toast.error('Failed to save step');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingStep) return;
    setActionLoading(true);
    const col = getCollectionName();
    try {
      await deleteContentItem(col, deletingStep.id);
      await logAdminAction(user?.uid || 'admin', 'DELETE_ROADMAP', `Deleted step: ${deletingStep.title}`, 'roadmap', deletingStep.id);
      toast.success('Step deleted');
      setDeletingStep(null);
      await loadSteps();
    } catch {
      toast.error('Failed to delete step');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Map className="w-5 h-5 text-kc-accent" />
            <h1 className="text-xl sm:text-2xl font-bold text-kc-text m-0">Roadmaps Management</h1>
          </div>
          <p className="text-xs sm:text-sm text-kc-muted m-0">
            Organize phases, topics, and checkpoints across Frontend, JavaScript, and React learning roadmaps.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingStep(null);
            setModalOpen(true);
          }}
          className="kc-btn-primary text-xs h-10 px-4 shrink-0 flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Roadmap Phase</span>
        </button>
      </div>

      {/* Roadmap Type Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-kc-border pb-2">
        {[
          { id: 'frontend', label: 'Frontend Roadmap' },
          { id: 'javascript', label: 'JavaScript Roadmap' },
          { id: 'react', label: 'React Roadmap' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setRoadmapType(tab.id)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              roadmapType === tab.id
                ? 'bg-kc-accent text-[#090909] font-bold shadow-sm'
                : 'text-kc-muted hover:text-kc-text hover:bg-kc-surface-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="kc-card overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : steps.length === 0 ? (
          <div className="p-12 text-center text-kc-muted text-sm">
            No roadmap steps found in this track.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-kc-border bg-kc-surface-2/60 text-kc-muted uppercase font-bold text-[10px] tracking-wider">
                  <th className="p-4">#</th>
                  <th className="p-4">Phase / Concept</th>
                  <th className="p-4">Description</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-kc-border/60">
                {steps.map((step, idx) => (
                  <tr key={step.id} className="hover:bg-kc-surface-2/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-kc-accent">
                      {idx + 1}
                    </td>

                    <td className="p-4 font-bold text-kc-text min-w-[200px]">
                      {step.title}
                    </td>

                    <td className="p-4 text-kc-muted line-clamp-2 max-w-md">
                      {step.description}
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStep(step);
                            setModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg bg-kc-surface-2 text-kc-muted hover:text-kc-text border border-kc-border cursor-pointer"
                          title="Edit Step"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingStep(step)}
                          className="p-1.5 rounded-lg bg-kc-danger/10 text-kc-danger border border-kc-danger/30 hover:bg-kc-danger/20 cursor-pointer"
                          title="Delete Step"
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
        type="roadmaps"
        initialData={editingStep}
        onClose={() => {
          setModalOpen(false);
          setEditingStep(null);
        }}
        onSave={handleSave}
        loading={actionLoading}
      />

      <ConfirmDialog
        isOpen={Boolean(deletingStep)}
        title={`Delete Roadmap Step "${deletingStep?.title}"?`}
        message="Are you sure you want to delete this roadmap step?"
        confirmText="Delete Step"
        isDanger={true}
        loading={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setDeletingStep(null)}
      />
    </div>
  );
}
export default AdminRoadmapsPage;
