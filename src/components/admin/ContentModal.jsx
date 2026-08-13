import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

export function ContentModal({
  isOpen,
  type = 'tools', // 'tools' | 'commands' | 'shortcuts' | 'resources' | 'roadmaps'
  initialData = null,
  onClose,
  onSave,
  loading = false,
}) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : (initialData.tags || ''),
        keys: Array.isArray(initialData.keys) ? initialData.keys.join(', ') : (initialData.keys || ''),
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: '',
        url: '',
        command: '',
        keys: '',
        tags: '',
        status: 'published',
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
    };
    if (type === 'shortcuts' && formData.keys) {
      payload.keys = formData.keys.split(',').map((k) => k.trim()).filter(Boolean);
    }
    onSave(payload);
  };

  const isEditing = Boolean(initialData?.id);
  const typeLabel = type.slice(0, -1); // 'tool', 'command', etc.

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="kc-card w-full max-w-lg p-6 bg-kc-surface shadow-kc-lg border-kc-border max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-kc-border">
          <h3 className="text-lg font-bold text-kc-text capitalize m-0">
            {isEditing ? `Edit ${typeLabel}` : `Add New ${typeLabel}`}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-kc-muted hover:text-kc-text p-1 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="py-4 space-y-4 text-xs">
          {/* Title / Name */}
          <div>
            <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-title">Title / Name</label>
            <input
              id="item-title"
              type="text"
              name="title"
              required
              placeholder="e.g. Can I Use or git commit"
              value={formData.title || ''}
              onChange={handleChange}
              className="kc-input text-xs h-10"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-desc">Description</label>
            <textarea
              id="item-desc"
              name="description"
              rows={3}
              required
              placeholder="Short summary of utility and purpose..."
              value={formData.description || ''}
              onChange={handleChange}
              className="kc-input text-xs h-auto py-2.5 resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-cat">Category</label>
            <input
              id="item-cat"
              type="text"
              name="category"
              placeholder="e.g. Design, Git, Editing, Docs"
              value={formData.category || ''}
              onChange={handleChange}
              className="kc-input text-xs h-10"
            />
          </div>

          {/* Type specific inputs */}
          {(type === 'tools' || type === 'resources') && (
            <div>
              <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-url">External URL</label>
              <input
                id="item-url"
                type="url"
                name="url"
                placeholder="https://..."
                value={formData.url || ''}
                onChange={handleChange}
                className="kc-input text-xs h-10"
              />
            </div>
          )}

          {type === 'commands' && (
            <div>
              <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-cmd">Command String</label>
              <input
                id="item-cmd"
                type="text"
                name="command"
                required
                placeholder="e.g. npm run build"
                value={formData.command || ''}
                onChange={handleChange}
                className="kc-input font-mono text-xs h-10"
              />
            </div>
          )}

          {type === 'shortcuts' && (
            <div>
              <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-keys">Keyboard Keys (comma separated)</label>
              <input
                id="item-keys"
                type="text"
                name="keys"
                required
                placeholder="e.g. Ctrl, Shift, P"
                value={formData.keys || ''}
                onChange={handleChange}
                className="kc-input font-mono text-xs h-10"
              />
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-tags">Tags (comma separated)</label>
            <input
              id="item-tags"
              type="text"
              name="tags"
              placeholder="e.g. React, CSS, Optimization"
              value={formData.tags || ''}
              onChange={handleChange}
              className="kc-input text-xs h-10"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block font-semibold text-kc-muted mb-1" htmlFor="item-status">Publish Status</label>
            <select
              id="item-status"
              name="status"
              value={formData.status || 'published'}
              onChange={handleChange}
              className="kc-input text-xs h-10 cursor-pointer"
            >
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </div>

          <div className="pt-4 border-t border-kc-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="kc-btn-secondary text-xs h-9 px-4 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="kc-btn-primary text-xs h-9 px-5 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : 'Save Item'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
