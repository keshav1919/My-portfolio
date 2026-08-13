import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { OTPInput } from '../../components/auth/OTPInput';
import { useToast } from '../../context/ToastContext';
import { sendResetOtp, verifyResetOtp, resetPasswordAdmin } from '../../services/authService';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft, RefreshCw } from 'lucide-react';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [email, setEmail] = useState('');
  const [challengeToken, setChallengeToken] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [error, setError] = useState('');

  useEffect(() => {
    if (step !== 2 || cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [step, cooldown]);

  // Step 1: Send Reset OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await sendResetOtp(email.trim());
      if (res.success && res.challengeToken) {
        setChallengeToken(res.challengeToken);
        setStep(2);
        setCooldown(60);
        toast.success('Password reset code sent to your email');
      } else {
        setError(res.error || 'Failed to send reset code. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Could not send reset code');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');

    if (otp.length !== 6) {
      setError('Please enter the 6-digit code sent to your email');
      return;
    }

    setLoading(true);
    try {
      const res = await verifyResetOtp(email.trim(), otp, challengeToken);
      if (res.success && res.resetToken) {
        setResetToken(res.resetToken);
        setStep(3);
        toast.success('Code verified. Set your new password.');
      } else {
        setError(res.error || 'Invalid or expired verification code');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const res = await sendResetOtp(email.trim());
      if (res.success && res.challengeToken) {
        setChallengeToken(res.challengeToken);
        setCooldown(60);
        setOtp('');
        toast.success('New reset code sent');
      } else {
        setError(res.error || 'Failed to resend code');
      }
    } catch (err) {
      setError(err.message || 'Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await resetPasswordAdmin(email.trim(), newPassword, resetToken);
      if (res.success) {
        setStep(4);
        toast.success('Password successfully reset');
      } else {
        setError(res.error || 'Failed to update password');
      }
    } catch (err) {
      setError(err.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title={step === 4 ? 'Password Updated' : 'Reset your password'}
      subtitle={
        step === 1
          ? 'Enter your account email to receive a 6-digit recovery code.'
          : step === 2
          ? `Enter the 6-digit recovery code sent to ${email}`
          : step === 3
          ? 'Enter your new password below.'
          : 'Your password has been successfully updated.'
      }
    >
      {/* Step Indicator */}
      {step < 4 && (
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                s === step
                  ? 'w-8 bg-kc-accent'
                  : s < step
                  ? 'w-4 bg-emerald-500'
                  : 'w-4 bg-kc-border'
              }`}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="p-3.5 mb-4 rounded-xl bg-kc-danger/10 border border-kc-danger/25 text-kc-danger text-sm animate-fade-in text-center">
          {error}
        </div>
      )}

      {/* STEP 1: Enter Email */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <div className="kc-form-group">
            <label className="kc-form-label" htmlFor="reset-email">
              Account Email
            </label>
            <div className="kc-input-wrapper">
              <span className="kc-input-icon-left">
                <Mail />
              </span>
              <input
                id="reset-email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                disabled={loading}
                className="kc-input has-left-icon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="kc-btn-primary w-full mt-2 cursor-pointer"
          >
            {loading ? 'Sending Recovery Code...' : 'Send Recovery Code'}
          </button>

          <div className="text-center pt-3 border-t border-kc-border">
            <Link to="/login" className="text-xs text-kc-muted hover:text-kc-text inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}

      {/* STEP 2: Enter OTP */}
      {step === 2 && (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div className="text-center">
            <OTPInput
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (error) setError('');
              }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="kc-btn-primary w-full cursor-pointer"
          >
            {loading ? 'Verifying Code...' : 'Verify Code'}
          </button>

          <div className="flex items-center justify-between pt-4 border-t border-kc-border text-xs">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-kc-muted hover:text-kc-text flex items-center gap-1 font-medium cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Change Email
            </button>

            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || resending || loading}
              className="text-kc-accent font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
              {cooldown > 0 ? `Resend (${cooldown}s)` : 'Resend Code'}
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Set New Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div className="kc-form-group">
            <label className="kc-form-label" htmlFor="new-password">
              New Password (min 6 chars)
            </label>
            <div className="kc-input-wrapper">
              <span className="kc-input-icon-left">
                <Lock />
              </span>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                className="kc-input has-left-icon has-right-action"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="kc-input-btn-right"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <div className="kc-form-group">
            <label className="kc-form-label" htmlFor="confirm-new-password">
              Confirm New Password
            </label>
            <div className="kc-input-wrapper">
              <span className="kc-input-icon-left">
                <Lock />
              </span>
              <input
                id="confirm-new-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                className="kc-input has-left-icon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="kc-btn-primary w-full mt-2 cursor-pointer"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      )}

      {/* STEP 4: Success Confirmation */}
      {step === 4 && (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <p className="text-sm text-kc-muted">
            You can now log in with your updated credentials.
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="kc-btn-primary w-full cursor-pointer"
          >
            Sign In with New Password
          </button>
        </div>
      )}
    </AuthLayout>
  );
}
export default ForgotPassword;
