import { useState } from 'react';
import { AuthProvider } from '@/lib/auth';
import { Navbar } from '@/components/Navbar';
import { Landing } from '@/components/Landing';
import { TranslateView } from '@/components/TranslateView';
import { HistoryView } from '@/components/HistoryView';
import { AuthModal } from '@/components/AuthModal';
import { HeartPulse } from 'lucide-react';

type View = 'home' | 'translate' | 'history';

function AppContent() {
  const [view, setView] = useState<View>('home');
  const [historyRefreshKey, setHistoryRefreshKey] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');

  const handleNavigate = (next: View) => {
    setView(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaved = () => {
    setHistoryRefreshKey(k => k + 1);
  };

  const openAuth = (mode: 'signin' | 'signup' = 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar
        currentView={view}
        onNavigate={handleNavigate}
        onAuthClick={() => openAuth('signin')}
      />

      <main className="flex-1">
        {view === 'home' && <Landing onGetStarted={() => handleNavigate('translate')} onAuthClick={() => openAuth('signup')} />}
        {view === 'translate' && <TranslateView onSaved={handleSaved} onAuthRequired={() => openAuth('signin')} />}
        {view === 'history' && <HistoryView refreshKey={historyRefreshKey} onAuthRequired={() => openAuth('signin')} />}
      </main>

      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-gray-500">
              <HeartPulse className="h-4 w-4 text-primary-700" strokeWidth={2.2} />
              <span className="text-sm font-medium text-gray-700">MedTranslate</span>
            </div>
            <p className="text-xs text-gray-400 text-center sm:text-right max-w-lg">
              For understanding, not diagnosis. Always consult your doctor with questions about your health.
            </p>
          </div>
        </div>
      </footer>

      <AuthModal open={authModalOpen} onClose={() => setAuthModalOpen(false)} initialMode={authMode} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
