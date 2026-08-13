import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setToast(null), 3000);
  }, []);

  const toastHelpers = useMemo(() => ({
    showToast,
    success: (msg) => showToast(msg, 'success'),
    error: (msg) => showToast(msg, 'error'),
    info: (msg) => showToast(msg, 'info'),
  }), [showToast]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const value = useMemo(() => ({
    showToast,
    toast: toastHelpers,
  }), [showToast, toastHelpers]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="status" aria-live="polite">
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
