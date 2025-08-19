// components/CancelCompleteModal.tsx
'use client';

import ProgressSteps from '@/components/ProgressSteps';

export default function CancelCompleteModal({
  open,
  onBack,            // optional back arrow
  onClose,           // X button
  onBackToJobs,      // CTA
  endDate = 'XX date',
  heroSrc = '/empire-state-compressed.jpg',
}: {
  open: boolean;
  onBack?: () => void;
  onClose: () => void;
  onBackToJobs: () => void;
  endDate?: string;
  heroSrc?: string;
}) {
  if (!open) return null;

  return (
    <div className="modal__overlay">
      <div className="modal__scrim" onClick={onClose} />
      <div role="dialog" aria-modal="true" className="modal__panel">
        {/* Header */}
        <div className="modal__header">
          <button
            onClick={onBack}
            className={`text-sm text-gray-700 hover:underline ${onBack ? '' : 'invisible'}`}
          >
            ‹ Back
          </button>

          <div className="flex items-center gap-3 text-sm text-gray-800">
            <span className="font-medium">Subscription Cancelled</span>
            {/* current=4 renders all three bars completed */}
            <ProgressSteps current={4} total={3} size="sm" />
            <span>Completed</span>
          </div>

          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__grid">
          {/* Left column */}
          <div>
            <h1 className="text-[40px] leading-[1.05] font-extrabold tracking-tight text-gray-900">
              Sorry to see you go, mate.
            </h1>

            <p className="mt-3 text-[24px] leading-tight font-semibold text-gray-900">
              Thanks for being with us, and you’re always welcome back.
            </p>

            <p className="mt-5 text-gray-700">
              Your subscription is set to end on <span className="font-semibold">{endDate}</span>.
              <br />
              You’ll still have full access until then. No further charges after that.
            </p>

            <p className="mt-3 text-sm text-gray-500">
              Changed your mind? You can reactivate anytime before your end date.
            </p>

            <hr className="my-6 border-gray-200" />

            <button
              onClick={onBackToJobs}
              className="w-full h-12 rounded-xl bg-violet-500 text-white text-[16px] font-semibold
                         shadow-md hover:bg-violet-600 active:bg-violet-700 transition"
            >
              Back to Jobs
            </button>
          </div>

          {/* Right column – shared image sizing */}
          <div className="modal__imgWrap">
            <div className="modal__imgBox">
              <img src={heroSrc} alt="City skyline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
