'use client';

import { useMemo, useState } from 'react';
import ProgressSteps from '@/components/ProgressSteps';

function Pill({
  active, disabled, children, onClick,
}: {
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const state = disabled ? 'mm-pill-dis' : active ? 'mm-pill-on' : 'mm-pill-off';
  return (
    <button disabled={disabled} onClick={onClick} className={`mm-pill ${state} min-w-[64px]`}>
      {children}
    </button>
  );
}

export default function UsageSurveyModal({
  open,
  onBack,
  onClose,
  onContinue,
  fullPrice = 25,
  showOffer = false,         // show the green “Get 50% off” CTA (B-variant)
  showNudge = true,          // show the red helper copy under the title (per screenshot)
  onOfferClick, 
}: {
  open: boolean;
  onBack: () => void;
  onClose: () => void;
  onContinue: (answers: { applied: string; emailed: string; interviewed: string }) => void;
  fullPrice?: number;
  showOffer?: boolean;
  showNudge?: boolean;
  onOfferClick?: () => void;
}) {
  const [applied, setApplied] = useState('');
  const [emailed, setEmailed] = useState('');
  const [interviewed, setInterviewed] = useState('');

  const ready = useMemo(() => applied && emailed && interviewed, [applied, emailed, interviewed]);
  const half = (fullPrice / 2).toFixed(2);
  const handleOffer = () => {
    if (onOfferClick) onOfferClick();   // <-- no optional-call syntax
  };  


  if (!open) return null;

  return (
    <div className="mm-modal" role="dialog" aria-modal="true">
      <div className="mm-scrim" onClick={onClose} />
      <div className="mm-card">
        {/* Header */}
        <div className="mm-header">
          <button onClick={onBack} className="text-sm text-gray-700 hover:underline">‹ Back</button>
          <div className="flex items-center gap-3 text-sm text-gray-800">
            <span className="font-medium">Subscription Cancellation</span>
            <ProgressSteps current={2} total={3} size="sm" />
            <span>Step 2 of 3</span>
          </div>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">✕</button>
        </div>

        {/* Body */}
        <div className="mm-body">
          {/* Left column */}
          <div>
            <h1 className="text-[38px] leading-[1.05] font-extrabold tracking-tight text-gray-900">
              Help us understand how you were using Migrate Mate.
            </h1>

            {showNudge && (
              <p className="mt-3 text-sm text-red-600">
                Mind letting us know why you’re cancelling?
                <br />
                <span className="text-red-500/80">It helps us understand your experience and improve the platform.*</span>
              </p>
            )}

            {/* Q1 */}
            <div className="mt-6">
              <p className="text-sm text-gray-700">
                How many roles did you <u>apply</u> for through Migrate Mate?
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">

                {['0', '1–5', '6–20', '20+'].map((opt) => (
                  <Pill key={opt} active={applied === opt} onClick={() => setApplied(opt)}>
                    {opt}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="mt-5">
              <p className="text-sm text-gray-700">
                How many companies did you <u>email</u> directly?
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">

                {['0', '1–5', '6–20', '20+'].map((opt) => (
                  <Pill key={opt} active={emailed === opt} onClick={() => setEmailed(opt)}>
                    {opt}
                  </Pill>
                ))}
              </div>
            </div>

            {/* Q3 */}
            <div className="mt-5">
              <p className="text-sm text-gray-700">
                How many different companies did you <u>interview</u> with?
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-3">

                {['0', '1–2', '3–5', '5+'].map((opt) => (
                  <Pill key={opt} active={interviewed === opt} onClick={() => setInterviewed(opt)}>
                    {opt}
                  </Pill>
                ))}
              </div>
            </div>

            {/* CTAs (green then red, like Figma) */}
            <div className="mt-6 grid gap-3">
              {showOffer && (
                <button
                  type="button"
                  className="mm-btn-offer"
                  onClick={handleOffer} 
                >
                  Get 50% off | ${half}
                  <span className="text-white/70 line-through ml-1">${fullPrice}</span>
                </button>
              )}

              <button
                type="button"
                disabled={!ready}
                className="mm-btn-primary"
                onClick={() => onContinue({ applied, emailed, interviewed })}
              >
                Continue
              </button>
            </div>
          </div>

          {/* Right image (shared sizing) */}
          <div className="lg:pl-4">
            <div className="mm-img-wrap">
              <img
                src="/empire-state-compressed.jpg"
                alt="New York skyline"
                className="mm-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
