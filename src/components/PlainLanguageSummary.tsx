import { useState } from 'react';
import { Copy, Check, ThumbsUp, ThumbsDown, FileText, ChevronDown } from 'lucide-react';
import type { ExplanationResult } from '@/types';
import { VoicePlayer } from './VoicePlayer';
import { MedicalDisclaimer } from './MedicalDisclaimer';

interface PlainLanguageSummaryProps {
  result: ExplanationResult;
  originalText: string;
  translatedSummary?: string;
  languageName: string;
  explanationId?: string;
  onFeedback?: (wasClear: boolean) => void;
}

export function PlainLanguageSummary({
  result,
  originalText,
  translatedSummary,
  languageName,
  explanationId,
  onFeedback,
}: PlainLanguageSummaryProps) {
  const [copied, setCopied] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<'yes' | 'no' | null>(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.plain_summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleFeedback = (wasClear: boolean) => {
    setFeedbackGiven(wasClear ? 'yes' : 'no');
    onFeedback?.(wasClear);
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">In plain language</h3>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
            result.source === 'ai' ? 'bg-primary-50 text-primary-700' : 'bg-gray-100 text-gray-500'
          }`}>
            {result.source === 'ai' ? 'AI-powered' : 'Basic mode'}
          </span>
        </div>

        <p className="font-serif text-[17px] leading-[1.65] text-gray-800 whitespace-pre-line">
          {result.plain_summary}
        </p>

        {translatedSummary && (
          <div className="mt-5 border-t border-gray-100 pt-4">
            <p className="label-tag text-primary-700 mb-2">{languageName} translation</p>
            <p className="text-[15px] leading-relaxed text-gray-800 whitespace-pre-line" dir="auto">
              {translatedSummary}
            </p>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <VoicePlayer text={translatedSummary || result.plain_summary} />
          <button onClick={handleCopy} className="btn-secondary !px-3.5 !py-2">
            {copied ? <><Check className="h-4 w-4 text-success-600" /> Copied</> : <><Copy className="h-4 w-4" /> Copy</>}
          </button>
          <button
            onClick={() => setShowOriginal(!showOriginal)}
            className="btn-ghost"
          >
            <FileText className="h-4 w-4" />
            {showOriginal ? 'Hide original' : 'Show original'}
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showOriginal ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Original text */}
      {showOriginal && (
        <div className="animate-slide-up rounded-lg border border-gray-200 bg-gray-50 p-4">
          <p className="label-tag mb-2">Original medical text</p>
          <p className="text-sm text-gray-600 whitespace-pre-line leading-relaxed">{originalText}</p>
        </div>
      )}

      {/* Feedback */}
      {explanationId && (
        <div className="flex items-center gap-3 py-1">
          {feedbackGiven === null ? (
            <>
              <span className="text-sm text-gray-500">Was this explanation clear?</span>
              <div className="flex gap-1">
                <button
                  onClick={() => handleFeedback(true)}
                  className="btn-ghost !py-1.5 !px-3 hover:text-success-700 hover:bg-success-50"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  Yes
                </button>
                <button
                  onClick={() => handleFeedback(false)}
                  className="btn-ghost !py-1.5 !px-3 hover:text-error-700 hover:bg-error-50"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                  No
                </button>
              </div>
            </>
          ) : (
            <span className="text-sm text-gray-500">
              {feedbackGiven === 'yes'
                ? 'Thanks for the feedback.'
                : 'Thanks — we\'ll work on making this clearer. Please ask your doctor about anything that\'s still confusing.'}
            </span>
          )}
        </div>
      )}

      <MedicalDisclaimer variant="inline" />
    </div>
  );
}
