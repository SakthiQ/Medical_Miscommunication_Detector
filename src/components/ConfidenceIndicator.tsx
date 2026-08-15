import type { ConfidenceLevel } from '@/types';

interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  note: string;
}

const config: Record<ConfidenceLevel, {
  label: string;
  dotClass: string;
  barClass: string;
  barWidth: string;
}> = {
  high:   { label: 'High confidence',   dotClass: 'bg-success-500', barClass: 'bg-success-500', barWidth: '85%' },
  medium: { label: 'Medium confidence', dotClass: 'bg-warning-500', barClass: 'bg-warning-500', barWidth: '55%' },
  low:    { label: 'Low confidence',    dotClass: 'bg-error-500',   barClass: 'bg-error-500',   barWidth: '30%' },
};

export function ConfidenceIndicator({ level, note }: ConfidenceIndicatorProps) {
  const c = config[level];

  return (
    <div className="card p-5">
      <div className="mb-2.5 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${c.dotClass}`} />
        <span className="text-sm font-medium text-gray-700">{c.label}</span>
      </div>

      <div className="mb-3 h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${c.barClass} transition-all duration-700 ease-out`}
          style={{ width: c.barWidth }}
        />
      </div>

      <p className="text-sm leading-relaxed text-gray-600">
        <span className="font-medium text-gray-700">Verify with your doctor: </span>
        {note}
      </p>
    </div>
  );
}
