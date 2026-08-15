import type { JargonTerm } from '@/types';

interface JargonGlossaryProps {
  terms: JargonTerm[];
}

export function JargonGlossary({ terms }: JargonGlossaryProps) {
  if (terms.length === 0) {
    return (
      <div className="card p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-2">Medical terms</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
          No specific medical jargon was detected. If something is still unclear, try rephrasing the text or ask your doctor.
        </p>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-900">Medical terms</h3>
        <span className="text-xs tabular-nums text-gray-400">
          {terms.length} {terms.length === 1 ? 'term' : 'terms'}
        </span>
      </div>

      <dl className="divide-y divide-gray-100">
        {terms.map((item, index) => (
          <div key={`${item.term}-${index}`} className="py-3 first:pt-0 last:pb-0">
            <dt className="text-sm font-semibold text-gray-900">{item.term}</dt>
            <dd className="mt-0.5 text-sm leading-relaxed text-gray-600">{item.explanation}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
