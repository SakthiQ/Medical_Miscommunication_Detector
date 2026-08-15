export interface JargonTerm {
  term: string;
  explanation: string;
}

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export type ExplanationSource = 'ai' | 'fallback';

export interface Explanation {
  id: string;
  original_text: string;
  plain_summary: string;
  jargon_terms: JargonTerm[];
  confidence_level: ConfidenceLevel;
  confidence_note: string | null;
  source: ExplanationSource;
  language: string;
  created_at: string;
  user_id: string | null;
  image_path: string | null;
}

export interface ExplanationResult {
  plain_summary: string;
  jargon_terms: JargonTerm[];
  confidence_level: ConfidenceLevel;
  confidence_note: string;
  source: ExplanationSource;
}

export interface Feedback {
  id: string;
  explanation_id: string;
  was_clear: boolean;
  comment: string | null;
  created_at: string;
}

export type LanguageOption = {
  code: string;
  label: string;
  flag: string;
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', flag: 'EN' },
  { code: 'hi', label: 'Hindi', flag: 'HI' },
  { code: 'es', label: 'Spanish', flag: 'ES' },
  { code: 'bn', label: 'Bengali', flag: 'BN' },
  { code: 'ta', label: 'Tamil', flag: 'TA' },
  { code: 'te', label: 'Telugu', flag: 'TE' },
  { code: 'ar', label: 'Arabic', flag: 'AR' },
  { code: 'fr', label: 'French', flag: 'FR' },
];
