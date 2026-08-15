import { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export function AuthModal({ open, onClose, initialMode = 'signup' }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setMode(initialMode);
      setError(null);
      setEmail('');
      setPassword('');
    }
  }, [open, initialMode]);

  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setSubmitting(true);
    setError(null);

    const { error } = mode === 'signin'
      ? await signIn(email.trim(), password)
      : await signUp(email.trim(), password);

    setSubmitting(false);

    if (error) {
      setError(error);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm card p-6 animate-slide-up">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold text-gray-900">
          {mode === 'signup' ? 'Create your account' : 'Sign in'}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {mode === 'signup'
            ? 'Save your translation history and access it on any device.'
            : 'Welcome back. Sign in to view your saved translations.'}
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-3">
          <div>
            <label htmlFor="auth-email" className="label-tag">Email</label>
            <input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-primary-500"
              disabled={submitting}
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="auth-password" className="label-tag">Password</label>
            <input
              id="auth-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-primary-500"
              disabled={submitting}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-error-200 bg-error-50 px-3 py-2 text-sm text-error-700">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full justify-center">
            {submitting ? <><Loader2 className="h-4 w-4 animate-spin" /> Please wait…</> : mode === 'signup' ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-500">
          {mode === 'signup' ? 'Already have an account?' : "Don't have one yet?"}{' '}
          <button
            onClick={() => { setMode(mode === 'signup' ? 'signin' : 'signup'); setError(null); }}
            className="font-medium text-primary-700 hover:text-primary-800"
          >
            {mode === 'signup' ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}
