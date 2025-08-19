// components/JobCongratsModal.tsx
'use client';

import { useMemo, useState } from 'react';
import ProgressSteps from '@/components/ProgressSteps';

type Opt = { label: string; value: string };

const ranges1: Opt[] = [
  { label: '0', value: '0' },
  { label: '1 – 5', value: '1-5' },
  { label: '6 – 20', value: '6-20' },
  { label: '20+', value: '20+' },
];
const ranges2: Opt[] = [
  { label: '0', value: '0' },
  { label: '1–2', value: '1-2' },
  { label: '3–5', value: '3-5' },
  { label: '5+', value: '5+' },
];

function Row({
  title,
  options,
  value,
  onChange,
}: {
  title: string;
  options: Opt[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-gray-800">{title}</p>
      <div className="grid grid-cols-4 gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            className={`h-10 rounded-md border text-sm transition-colors outline-none
              ${value === o.value
                ? 'border-gray-900 text-gray-900 bg-gray-100'
                : 'border-gray-300 text-gray-800 hover:bg-gray-50'}
              focus-visible:ring-2 focus-visible:ring-gray-400`}
            aria-pressed={value === o.value}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function JobCongratsModal({
  open,
  onBack,
  onContinue,
  onFoundVia,
}: {
  open: boolean;
  onBack: () => void;
  onContinue: () => void;
  onFoundVia: (foundWithMM: boolean) => void;
}) {
  const [q1, setQ1] = useState<string>(); // "yes" | "no"
  const [q2, setQ2] = useState<string>();
  const [q3, setQ3] = useState<string>();
  const [q4, setQ4] = useState<string>();
  const [foundWithMM, setFoundWithMM] = useState<boolean | null>(null);

  const surveyReady = useMemo(() => !!(q1 && q2 && q3 && q4), [q1, q2, q3, q4]);
  const ready = surveyReady && foundWithMM !== null;

  async function handleContinue() {
    if (!ready) return;
    try {
      await fetch('/api/cancel/reason', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: `Found job survey: withMMRow=${q1}; rolesViaMM=${q2}; emailed=${q3}; interviewed=${q4}`,
        }),
      });
    } catch {}
    onFoundVia(Boolean(foundWithMM));
    onContinue();
  }

  if (!open) return null;

  return (
    <div className="modal__overlay">
      <div className="modal__scrim" onClick={onBack} />
      <div className="modal__panel" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="modal__header">
          <button onClick={onBack} className="text-sm text-gray-800 hover:underline">‹ Back</button>
          <div className="flex items-center gap-3 text-sm text-gray-800">
            <span className="font-medium">Subscription Cancellation</span>
            <ProgressSteps current={1} total={3} />
            <span>Step 1 of 3</span>
          </div>
          <button onClick={onBack} aria-label="Close" className="p-1 rounded hover:bg-gray-100">✕</button>
        </div>

        {/* Body */}
        <div className="modal__grid">
          {/* LEFT: form */}
          <div>
            <h2 className="text-[28px] leading-tight font-bold text-gray-900 mb-3">
              Congrats on the new role! 🎉
            </h2>

            <div className="mt-6 space-y-5">
              {/* Q1 */}
              <div>
                <p className="mb-2 text-sm font-medium text-gray-800">
                  Did you find the job with MigrateMate?*
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`h-10 rounded-md border text-sm transition-colors
                      ${foundWithMM === true
                        ? 'border-gray-900 bg-gray-100 text-gray-900'
                        : 'border-gray-300 text-gray-800 hover:bg-gray-50'}`}
                    onClick={() => { setFoundWithMM(true); setQ1('yes'); }}
                    aria-pressed={foundWithMM === true}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    className={`h-10 rounded-md border text-sm transition-colors
                      ${foundWithMM === false
                        ? 'border-gray-900 bg-gray-100 text-gray-900'
                        : 'border-gray-300 text-gray-800 hover:bg-gray-50'}`}
                    onClick={() => { setFoundWithMM(false); setQ1('no'); }}
                    aria-pressed={foundWithMM === false}
                  >
                    No
                  </button>
                </div>
              </div>

              <Row
                title="How many roles did you apply for through Migrate Mate?*"
                options={ranges1}
                value={q2}
                onChange={setQ2}
              />
              <Row
                title="How many companies did you email directly?*"
                options={ranges1}
                value={q3}
                onChange={setQ3}
              />
              <Row
                title="How many different companies did you interview with?*"
                options={ranges2}
                value={q4}
                onChange={setQ4}
              />
            </div>

            <button
              disabled={!ready}
              onClick={handleContinue}
              className={`mt-8 w-full h-11 rounded-lg font-medium shadow-sm transition
                ${ready
                  ? 'bg-gray-900 text-white hover:opacity-90'
                  : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'}`}
            >
              Continue
            </button>
          </div>

          {/* RIGHT: image (shared sizing) */}
          <div className="modal__imgWrap">
            <div className="modal__imgBox">
              <img src="/empire-state-compressed.jpg" alt="New York skyline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
