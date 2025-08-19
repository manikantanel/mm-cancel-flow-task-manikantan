'use client';

import { useMemo, useState } from 'react';
import ProgressSteps from '@/components/ProgressSteps';

export default function ReasonTextModal({
  open,
  onBack,
  onContinue,
  /** set to false to allow continue without 25 chars */
  requireMin = false,
}: {
  open: boolean;
  onBack: () => void;
  onContinue: () => void;
  requireMin?: boolean;
}) {
  const [text, setText] = useState('');
  const minLen = 25;
  const meetsMin = useMemo(() => text.trim().length >= minLen, [text]);
  const canContinue = requireMin ? meetsMin : true;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onBack} />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-[61] w-[92%] max-w-6xl rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <button onClick={onBack} className="text-sm text-gray-800 hover:underline">‹ Back</button>
          <div className="flex items-center gap-3 text-sm text-gray-800">
            <span className="font-medium">Subscription Cancellation</span>
            <ProgressSteps current={2} total={3} />
            <span>Step 2 of 3</span>
          </div>
          <button onClick={onBack} aria-label="Close" className="p-1 rounded hover:bg-gray-100">✕</button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 items-stretch">
          {/* Right: perfectly square image, fills column, no gaps */}
          <div className="order-2">
            <div className="w-full h-full rounded-2xl overflow-hidden">
              <div className="w-full aspect-square lg:h-full lg:aspect-auto">
                <img
                  src="/empire-state-compressed.jpg"
                  alt="New York skyline"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Left: copy + textarea + button */}
          <div className="order-1">
            <h2 className="text-[26px] sm:text-[30px] md:text-[34px] leading-[1.15] font-bold tracking-tight text-gray-900">
              What’s one thing you wish we<br className="hidden lg:block" /> could’ve helped you with?
            </h2>

            <p className="mt-3 text-[14px] leading-5 text-gray-700">
              We’re always looking to improve; your thoughts can help us make Migrate Mate more
              useful for others.<span className="align-super text-[10px]">*</span>
            </p>

            <div className="mt-5">
              <div className="relative">
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={6}
                  placeholder=""    /* no placeholder per Figma */
                  className="w-full rounded-[12px] border border-gray-300 px-3 py-2 pr-[7.5rem] pb-9 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
                />
                <span className={`pointer-events-none absolute right-3 bottom-2 text-[12px] ${meetsMin ? 'text-emerald-600' : 'text-gray-500'}`}>
                  Min {minLen} characters ({Math.min(text.trim().length, 999)}/{minLen})
                </span>
              </div>
            </div>

            <button
              onClick={onContinue}
              disabled={!canContinue}
              className={`mt-6 w-full h-11 rounded-lg font-medium shadow-sm transition
                ${canContinue ? 'bg-gray-900 text-white hover:opacity-90'
                               : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'}`}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
