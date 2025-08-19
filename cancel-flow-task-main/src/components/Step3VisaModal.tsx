'use client';

import { useMemo, useState } from 'react';
import ProgressSteps from '@/components/ProgressSteps';

type FoundVia = 'yes_mm' | 'no_mm';

export default function Step3VisaModal({
  open,
  onBack,
  onComplete,
  foundVia,
}: {
  open: boolean;
  onBack: () => void;
  onComplete: (payload: { hasLawyer: boolean; visaChoice: string }) => void;
  foundVia: FoundVia;
}) {
  const [hasLawyer, setHasLawyer] = useState<boolean | null>(null);
  const [visa, setVisa] = useState('');

  // Button enabled only when: a choice is made AND visa has text
  const canComplete = useMemo(
    () => hasLawyer !== null && visa.trim().length > 0,
    [hasLawyer, visa]
  );

  // custom radio
const radioClass =
  "relative inline-grid place-content-center appearance-none select-none " +
  "h-5 w-5 rounded-full border-2 border-black bg-white " +           
  "checked:bg-black " +                                               
  "focus:outline-none focus:ring-2 focus:ring-black/20 " +            
  "after:content-[''] after:block after:rounded-full after:bg-white " + 
  "after:w-1.5 after:h-1.5 after:scale-0 checked:after:scale-100 " +  
  "after:transition-transform";


  
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
          <button onClick={onBack} className="text-sm text-gray-800 hover:underline">
            ‹ Back
          </button>
          <div className="flex items-center gap-3 text-sm text-gray-800">
            <span className="font-medium">Subscription Cancellation</span>
            <ProgressSteps current={3} total={3} size="sm" />

            <span>Step 3 of 3</span>
          </div>
          <button onClick={onBack} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6 items-start">
          {/* Left column */}
          <div className="order-1">
            {foundVia === 'yes_mm' ? (
              <h2 className="text-[34px] leading-[1.15] font-bold tracking-tight text-gray-900">
                We helped you land the job, now
                <br />
                let’s help you secure your visa.
              </h2>
            ) : (
              <>
                <h2 className="text-[34px] leading-[1.15] font-bold tracking-tight text-gray-900">
                  You landed the job!
                  <br />
                  <span className="italic font-semibold">That’s what we live for.</span>
                </h2>
                <p className="mt-3 text-[14px] font-bold text-gray-700">
                  Even if it wasn’t through Migrate Mate,
                  <br />
                  let us help get your visa sorted.
                </p>
              </>
            )}

            {/* Main question */}
            <div className="mt-6">
              <p className="text-sm font-medium text-gray-800">
                Is your company providing an immigration lawyer to help with your visa?
                <span className="align-super text-[10px]">*</span>
              </p>

              {/* Radios (show initial set, then a compact “selected” row) */}
              {hasLawyer === null ? (
                <fieldset className="mt-3 space-y-3">
  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="hasLawyer"
      className="radio-mm"
      onChange={() => { setHasLawyer(true); setVisa(''); }}
      checked={hasLawyer === true}
    />
    <span className="text-sm text-gray-900">Yes</span>
  </label>

  <label className="flex items-center gap-3 cursor-pointer">
    <input
      type="radio"
      name="hasLawyer"
      className="radio-mm"
      onChange={() => { setHasLawyer(false); setVisa(''); }}
      checked={hasLawyer === false}
    />
    <span className="text-sm text-gray-900">No</span>
  </label>
</fieldset>


              ) : (
                <div className="mt-3 flex items-center gap-3">
                  <span aria-hidden className="inline-block h-3.5 w-3.5 rounded-full bg-gray-900" />
                  <span className="text-sm text-gray-900">{hasLawyer ? 'Yes' : 'No'}</span>
                </div>
              )}

              {/* Branch content */}
              {hasLawyer === true && (
                <div className="mt-5">
                  <p className="text-sm text-gray-700">What visa will you be applying for?*</p>
                  <input
                    type="text"
                    value={visa}
                    onChange={(e) => setVisa(e.target.value)}
                    placeholder="Enter visa type…"
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              )}

              {hasLawyer === false && (
                <div className="mt-5">
                  <p className="text-sm text-gray-700">
                    We can connect you with one of our trusted partners.
                    <br />
                    Which visa would you like to apply for?*
                  </p>
                  <input
                    type="text"
                    value={visa}
                    onChange={(e) => setVisa(e.target.value)}
                    placeholder="Enter visa type…"
                    className="mt-2 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  />
                </div>
              )}

              {/* CTA */}
              <button
                disabled={!canComplete}
                aria-disabled={!canComplete}
                onClick={() => {
                  if (!canComplete) return; // safety
                  onComplete({
                    hasLawyer: Boolean(hasLawyer),
                    visaChoice: visa.trim(),
                  });
                }}
                className={`mt-8 w-full h-11 rounded-lg font-medium shadow-sm transition ${
                  canComplete
                    ? 'bg-gray-900 text-white hover:opacity-90'
                    : 'bg-gray-100 text-gray-500 cursor-not-allowed border border-gray-200'
                }`}
              >
                Complete cancellation
              </button>
            </div>
          </div>

          {/* Right column: image */}
          <div className="order-2">
            <div className="overflow-hidden rounded-2xl w-full aspect-square lg:aspect-auto lg:h-full">
              <img
                src="/empire-state-compressed.jpg"
                alt="New York skyline"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
