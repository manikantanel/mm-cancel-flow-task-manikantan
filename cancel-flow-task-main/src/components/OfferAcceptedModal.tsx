'use client';

export default function OfferAcceptedModal({
  open,
  onClose,
  onGoToProfile,
  // optional display data
  daysLeft = 14,
  nextStartDate = 'XX date',
  nextPrice = 12.5,
  heroSrc = '/empire-state-compressed.jpg',
}: {
  open: boolean;
  onClose: () => void;
  onGoToProfile: () => void;
  daysLeft?: number;
  nextStartDate?: string;
  nextPrice?: number;
  heroSrc?: string;
}) {
  if (!open) return null;

  return (
    <div className="modal__overlay" role="dialog" aria-modal="true">
      <div className="modal__scrim" onClick={onClose} />
      <div className="modal__panel">
        {/* Header */}
        <div className="modal__header">
          <span className="text-sm font-medium text-gray-900">Subscription</span>
          <button onClick={onClose} aria-label="Close" className="p-1 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__grid">
          {/* Left */}
          <div>
            <h1 className="text-[36px] leading-[1.05] font-extrabold tracking-tight text-gray-900">
              Great choice, mate!
            </h1>

            <p className="mt-4 text-2xl leading-snug text-gray-900">
              You're still on the path to your dream role.{' '}
              <span className="text-violet-600 font-bold">Let’s make it happen together!</span>
            </p>

            <p className="mt-6 text-gray-700">
              You’ve got {daysLeft} days left on your current plan.
              <br />
              Starting from {nextStartDate}, your monthly payment will be ${nextPrice.toFixed(2)}.
            </p>
            <p className="mt-3 text-sm text-gray-500">You can cancel anytime before then.</p>

            <hr className="my-8 border-gray-200" />

            <button
              onClick={onGoToProfile}
              className="w-full rounded-2xl bg-violet-500 text-white text-lg font-semibold py-4 shadow-lg
                         hover:bg-violet-600 active:bg-violet-700 transition"
            >
              Land your dream role
            </button>
          </div>

          {/* Right image (uniform sizing via shared classes) */}
          <div className="modal__imgWrap">
            <div className="modal__imgBox">
              <img src={heroSrc} alt="New York skyline" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
