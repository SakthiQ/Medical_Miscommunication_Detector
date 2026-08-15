import { HeartPulse, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/useAuth';

interface NavbarProps {
  currentView: 'home' | 'translate' | 'history';
  onNavigate: (view: 'home' | 'translate' | 'history') => void;
  onAuthClick: () => void;
}

export function Navbar({ currentView, onNavigate, onAuthClick }: NavbarProps) {
  const { user, signOut } = useAuth();

  const navItems = [
    { id: 'translate' as const, label: 'Translate' },
    { id: 'history' as const, label: 'History' },
  ];

  const initials = user?.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <button onClick={() => onNavigate('home')} className="flex items-center gap-2.5" aria-label="MedTranslate home">
          <HeartPulse className="h-5 w-5 text-primary-700" strokeWidth={2.2} />
          <span className="text-[15px] font-semibold tracking-tight text-gray-900">MedTranslate</span>
        </button>

        <div className="flex items-center gap-0.5">
          {navItems.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                currentView === id ? 'text-primary-700' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {label}
            </button>
          ))}

          {user ? (
            <div className="ml-2 flex items-center gap-2">
              <button
                onClick={() => onNavigate('history')}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-semibold text-primary-700 transition-colors hover:bg-primary-200"
                title={user.email ?? undefined}
              >
                {initials}
              </button>
              <button
                onClick={() => signOut()}
                className="rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                aria-label="Sign out"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onAuthClick}
              className="ml-2 rounded-lg bg-primary-700 px-3.5 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-800"
            >
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
