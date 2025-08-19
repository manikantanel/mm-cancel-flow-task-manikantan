// components/DownsellOfferModal.tsx
'use client';

import ProgressSteps from '@/components/ProgressSteps';

type Props = {
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  onAccept: () => void;
  onDecline: () => void;
  /** 25 or 29 (USD) */
  fullPrice?: number;
};

export default function DownsellOfferModal({
  open,
  onBack,
  onClose,
  onAccept,
  onDecline,
  fullPrice = 25,
}: Props) {
  if (!open) return null;

  const half = (fullPrice / 2).toFixed(2);

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true" aria-labelledby="downsell-title">
      <button className="modal__scrim" onClick={onClose} aria-label="Close" />

      <div className="modal__panel">
        {/* Header */}
        <div className="modal__header">
          <button onClick={onBack} className="text-sm text-gray-700 hover:underline">
            ‹ Back
          </button>

          <div className="flex items-center gap-3 text-sm text-gray-800">
            <span className="font-medium">Subscription Cancellation</span>
            <ProgressSteps current={1} total={3} size="sm" />
            <span>Step 1 of 3</span>
          </div>

          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__grid">
          {/* Left column */}
          <div>
            <h1 id="downsell-title" className="text-[40px] leading-[1.05] font-extrabold tracking-tight text-gray-900">
              We built this to help you land the job, this makes it a little easier.
            </h1>

            <p className="mt-4 text-lg text-gray-700">
              We’ve been there and we’re here to help you.
            </p>

            {/* Purple offer card */}
            <div className="mt-6 rounded-2xl border border-violet-300 bg-violet-100/60 p-5">
              <p className="text-center text-2xl font-semibold text-gray-900">
                Here’s <span className="underline font-bold">50% off</span> until you find a job.
              </p>

              <p className="mt-1 text-center text-xl font-bold text-violet-600">
                ${half}/month <span className="text-gray-400 line-through ml-1">${fullPrice}/month</span>
              </p>

              <button
                onClick={onAccept}
                className="mt-5 w-full h-11 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition"
              >
                Get 50% off
              </button>

              <p className="mt-2 text-center text-xs text-gray-500">
                You won’t be charged until your next billing date.
              </p>
            </div>

            <button
              onClick={onDecline}
              className="mt-4 w-full h-11 rounded-lg bg-gray-100 text-gray-800 font-medium hover:bg-gray-200 transition"
            >
              No thanks
            </button>
          </div>

          {/* Right image (shared sizing) */}
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
