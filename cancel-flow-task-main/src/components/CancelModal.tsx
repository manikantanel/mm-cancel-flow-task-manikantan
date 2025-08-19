// components/CancelModal.tsx
'use client';

type Props = {
  open: boolean;
  onClose: () => void;
  onFoundJob: () => void;
  onStillLooking: () => void;
};

export default function CancelModal({
  open,
  onClose,
  onFoundJob,
  onStillLooking,
}: Props) {
  if (!open) return null;

  return (
    <div className="modal__overlay">
      <div className="modal__scrim" onClick={onClose} />

      <div role="dialog" aria-modal="true" className="modal__panel">
        {/* Header */}
        <div className="modal__header">
          <p className="text-sm font-medium text-gray-800">Subscription Cancellation</p>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__grid">
          {/* Left column */}
          <div>
            <h2 className="text-[28px] leading-tight font-bold text-gray-900">
              Hey mate,
              <br />Quick one before you go.
            </h2>
            <p className="mt-2 text-[22px] italic font-semibold text-gray-900">
              Have you found a job yet?
            </p>
            <p className="mt-3 text-sm text-gray-700">
              Whatever your answer, we just want to help you take the next step.
            </p>

            <div className="mt-5 space-y-3">
              <button
                onClick={onFoundJob}
                className="w-full h-11 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50"
              >
                Yes, I’ve found a job
              </button>
              <button
                onClick={onStillLooking}
                className="w-full h-11 rounded-lg border border-gray-300 text-gray-900 hover:bg-gray-50"
              >
                Not yet — I’m still looking
              </button>
            </div>
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
