import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getUserFavorites, toggleUserFavorite, removeUserFavorite } from '../services/firestoreService';

const SavedContext = createContext(null);

export function SavedProvider({ children }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchSaved = useCallback(async () => {
    if (!user) {
      setSavedItems([]);
      return;
    }
    setLoading(true);
    try {
      const items = await getUserFavorites(user.uid);
      setSavedItems(items || []);
    } catch (err) {
      console.warn('[SavedContext] Failed to load saved items:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  const isSaved = useCallback(
    (itemId) => {
      if (!itemId || !savedItems.length) return false;
      return savedItems.some((item) => item.id === itemId);
    },
    [savedItems]
  );

  const toggleSave = useCallback(
    async (item) => {
      if (!user) {
        toast.info('Please log in to save items to your account');
        return false;
      }
      if (!item || !item.id) return false;

      const currentlySaved = isSaved(item.id);
      const title = item.title || item.name || 'Item';

      // Optimistic update
      if (currentlySaved) {
        setSavedItems((prev) => prev.filter((i) => i.id !== item.id));
      } else {
        setSavedItems((prev) => [...prev, { id: item.id, itemData: item, type: item.type || 'item' }]);
      }

      try {
        const added = await toggleUserFavorite(user.uid, item);
        if (added) {
          toast.success(`Saved "${title}"`);
        } else {
          toast.info(`Removed "${title}" from saved`);
        }
        return added;
      } catch (err) {
        // Rollback optimistic update on error
        console.error('[SavedContext] toggleSave error:', err);
        toast.error('Failed to update saved item');
        fetchSaved();
        return currentlySaved;
      }
    },
    [user, isSaved, toast, fetchSaved]
  );

  const removeSave = useCallback(
    async (itemId, title = 'Item') => {
      if (!user || !itemId) return;
      setSavedItems((prev) => prev.filter((i) => i.id !== itemId));
      try {
        await removeUserFavorite(user.uid, itemId);
        toast.info(`Removed "${title}" from saved`);
      } catch (err) {
        console.error('[SavedContext] removeSave error:', err);
        fetchSaved();
      }
    },
    [user, toast, fetchSaved]
  );

  const value = useMemo(
    () => ({
      savedItems,
      loading,
      isSaved,
      toggleSave,
      removeSave,
      refreshSaved: fetchSaved,
    }),
    [savedItems, loading, isSaved, toggleSave, removeSave, fetchSaved]
  );

  return <SavedContext.Provider value={value}>{children}</SavedContext.Provider>;
}

export function useSaved() {
  const context = useContext(SavedContext);
  if (!context) {
    throw new Error('useSaved must be used within SavedProvider');
  }
  return context;
}
