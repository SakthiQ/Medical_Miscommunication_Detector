import { SUPPORTED_LANGUAGES } from '@/types';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  value: string;
  onChange: (code: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5">
      <Globe className="h-3.5 w-3.5 text-gray-400" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer"
        aria-label="Translation language"
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
}
