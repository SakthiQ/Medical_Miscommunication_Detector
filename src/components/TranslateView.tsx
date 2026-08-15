import { useState } from 'react';
import { Loader2, Trash2, AlertCircle, Wand2, Type, ImagePlus } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { PlainLanguageSummary } from './PlainLanguageSummary';
import { JargonGlossary } from './JargonGlossary';
import { ConfidenceIndicator } from './ConfidenceIndicator';
import { MedicalDisclaimer } from './MedicalDisclaimer';
import { ImageUpload } from './ImageUpload';
import { explainMedicalText, saveExplanation, submitFeedback } from '@/lib/api';
import { useAuth } from '@/lib/useAuth';
import { SUPPORTED_LANGUAGES } from '@/types';
import type { ExplanationResult } from '@/types';

interface TranslateViewProps {
  onSaved?: () => void;
  onAuthRequired?: () => void;
}

export function TranslateView({ onSaved, onAuthRequired }: TranslateViewProps) {
  const { user } = useAuth();
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplanationResult | null>(null);
  const [translatedSummary, setTranslatedSummary] = useState<string | undefined>(undefined);
  const [explanationId, setExplanationId] = useState<string | undefined>(undefined);
  const [imagePath, setImagePath] = useState<string | null>(null);

  const handleExplain = async () => {
    if (!text.trim()) {
      setError('Please paste some medical text to explain.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setTranslatedSummary(undefined);
    setExplanationId(undefined);

    const res = await explainMedicalText(text, language);
    setResult(res);

    if (language !== 'en') {
      const translated = (res as unknown as Record<string, unknown>).translated_summary;
      if (typeof translated === 'string') {
        setTranslatedSummary(translated);
      }
    }

    const saved = await saveExplanation(text, res, language, imagePath);
    if (saved) {
      setExplanationId(saved.id);
      onSaved?.();
    }

    setLoading(false);
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setTranslatedSummary(undefined);
    setExplanationId(undefined);
    setError(null);
    setImagePath(null);
  };

  const handleImageTextExtracted = (extractedText: string, path: string) => {
    setText(extractedText);
    setImagePath(path);
    setInputMode('text');
  };

  const handleFeedback = async (wasClear: boolean) => {
    if (!explanationId) return;
    await submitFeedback(explanationId, wasClear);
  };

  const languageName = SUPPORTED_LANGUAGES.find(l => l.code === language)?.label || 'English';
  const charCount = text.length;
  const maxChars = 10000;

  return (
    <div className="animate-fade-in mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      {/* Input */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Translate medical text</h1>
        <p className="mt-2 text-[15px] text-gray-500 leading-relaxed">
          Paste a medical report, lab result, or doctor's note — or upload a photo of a printed report and we'll extract the text for you.
        </p>

        {/* Mode toggle */}
        <div className="mt-6 inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
          <button
            onClick={() => setInputMode('text')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              inputMode === 'text' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Type className="h-3.5 w-3.5" />
            Paste text
          </button>
          <button
            onClick={() => setInputMode('image')}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              inputMode === 'image' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImagePlus className="h-3.5 w-3.5" />
            Upload image
          </button>
        </div>

        {/* Image upload mode */}
        {inputMode === 'image' && (
          <div className="mt-4 animate-slide-up">
            <ImageUpload
              onTextExtracted={handleImageTextExtracted}
              onClose={() => setInputMode('text')}
            />
          </div>
        )}

        {/* Text input mode */}
        {inputMode === 'text' && (
          <div className="mt-4 card p-4">
            {imagePath && (
              <div className="mb-3 flex items-center gap-2 rounded-lg bg-primary-50/60 px-3 py-2 text-xs text-primary-700">
                <ImagePlus className="h-3.5 w-3.5" />
                Text extracted from an uploaded image — you can edit it before translating.
              </div>
            )}
            <textarea
              value={text}
              onChange={(e) => {
                setText(e.target.value.slice(0, maxChars));
                if (error) setError(null);
              }}
              placeholder="Example: You have mild hepatic steatosis with elevated ALT. Recommend lifestyle modifications and follow-up in 3 months."
              className="h-36 w-full resize-none rounded-lg border border-gray-200 bg-white p-3.5 text-[15px] leading-relaxed text-gray-800 placeholder:text-gray-400 outline-none transition-colors focus:border-primary-500"
              disabled={loading}
            />

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <LanguageSelector value={language} onChange={setLanguage} />
                <span className={`text-xs tabular-nums ${charCount > maxChars * 0.9 ? 'text-warning-600' : 'text-gray-400'}`}>
                  {charCount.toLocaleString()} / {maxChars.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {text && !loading && (
                  <button onClick={handleClear} className="btn-ghost">
                    <Trash2 className="h-4 w-4" />
                    Clear
                  </button>
                )}
                <button
                  onClick={handleExplain}
                  disabled={loading || !text.trim()}
                  className="btn-primary"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Explaining…
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Explain
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-error-200 bg-error-50 px-3.5 py-2.5 text-sm text-error-700">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        {!user && (
          <p className="mt-3 text-xs text-gray-400">
            You can translate without an account. <button onClick={onAuthRequired} className="text-primary-700 underline hover:text-primary-800">Sign in</button> to save your history.
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="space-y-5">
          <div className="card p-6">
            <div className="h-5 w-32 skeleton rounded mb-4" />
            <div className="h-4 w-full skeleton rounded mb-2.5" />
            <div className="h-4 w-full skeleton rounded mb-2.5" />
            <div className="h-4 w-2/3 skeleton rounded mb-5" />
            <div className="flex gap-2">
              <div className="h-9 w-24 skeleton rounded-lg" />
              <div className="h-9 w-24 skeleton rounded-lg" />
              <div className="h-9 w-28 skeleton rounded-lg" />
            </div>
          </div>
          <div className="card p-6">
            <div className="h-5 w-48 skeleton rounded mb-4" />
            <div className="space-y-2.5">
              <div className="h-14 w-full skeleton rounded-lg" />
              <div className="h-14 w-full skeleton rounded-lg" />
            </div>
          </div>
          <div className="card p-5">
            <div className="h-5 w-36 skeleton rounded mb-3" />
            <div className="h-2 w-full skeleton rounded-full" />
          </div>
        </div>
      )}

      {/* Results */}
      {result && !loading && (
        <div className="space-y-5 animate-slide-up">
          <PlainLanguageSummary
            result={result}
            originalText={text}
            translatedSummary={translatedSummary}
            languageName={languageName}
            explanationId={explanationId}
            onFeedback={handleFeedback}
          />
          <JargonGlossary terms={result.jargon_terms} />
          <ConfidenceIndicator level={result.confidence_level} note={result.confidence_note} />
        </div>
      )}

      {/* Initial state */}
      {!result && !loading && !error && (
        <div className="mt-2">
          <MedicalDisclaimer />
        </div>
      )}
    </div>
  );
}
