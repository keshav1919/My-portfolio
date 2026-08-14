import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import {
  STARTER_TOOLS,
  STARTER_COMMANDS,
  STARTER_SHORTCUTS,
  STARTER_ROADMAP_FRONTEND,
  STARTER_ROADMAP_JS,
  STARTER_ROADMAP_REACT,
  STARTER_RESOURCES
} from '../data/starterContent';

const ADMIN_EMAIL = 'keshav88474267@gmail.com';

/**
 * -------------------------------------------------------------
 * User Profile Operations
 * -------------------------------------------------------------
 */
export async function createUserProfile(uid, data) {
  const userRef = doc(db, 'users', uid);
  const isDefaultAdmin = data.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  const profileData = {
    uid,
    name: data.name || 'Developer',
    email: data.email?.toLowerCase().trim() || '',
    avatarId: data.avatarId || 'avatar-01',
    location: data.location || '',
    bio: data.bio || '',
    primaryRole: data.primaryRole || 'Frontend Developer',
    skills: data.skills || ['HTML', 'CSS', 'JavaScript', 'React', 'Tailwind CSS'],
    experience: data.experience || '1 Year',
    github: data.github || '',
    linkedin: data.linkedin || '',
    website: data.website || '',
    role: isDefaultAdmin ? 'admin' : (data.role || 'user'),
    status: 'active',
    termsAccepted: true,
    termsAcceptedAt: serverTimestamp(),
    emailVerifiedByOtp: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  };

  await setDoc(userRef, profileData, { merge: true });
  return profileData;
}

export async function getUserProfile(uid) {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
    return null;
  } catch (error) {
    console.error('[getUserProfile]', error);
    return null;
  }
}

export async function updateUserProfile(uid, updates) {
  const userRef = doc(db, 'users', uid);
  // Ensure sensitive system fields cannot be overwritten by client-level profile update
  const safeUpdates = { ...updates };
  delete safeUpdates.role;
  delete safeUpdates.status;
  delete safeUpdates.email;
  delete safeUpdates.uid;
  const data = {
    ...safeUpdates,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(userRef, data);
  return data;
}

export async function updateLastLogin(uid) {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, { lastLoginAt: serverTimestamp() });
  } catch (err) {
    console.warn('[updateLastLogin]', err.message);
  }
}

/**
 * -------------------------------------------------------------
 * User Favorites Subcollection: users/{uid}/favorites/{itemId}
 * -------------------------------------------------------------
 */
const cleanDataForFirestore = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  return JSON.parse(
    JSON.stringify(obj, (_, v) => (v === undefined ? null : v))
  );
};

export async function getUserFavorites(uid) {
  if (!uid) return [];
  const localKey = `kc_user_favorites_${uid}`;
  try {
    const favRef = collection(db, 'users', uid, 'favorites');
    const snap = await getDocs(favRef);
    const favorites = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      if (data && data.id) favorites.push(data);
    });
    // Cache valid remote data
    try {
      localStorage.setItem(localKey, JSON.stringify(favorites));
    } catch {}
    return favorites;
  } catch (error) {
    console.warn('[getUserFavorites] Firestore error, falling back to local user cache:', error.message);
    try {
      const cached = localStorage.getItem(localKey);
      return cached ? JSON.parse(cached) : [];
    } catch {
      return [];
    }
  }
}

export async function toggleUserFavorite(uid, item) {
  if (!uid || !item || !item.id) return false;
  const localKey = `kc_user_favorites_${uid}`;
  const docRef = doc(db, 'users', uid, 'favorites', item.id);
  const snap = await getDoc(docRef);

  if (snap.exists()) {
    await deleteDoc(docRef);
    // Update local cache
    try {
      const cached = JSON.parse(localStorage.getItem(localKey) || '[]');
      const updated = cached.filter((f) => f.id !== item.id);
      localStorage.setItem(localKey, JSON.stringify(updated));
    } catch {}
    return false; // Removed
  } else {
    const cleanItem = cleanDataForFirestore(item);
    const payload = {
      id: item.id,
      title: item.title || item.name || '',
      category: item.category || '',
      type: item.type || 'tool',
      itemData: cleanItem,
      savedAt: serverTimestamp(),
    };
    await setDoc(docRef, payload);
    // Update local cache
    try {
      const cached = JSON.parse(localStorage.getItem(localKey) || '[]');
      cached.push({ ...payload, savedAt: new Date().toISOString() });
      localStorage.setItem(localKey, JSON.stringify(cached));
    } catch {}
    return true; // Added
  }
}

export async function removeUserFavorite(uid, itemId) {
  if (!uid || !itemId) return false;
  const localKey = `kc_user_favorites_${uid}`;
  try {
    const docRef = doc(db, 'users', uid, 'favorites', itemId);
    await deleteDoc(docRef);
    try {
      const cached = JSON.parse(localStorage.getItem(localKey) || '[]');
      const updated = cached.filter((f) => f.id !== itemId);
      localStorage.setItem(localKey, JSON.stringify(updated));
    } catch {}
    return true;
  } catch (err) {
    console.warn('[removeUserFavorite]', err.message);
    return false;
  }
}

/**
 * -------------------------------------------------------------
 * User Roadmap Progress: users/{uid}/roadmapProgress/{roadmapId}
 * -------------------------------------------------------------
 */
export async function getUserRoadmapProgress(uid, roadmapId = 'frontend') {
  try {
    const docRef = doc(db, 'users', uid, 'roadmapProgress', roadmapId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data().completedStepIds || [];
    }
    return [];
  } catch (error) {
    console.warn('[getUserRoadmapProgress]', error.message);
    return [];
  }
}

