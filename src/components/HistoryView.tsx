import { useState, useEffect } from 'react';
import { Trash2, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { fetchHistory, deleteExplanation } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import type { Explanation } from '@/types';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { JargonGlossary } from './JargonGlossary';
import { PlainLanguageSummary } from './PlainLanguageSummary';
import { MedicalDisclaimer } from './MedicalDisclaimer';

interface HistoryViewProps {
  refreshKey: number;
  onAuthRequired: () => void;
}

export function HistoryView({ refreshKey, onAuthRequired }: HistoryViewProps) {
  const { user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<Explanation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Explanation | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const data = await fetchHistory(50);
      if (!cancelled) {
        setItems(data);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [refreshKey, user]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await deleteExplanation(id);
    if (success) {
      setItems(items.filter(item => item.id !== id));
      if (selected?.id === id) setSelected(null);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Not signed in
  if (!authLoading && !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <h1 className="text-2xl font-semibold text-gray-900">History</h1>
        <div className="mt-6 card p-12 text-center">
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">Sign in to view your history</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            Create a free account to save your translations and revisit them on any device — helpful before doctor appointments.
          </p>
          <button onClick={onAuthRequired} className="btn-primary mt-5">
            Create an account
          </button>
        </div>
      </div>
    );
  }

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-5">
              <div className="h-4 w-24 skeleton rounded mb-3" />
              <div className="h-4 w-full skeleton rounded mb-2" />
              <div className="h-4 w-2/3 skeleton rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (selected) {
    return (
      <div className="animate-fade-in mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <button
          onClick={() => setSelected(null)}
          className="mb-6 flex items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to history
        </button>

        <div className="space-y-5">
          <PlainLanguageSummary
            result={{
              plain_summary: selected.plain_summary,
              jargon_terms: selected.jargon_terms,
              confidence_level: selected.confidence_level,
              confidence_note: selected.confidence_note || 'Please discuss these results with your doctor.',
              source: selected.source,
            }}
            originalText={selected.original_text}
            languageName="English"
          />
          <JargonGlossary terms={selected.jargon_terms} />
          <ConfidenceIndicator
            level={selected.confidence_level}
            note={selected.confidence_note || 'Please discuss these results with your doctor.'}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">History</h1>
        {items.length > 0 && (
          <span className="text-sm tabular-nums text-gray-400">
            {items.length} {items.length === 1 ? 'explanation' : 'explanations'}
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <h3 className="text-base font-semibold text-gray-900 mb-1">No explanations yet</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
            When you translate medical text, it will appear here so you can revisit it — helpful before doctor appointments.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 border-y border-gray-200">
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelected(item)}
              className="group flex cursor-pointer items-start justify-between gap-4 py-4 transition-colors hover:bg-gray-50/60 -mx-2 px-2 rounded-md"
            >
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs tabular-nums text-gray-400">{formatDate(item.created_at)}</span>
                  {item.source === 'ai' && (
                    <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[11px] font-medium text-primary-700">AI</span>
                  )}
                  {item.image_path && (
                    <span className="text-[11px] text-gray-400">From image</span>
                  )}
                  {item.jargon_terms.length > 0 && (
                    <span className="text-[11px] text-gray-400">{item.jargon_terms.length} terms</span>
                  )}
                </div>
                <p className="text-sm text-gray-400 truncate mb-0.5">{item.original_text}</p>
                <p className="text-sm text-gray-800 truncate">{item.plain_summary}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0 mt-1">
                <button
                  onClick={(e) => handleDelete(item.id, e)}
                  className="rounded-md p-1.5 text-gray-300 transition-colors hover:bg-error-50 hover:text-error-600"
                  aria-label="Delete explanation"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <ChevronRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <MedicalDisclaimer />
      </div>
    </div>
  );
}
