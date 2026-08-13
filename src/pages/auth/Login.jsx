import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthLayout } from '../../components/auth/AuthLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatAuthError } from '../../services/authService';
import { Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const { profile } = await login(email.trim(), password);
      toast.success(`Welcome back, ${profile?.name || 'Developer'}!`);
      navigate(from, { replace: true });
    } catch (err) {
      setError(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your KeshavCoder developer dashboard and profile."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3.5 rounded-xl bg-kc-danger/10 border border-kc-danger/25 text-kc-danger text-sm animate-fade-in flex items-center gap-2">
            <span>{error}</span>
          </div>
        )}

        {/* Email */}
        <div className="kc-form-group">
          <label className="kc-form-label" htmlFor="login-email">
            Email Address
          </label>
          <div className="kc-input-wrapper">
            <span className="kc-input-icon-left">
              <Mail />
            </span>
            <input
              id="login-email"
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

        {/* Password */}
        <div className="kc-form-group">
          <div className="flex items-center justify-between mb-1">
            <label className="kc-form-label m-0" htmlFor="login-password">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-xs text-kc-accent hover:underline font-semibold"
            >
              Forgot password?
            </Link>
          </div>
          <div className="kc-input-wrapper">
            <span className="kc-input-icon-left">
              <Lock />
            </span>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError('');
              }}
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

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="kc-btn-primary w-full mt-3 cursor-pointer"
        >
          {loading ? (
            <span>Signing in...</span>
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Signup Prompt */}
        <p className="text-center text-xs text-kc-muted pt-4 border-t border-kc-border">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-kc-accent font-bold hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
export default Login;
