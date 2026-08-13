import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  updateLastLogin
} from '../services/firestoreService';

const AuthContext = createContext(null);
const ADMIN_EMAIL = 'keshav88474267@gmail.com';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingSignupState, setPendingSignupState] = useState(null);

  const fetchProfile = useCallback(async (uid, fallbackEmail = '') => {
    try {
      let data = await getUserProfile(uid);
      if (!data && uid) {
        // Auto initialize basic profile if not exists
        data = await createUserProfile(uid, { email: fallbackEmail, role: fallbackEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user' });
      }
      setProfile(data);
      return data;
    } catch (err) {
      console.warn('[AuthContext] Profile load error:', err.message);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchProfile(currentUser.uid, currentUser.email);
        updateLastLogin(currentUser.uid);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const login = useCallback(async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
    const userProfile = await fetchProfile(credential.user.uid, credential.user.email);
    updateLastLogin(credential.user.uid);
    return { user: credential.user, profile: userProfile };
  }, [fetchProfile]);

  const signup = useCallback(async (email, password, displayName, avatarId = 'avatar-01') => {
    const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }
    const newProfile = await createUserProfile(credential.user.uid, {
      name: displayName || 'Developer',
      email: email.trim(),
      avatarId,
    });
    setProfile(newProfile);
    return { user: credential.user, profile: newProfile };
  }, []);

  const logout = useCallback(async () => {
    await signOut(auth);
    setUser(null);
    setProfile(null);
  }, []);

  const updateProfileData = useCallback(async (updates) => {
    if (!user) throw new Error('No authenticated user');
    await updateUserProfile(user.uid, updates);
    setProfile((prev) => (prev ? { ...prev, ...updates } : updates));
  }, [user]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      return await fetchProfile(user.uid, user.email);
    }
    return null;
  }, [user, fetchProfile]);

  const isAdmin = useMemo(() => {
    if (!user) return false;
    if (profile?.role === 'admin') return true;
    if (user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()) return true;
    return false;
  }, [user, profile]);

  const isBlocked = useMemo(() => {
    return profile?.status === 'blocked';
  }, [profile]);

  const value = useMemo(() => ({
    user,
    profile,
    loading,
    isAdmin,
    isBlocked,
    login,
    signup,
    logout,
    updateProfileData,
    refreshProfile,
    pendingSignupState,
    setPendingSignupState,
  }), [
    user,
    profile,
    loading,
    isAdmin,
    isBlocked,
    login,
    signup,
    logout,
    updateProfileData,
    refreshProfile,
    pendingSignupState,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
