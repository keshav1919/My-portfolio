import React, { useState } from 'react';
import { KeyRound, ArrowRight, Lock, Sparkles, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Default Admin Master Key
export const DEFAULT_ADMIN_KEY = 'KESHAV-ADMIN-9X82-W7Q4';

export function AdminKeyGate({ onUnlock }) {
  const { toast } = useToast();
  const [adminKey, setAdminKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const targetKey = (import.meta.env.VITE_ADMIN_KEY || DEFAULT_ADMIN_KEY).trim();

  const handleKeyChange = (e) => {
    setAdminKey(e.target.value);
    if (error) setError('');
  };

  const handleUnlock = (e) => {
    e.preventDefault();
    setError('');

    const inputKey = adminKey.trim();

    if (!inputKey) {
      setError('Please enter the Admin Master Security Key');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (inputKey === targetKey) {
        sessionStorage.setItem('kc_admin_unlocked', 'true');
        sessionStorage.setItem('kc_admin_key_session', Date.now().toString());
        toast.success('Admin Platform Unlocked');
        if (onUnlock) onUnlock();
      } else {
        setError('Invalid Admin Key. Access denied.');
        toast.error('Invalid Admin Key');
      }
      setLoading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#0a0914] text-[#ecebf7] flex items-center justify-center p-4 relative overflow-hidden selection:bg-[#673de6] selection:text-white">
      {/* Hostinger/AI Ambient Purple Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#673de6]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-[#8054fa]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        {/* Terminal Card */}
        <div className="bg-[#121124]/90 backdrop-blur-xl border border-[#2b2754] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-[#000000]/60">
          
          {/* Header Icon */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#673de6]/30 to-[#8054fa]/10 border border-[#673de6]/40 text-[#a382ff] flex items-center justify-center mb-4 shadow-lg shadow-[#673de6]/20">
              <KeyRound className="w-8 h-8 animate-pulse" />
            </div>
            
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
                Admin Security Terminal
              </h1>
              <Sparkles className="w-4 h-4 text-[#a382ff]" />
            </div>
            <p className="text-xs text-[#9593b4] mt-1.5 m-0 max-w-xs">
              Enter your master security key to unlock administrative access.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs flex items-center gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Key Form */}
          <form onSubmit={handleUnlock} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#9593b4]">
                  Master Security Key
                </label>
                {adminKey.length > 0 && (
                  <span className="text-[10px] font-mono text-[#a382ff]">
                    {adminKey.length} chars
                  </span>
                )}
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-[#727093] pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  placeholder="Enter admin master key..."
                  value={adminKey}
                  onChange={handleKeyChange}
                  autoFocus
                  spellCheck="false"
                  autoComplete="off"
                  className="w-full h-12 pl-10 pr-4 bg-[#0a0914] border border-[#2b2754] focus:border-[#8054fa] rounded-xl text-white font-mono text-center tracking-[0.15em] text-sm sm:text-base outline-none shadow-inner transition-all placeholder:text-[#3d3a66] placeholder:tracking-normal"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || adminKey.length === 0}
              className="w-full h-12 rounded-xl bg-gradient-to-r from-[#673de6] to-[#8054fa] hover:from-[#7347f5] hover:to-[#8e65ff] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#673de6]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <span>Verifying Security Key...</span>
              ) : (
                <>
                  <span>Unlock Admin Platform</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice Footer */}
          <div className="mt-6 pt-4 border-t border-[#232042] text-center">
            <p className="text-[11px] text-[#6d6b8c] m-0">
              Restricted Area &middot; Authorized Personnel Only
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminKeyGate;
