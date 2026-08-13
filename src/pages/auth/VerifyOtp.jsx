import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OTPInput } from '../../components/auth/OTPInput';
import { SuccessAnimation } from '../../components/auth/SuccessAnimation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { verifySignupOtp, sendSignupOtp } from '../../services/authService';
import { RefreshCw, ArrowLeft } from 'lucide-react';

export function VerifyOtp() {
  const navigate = useNavigate();
  const { pendingSignupState, setPendingSignupState, signup } = useAuth();
  const { toast } = useToast();

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // Only redirect if not already marked successful and state is missing
    if (!isSuccess && (!pendingSignupState?.email || !pendingSignupState?.challengeToken)) {
      navigate('/signup', { replace: true });
    }
  }, [pendingSignupState, isSuccess, navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const maskEmail = (email = '') => {
    if (!email.includes('@')) return email;
    const [local, domain] = email.split('@');
    if (local.length <= 2) return `${local[0]}***@${domain}`;
    return `${local.slice(0, 2)}${'•'.repeat(Math.min(local.length - 2, 5))}@${domain}`;
  };

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the full 6-digit verification code');
      return;
    }

    if (!pendingSignupState?.email || !pendingSignupState?.challengeToken) {
      setError('Verification session expired. Please start registration again.');
      return;
    }

    setLoading(true);

    try {
      // 1. Verify OTP with serverless HMAC endpoint
      const verifyRes = await verifySignupOtp(
        pendingSignupState.email,
        otp,
        pendingSignupState.challengeToken
      );

      if (!verifyRes.success || !verifyRes.verified) {
        throw new Error(verifyRes.error || 'Invalid or expired verification code');
      }

      // 2. Create Firebase Auth user & Firestore profile
      await signup(
        pendingSignupState.email,
        pendingSignupState.password,
        pendingSignupState.name
      );

      // 3. Mark success state to render the Apple-like Success Animation Screen
      setIsSuccess(true);
      toast.success('Account created successfully!');

      // 4. Smooth transition to /dashboard after displaying the success screen
      setTimeout(() => {
        setPendingSignupState(null);
        navigate('/dashboard', { replace: true });
      }, 1600);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending || !pendingSignupState?.email) return;
    setResending(true);
    setError('');

    try {
      const res = await sendSignupOtp(pendingSignupState.email, pendingSignupState.name);
      if (res.success && res.challengeToken) {
        setPendingSignupState((prev) => ({
          ...prev,
          challengeToken: res.challengeToken,
        }));
        setCooldown(60);
        setOtp('');
        toast.success('New verification code sent');
      } else {
        setError(res.error || 'Failed to resend code');
      }
    } catch (err) {
      setError(err.message || 'Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <div className="py-4 animate-scale-in">
          <SuccessAnimation
            title="Account created successfully"
            subtitle="Your KeshavCoder workspace is ready. Redirecting..."
          />
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Verify your email"
      subtitle={`We sent a 6-digit code to ${maskEmail(pendingSignupState?.email)}`}
    >
      <form onSubmit={handleVerify} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-kc-danger/10 border border-kc-danger/25 text-kc-danger text-sm animate-fade-in text-center">
            {error}
          </div>
        )}

        <div className="text-center">
          <OTPInput
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (error) setError('');
              if (val.length === 6) {
                // Auto trigger verification when 6 digits are entered
                setTimeout(() => {
                  const submitBtn = document.getElementById('verify-submit-btn');
                  if (submitBtn) submitBtn.click();
                }, 100);
              }
            }}
            disabled={loading}
          />
        </div>

        <button
          id="verify-submit-btn"
          type="submit"
          disabled={loading || otp.length !== 6}
          className="kc-btn-primary w-full mt-2 cursor-pointer"
        >
          {loading ? 'Verifying Code...' : 'Verify & Create Workspace'}
        </button>

        {/* Resend Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-kc-border text-xs">
          <Link
            to="/signup"
            className="text-kc-muted hover:text-kc-text flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Change Email</span>
          </Link>

          <button
            type="button"
            onClick={handleResend}
            disabled={cooldown > 0 || resending || loading}
            className="text-kc-accent font-semibold flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed hover:underline cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
            {cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <span>Resend Code</span>
            )}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
export default VerifyOtp;