export async function toggleUserRoadmapStep(uid, roadmapId = 'frontend', stepId) {
  if (!uid || !stepId) return [];
  const docRef = doc(db, 'users', uid, 'roadmapProgress', roadmapId);
  const snap = await getDoc(docRef);
  let completedStepIds = [];

  if (snap.exists()) {
    completedStepIds = snap.data().completedStepIds || [];
  }

  if (completedStepIds.includes(stepId)) {
    completedStepIds = completedStepIds.filter((id) => id !== stepId);
  } else {
    completedStepIds.push(stepId);
  }

  await setDoc(docRef, {
    roadmapId,
    completedStepIds,
    updatedAt: serverTimestamp(),
  }, { merge: true });

  return completedStepIds;
}

/**
 * -------------------------------------------------------------
 * Content Collections (Tools, Commands, Shortcuts, Resources)
 * -------------------------------------------------------------
 */
export async function getCollectionContent(collectionName, fallbackData = []) {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      const items = [];
      snap.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));
      return items;
    }
    return fallbackData;
  } catch (error) {
    console.warn(`[getCollectionContent:${collectionName}]`, error.message);
    return fallbackData;
  }
}

export async function getTools() {
  return getCollectionContent('tools', STARTER_TOOLS);
}

export async function getCommands() {
  return getCollectionContent('commands', STARTER_COMMANDS);
}

export async function getShortcuts() {
  return getCollectionContent('shortcuts', STARTER_SHORTCUTS);
}

export async function getResources() {
  return getCollectionContent('resources', STARTER_RESOURCES);
}

export async function getRoadmap(type = 'frontend') {
  if (type === 'javascript') {
    return getCollectionContent('roadmap_javascript', STARTER_ROADMAP_JS);
  }
  if (type === 'react') {
    return getCollectionContent('roadmap_react', STARTER_ROADMAP_REACT);
  }
  return getCollectionContent('roadmap_frontend', STARTER_ROADMAP_FRONTEND);
}

/**
 * Admin Content CRUD
 */
export async function createContentItem(collectionName, itemData) {
  const customId = itemData.id || `${collectionName}-${Date.now()}`;
  const docRef = doc(db, collectionName, customId);
  const payload = {
    ...itemData,
    id: customId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  await setDoc(docRef, payload);
  return payload;
}

export async function updateContentItem(collectionName, id, updates) {
  const docRef = doc(db, collectionName, id);
  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(docRef, payload);
  return payload;
}

export async function deleteContentItem(collectionName, id) {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
  return true;
}

/**
 * -------------------------------------------------------------
 * Admin User Management & Analytics
 * -------------------------------------------------------------
 */
export async function getAllUsers() {
  try {
    const usersRef = collection(db, 'users');
    const snap = await getDocs(usersRef);
    const users = [];
    snap.forEach((docSnap) => users.push(docSnap.data()));
    return users;
  } catch (error) {
    console.error('[getAllUsers]', error);
    return [];
  }
}

export async function setUserStatus(uid, status) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

export async function setUserRole(uid, role) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    role,
    updatedAt: serverTimestamp(),
  });
}

export async function logAdminAction(adminUid, action, description, targetType = '', targetId = '') {
  try {
    const logsRef = collection(db, 'adminLogs');
    const logDoc = doc(logsRef);
    await setDoc(logDoc, {
      adminUid,
      action,
      description,
      targetType,
      targetId,
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.warn('[logAdminAction]', err.message);
  }
}

export async function getAdminLogs(maxLimit = 50) {
  try {
    const logsRef = collection(db, 'adminLogs');
    const q = query(logsRef, orderBy('createdAt', 'desc'), limit(maxLimit));
    const snap = await getDocs(q);
    const logs = [];
    snap.forEach((docSnap) => logs.push({ id: docSnap.id, ...docSnap.data() }));
    return logs;
  } catch (error) {
    console.warn('[getAdminLogs]', error.message);
    return [];
  }
}

/**
 * One-click seed function for Admin initialization
 */
export async function seedAllStarterContent(adminUid = 'admin') {
  try {
    for (const tool of STARTER_TOOLS) {
      await setDoc(doc(db, 'tools', tool.id), { ...tool, createdAt: serverTimestamp() }, { merge: true });
    }
    for (const cmd of STARTER_COMMANDS) {
      await setDoc(doc(db, 'commands', cmd.id), { ...cmd, createdAt: serverTimestamp() }, { merge: true });
    }
    for (const sc of STARTER_SHORTCUTS) {
      await setDoc(doc(db, 'shortcuts', sc.id), { ...sc, createdAt: serverTimestamp() }, { merge: true });
    }
    for (const res of STARTER_RESOURCES) {
      await setDoc(doc(db, 'resources', res.id), { ...res, createdAt: serverTimestamp() }, { merge: true });
    }
    for (const fe of STARTER_ROADMAP_FRONTEND) {
      await setDoc(doc(db, 'roadmap_frontend', fe.id), { ...fe, createdAt: serverTimestamp() }, { merge: true });
    }
    for (const js of STARTER_ROADMAP_JS) {
      await setDoc(doc(db, 'roadmap_javascript', js.id), { ...js, createdAt: serverTimestamp() }, { merge: true });
    }
    for (const rc of STARTER_ROADMAP_REACT) {
      await setDoc(doc(db, 'roadmap_react', rc.id), { ...rc, createdAt: serverTimestamp() }, { merge: true });
    }
    await logAdminAction(adminUid, 'SEED_DATABASE', 'Initialized Firestore collections with starter developer content');
    return { success: true };
  } catch (error) {
    console.error('[seedAllStarterContent]', error);
    throw error;
  }
}
