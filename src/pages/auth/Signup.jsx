import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { sendSignupOtp } from '../../services/authService';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export function Signup() {
  const navigate = useNavigate();
  const { setPendingSignupState } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!formData.termsAccepted) {
      setError('You must accept the Terms & Conditions to create an account');
      return;
    }

    setLoading(true);

    try {
      const res = await sendSignupOtp(formData.email.trim(), formData.name.trim());
      if (res.success && res.challengeToken) {
        setPendingSignupState({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          challengeToken: res.challengeToken,
        });
        toast.success('Verification code sent to your email');
        navigate('/verify-otp');
      } else {
        setError(res.error || 'Failed to send verification code. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Could not send verification OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join KeshavCoder to access roadmaps, tools, shortcuts and developer resources."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-kc-danger/10 border border-kc-danger/25 text-kc-danger text-sm animate-fade-in flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Full Name */}
        <div className="kc-form-group">
          <label className="kc-form-label" htmlFor="signup-name">
            Full Name
          </label>
          <div className="kc-input-wrapper">
            <span className="kc-input-icon-left">
              <User />
            </span>
            <input
              id="signup-name"
              name="name"
              type="text"
              required
              autoComplete="name"
              placeholder="e.g. Keshav Sharma"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              className="kc-input has-left-icon"
            />
          </div>
        </div>

        {/* Email Address */}
        <div className="kc-form-group">
          <label className="kc-form-label" htmlFor="signup-email">
            Email Address
          </label>
          <div className="kc-input-wrapper">
            <span className="kc-input-icon-left">
              <Mail />
            </span>
            <input
              id="signup-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className="kc-input has-left-icon"
            />
          </div>
        </div>

        {/* Password */}
        <div className="kc-form-group">
          <label className="kc-form-label" htmlFor="signup-password">
            Password (min 6 chars)
          </label>
          <div className="kc-input-wrapper">
            <span className="kc-input-icon-left">
              <Lock />
            </span>
            <input
              id="signup-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
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

        {/* Confirm Password */}
        <div className="kc-form-group">
          <label className="kc-form-label" htmlFor="signup-confirm-password">
            Confirm Password
          </label>
          <div className="kc-input-wrapper">
            <span className="kc-input-icon-left">
              <Lock />
            </span>
            <input
              id="signup-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
              className="kc-input has-left-icon has-right-action"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="kc-input-btn-right"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="pt-1">
          <label className="kc-checkbox-label">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="kc-checkbox"
            />
            <span>
              I agree to the{' '}
              <span className="text-kc-accent underline">Terms & Conditions</span> and privacy guidelines of KeshavCoder platform.
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="kc-btn-primary w-full mt-2"
        >
          {loading ? (
            <span>Sending verification code...</span>
          ) : (
            <>
              <span>Continue with Email OTP</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Switch to Login */}
        <div className="text-center pt-3 text-xs text-kc-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-kc-text hover:text-kc-accent transition-colors">
            Log in here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Signup;
