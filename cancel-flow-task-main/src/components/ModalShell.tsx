'use client';

import { ReactNode } from 'react';

type ModalShellProps = {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  headerMiddle?: ReactNode;   // e.g., "Subscription Cancellation + Progress"
  children: ReactNode;
};

export default function ModalShell({
  open,
  onClose,
  onBack,
  headerMiddle,
  children,
}: ModalShellProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] grid place-items-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        className="
          relative z-[71]
          w-[min(96vw,1120px)]
          max-h-[92vh]
          rounded-3xl bg-white shadow-2xl overflow-hidden
        "
      >
        {/* Sticky header */}
        <div className="sticky top-0 flex items-center justify-between px-4 sm:px-6 py-3 border-b bg-white">
          {onBack ? (
            <button
              onClick={onBack}
              className="text-sm text-gray-700 hover:underline"
            >
              ‹ Back
            </button>
          ) : (
            <span className="w-10" />
          )}
          <div className="min-w-0">{headerMiddle}</div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded hover:bg-gray-100"
          >
            ✕
          </button>
        </div>

        {/* Body (scrolls independently) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 p-5 sm:p-6 overflow-y-auto max-h-[calc(92vh-52px)]">
          {children}
        </div>
      </div>
    </div>
  );
}
