import React, { useState, useEffect } from 'react';
import { AdminKeyGate } from '../admin/AdminKeyGate';

export function AdminRoute({ children }) {
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('kc_admin_unlocked') === 'true';
  });

  useEffect(() => {
    const handleStorage = () => {
      setIsUnlocked(sessionStorage.getItem('kc_admin_unlocked') === 'true');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!isUnlocked) {
    return <AdminKeyGate onUnlock={() => setIsUnlocked(true)} />;
  }

  return children;
}
export default AdminRoute;
