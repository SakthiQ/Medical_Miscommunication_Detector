import { AlertCircle } from 'lucide-react';

export function MedicalDisclaimer({ variant = 'banner' }: { variant?: 'banner' | 'inline' }) {
  if (variant === 'inline') {
    return (
      <p className="flex items-start gap-2 text-xs leading-relaxed text-gray-400">
        <AlertCircle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
        <span><span className="font-medium text-gray-500">Not medical advice.</span> This tool helps you understand medical language — always discuss results with your doctor before making health decisions.</span>
      </p>
    );
  }

  return (
    <div className="flex items-start gap-2.5 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
      <AlertCircle className="h-4 w-4 flex-shrink-0 text-gray-400 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-gray-700">Medical disclaimer</p>
        <p className="mt-0.5 text-sm leading-relaxed text-gray-500">
          MedTranslate helps you understand medical language in plain terms. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult your doctor.
        </p>
      </div>
    </div>
  );
}
