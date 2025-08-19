'use client';

type Props = {
  /** 1..total (ignored when complete=true) */
  current?: number;
  /** number of pills */
  total?: number;
  /** when true, all steps are green and label shows "Completed" */
  complete?: boolean;
  /** show "Step X of Y" or "Completed" to the right */
  showLabel?: boolean;
  /** pill size */
  size?: 'sm' | 'md' | 'lg';
  /** extra classes on wrapper */
  className?: string;
};

export default function ProgressSteps({
  current = 1,
  total = 3,
  complete = false,
  showLabel = false,
  size = 'md',
  className = '',
}: Props) {
  const dims =
    size === 'sm'
      ? { w: 'w-6', h: 'h-1' }
      : size === 'lg'
      ? { w: 'w-10', h: 'h-1.5' }
      : { w: 'w-8', h: 'h-1.5' };

  const aria = complete ? 'Completed' : `Step ${current} of ${total}`;

  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label={aria}>
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, i) => {
          const step = i + 1;
          const isDone = complete ? true : step < current;
          const isActive = !complete && step === current;

          const cls = isActive
            ? 'bg-gray-800'       // current
            : isDone
            ? 'bg-emerald-500'    // completed
            : 'bg-gray-200';      // upcoming

          return (
            <span
              key={i}
              className={`inline-block ${dims.w} ${dims.h} rounded-full ${cls} transition-colors duration-200`}
            />
          );
        })}
      </div>

      {showLabel && (
        <span className={`text-sm ${complete ? 'text-gray-700' : 'text-gray-600'}`}>
          {complete ? 'Completed' : `Step ${current} of ${total}`}
        </span>
      )}
    </div>
  );
}
