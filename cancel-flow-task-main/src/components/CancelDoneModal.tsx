// components/CancelDoneModal.tsx
'use client';

import ProgressSteps from '@/components/ProgressSteps';

type Contact = {
  name: string;
  email: string;
  avatarSrc: string; // square image in /public
};

export default function CancelDoneModal({
  open,
  onClose,
  onFinish,
  hasLawyer,
  heroSrc = '/empire-state-compressed.jpg',
  contact = {
    name: 'Mihailo Bozic',
    email: 'mihailo@migratemate.co',
    avatarSrc: '/mihailo-profile.jpeg',
  },
}: {
  open: boolean;
  onClose: () => void;
  onFinish: () => void;
  hasLawyer: boolean;
  heroSrc?: string;
  contact?: Contact;
}) {
  if (!open) return null;

  const headline = hasLawyer
    ? "Your cancellation’s all sorted, mate, no more charges."
    : "All done, your cancellation’s been processed.";

  return (
    <div className="modal__overlay">
      <div className="modal__scrim" onClick={onClose} />

      <div role="dialog" aria-modal="true" className="modal__panel">
        {/* Header */}
        <div className="modal__header">
          <div className="flex items-center gap-4">
            <h3 className="text-base font-semibold text-gray-900">Subscription Cancelled</h3>
            {/* show all steps as complete */}
            <ProgressSteps total={3} complete showLabel size="sm" />
          </div>
          <button aria-label="Close" onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__grid">
          {/* Left column */}
          <div>
            <h1 className="text-[42px] leading-[1.05] font-extrabold tracking-tight text-gray-900">
              {headline}
            </h1>

            {hasLawyer ? (
              // Contact variant
              <div className="mt-6 rounded-2xl border border-gray-200 bg-gray-50 p-5">
                <div className="flex items-center gap-3">
                  <img
                    src={contact.avatarSrc}
                    alt={contact.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                  <div className="leading-tight">
                    <p className="font-semibold text-gray-900">{contact.name}</p>
                    <p className="text-sm text-gray-600">&lt;{contact.email}&gt;</p>
                  </div>
                </div>

                <p className="mt-4 font-semibold text-gray-800">
                  I’ll be reaching out soon to help with the visa side of things.
                </p>
                <p className="mt-3 text-gray-700">
                  We’ve got your back, whether it’s questions, paperwork, or just figuring out your options.
                </p>
                <p className="mt-3 text-gray-700">
                  Keep an eye on your inbox, I’ll be in touch <u>shortly</u>.
                </p>
              </div>
            ) : (
              // Simple congrats variant
              <p className="mt-6 text-lg text-gray-700">
                We’re stoked to hear you’ve landed a job and sorted your visa.
                <br />
                Big congrats from the team. 🙌
              </p>
            )}

            <hr className="my-8 border-gray-200" />

            <button
              onClick={onFinish}
              className="w-full rounded-2xl bg-violet-500 text-white text-lg font-semibold py-4 shadow-lg
                         hover:bg-violet-600 active:bg-violet-700 transition"
            >
              Finish
            </button>
          </div>

          {/* Right column – shared image sizing */}
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
