'use client';

import { useMemo, useState } from 'react';
import ProgressSteps from '@/components/ProgressSteps';

type ReasonKey = 'price' | 'not_helpful' | 'irrelevant_jobs' | 'no_move' | 'other';
type ReasonDef = {
  key: ReasonKey;
  label: string;
  kind: 'price' | 'text';
  followupLabel?: string;
  placeholder?: string;
};

const REASONS: ReasonDef[] = [
  { key: 'price',           label: 'Too expensive',            kind: 'price' },
  { key: 'not_helpful',     label: 'Platform not helpful',     kind: 'text',
    followupLabel: 'What can we change to make the platform more helpful?*',
    placeholder: 'Tell us what didn’t work well…' },
  { key: 'irrelevant_jobs', label: 'Not enough relevant jobs', kind: 'text',
    followupLabel: 'In which way can we make the jobs more relevant?*',
    placeholder: 'e.g., more visa-friendly roles, locations, titles…' },
  { key: 'no_move',         label: 'Decided not to move',      kind: 'text',
    followupLabel: 'What changed for you to decide to not move?*',
    placeholder: 'A quick sentence is perfect…' },
  { key: 'other',           label: 'Other',                    kind: 'text',
    followupLabel: 'What would have helped you the most?*',
    placeholder: 'What could we have done better?' },
];

function usd(n: number) {
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
}

export default function DownsellReasonsModal({
  open,
  onBack,
  onClose,
  onGetOffer,
  onComplete,
  fullPrice = 25,
}: {
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  onGetOffer: () => void;
  onComplete: (payload: { reason: ReasonKey; details?: string }) => void;
  fullPrice?: number;
}) {
  const [reason, setReason]   = useState<ReasonKey | null>(null);
  const [text, setText]       = useState('');
  const [price, setPrice]     = useState('');

  const selected    = REASONS.find(r => r.key === reason) || null;
  const needsText   = selected?.kind === 'text';
  const needsPrice  = selected?.kind === 'price';
  const textMin     = 25;
  const textInvalid = needsText  ? text.trim().length < textMin : false;
  const priceInvalid= needsPrice ? !(+price) || +price <= 0     : false;

  const canSubmit = useMemo(() => {
    if (!selected) return false;
    if (needsPrice) return !priceInvalid;
    if (needsText)  return !textInvalid;
    return false;
  }, [selected, needsPrice, needsText, textInvalid, priceInvalid]);

  const half = fullPrice / 2;
  if (!open) return null;

  function chooseReason(next: ReasonKey) {
    setReason(next);
    setText('');
    setPrice('');
  }

  return (
    <div className="modal__overlay">
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__panel">
        {/* Header */}
        <div className="modal__header">
          <button onClick={onBack} className="text-sm text-gray-700 hover:underline">‹ Back</button>
          <div className="flex items-center gap-3 text-sm text-gray-800">
            <span className="font-medium">Subscription Cancellation</span>
            <ProgressSteps current={3} total={3} />
            <span>Step 3 of 3</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">✕</button>
        </div>

        {/* Body */}
        <div className="modal__grid">
          {/* Left */}
          <div className="flex flex-col min-h-[420px]">
            <h1 id="reasonsTitle" className="text-[40px] leading-[1.05] font-extrabold tracking-tight text-gray-900">
              What’s the main reason for cancelling?
            </h1>
            <p className="mt-2 text-sm text-gray-700">Please take a minute to let us know why:</p>

            {/* A) list until a reason is chosen */}
            {!selected && (
              <>
                <p className="mt-4 text-sm font-medium text-red-600">
                  To help us understand your experience, please select a reason for cancelling*
                </p>
                <fieldset className="mt-3 space-y-3" role="radiogroup" aria-labelledby="reasonsTitle">
                  {REASONS.map((r) => (
                    <label key={r.key} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="cancel-reason"
                        className="h-5 w-5 accent-black"
                        onChange={() => chooseReason(r.key)}
                      />
                      <span className="text-sm text-gray-900">{r.label}</span>
                    </label>
                  ))}
                </fieldset>
              </>
            )}

            {/* B) chosen line */}
            {selected && (
              <div className="mt-4 flex items-center gap-3">
                {/* faux selected radio – use valid utility sizes */}
                <span aria-hidden className="relative inline-block h-[18px] w-[18px]">
                  <span className="absolute inset-0 rounded-full border-2 border-gray-900" />
                  <span className="absolute inset-[3px] rounded-full bg-gray-900" />
                </span>
                <span className="text-sm text-gray-900 font-medium">{selected.label}</span>
              </div>
            )}

            {/* Follow-up controls */}
            {selected?.kind === 'price' && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">What would be the maximum you would be willing to pay?*</p>
                <input
                  inputMode="decimal"
                  placeholder="$"
                  value={price}
                  onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))}
                  className={`mt-2 w-full rounded-md border px-3 py-2 text-gray-900
                    ${priceInvalid ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-gray-300'}
                    focus:outline-none focus:ring-2`}
                />
              </div>
            )}

            {selected?.kind === 'text' && (
              <div className="mt-4">
                <p className="text-sm text-gray-700">{selected.followupLabel}</p>
                <div className="mt-2 relative">
                  <textarea
                    rows={5}
                    placeholder={selected.placeholder}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className={`w-full rounded-md border px-3 py-2 text-gray-900 resize-y
                      ${textInvalid ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-gray-300'}
                      focus:outline-none focus:ring-2`}
                  />
                  <span className="absolute right-2 bottom-2 text-[11px] text-gray-500">
                    Min {textMin} characters ({Math.min(text.trim().length, 999)}/{textMin})
                  </span>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="mt-6 grid gap-3">
              <button
                onClick={onGetOffer}
                className="w-full h-11 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
              >
                Get 50% off | {usd(half)} <span className="text-white/70 line-through ml-1">{usd(fullPrice)}</span>
              </button>

              <button
                disabled={!canSubmit}
                onClick={() => {
                  if (!selected) return;
                  onComplete({
                    reason: selected.key,
                    details: selected.kind === 'price' ? price.trim() : text.trim(),
                  });
                }}
                className={`w-full h-11 rounded-lg font-semibold transition ${
                  canSubmit ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                Complete cancellation
              </button>
            </div>
          </div>

          {/* Right image */}
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
