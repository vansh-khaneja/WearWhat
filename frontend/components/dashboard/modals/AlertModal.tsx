'use client';

import { useEffect, useRef } from 'react';

interface AlertModalProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

export default function AlertModal({ isOpen, message, onClose }: AlertModalProps) {
  const okButtonRef = useRef<HTMLButtonElement>(null);

  // Handle ESC key and focus management
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      // Focus OK button on open
      setTimeout(() => {
        okButtonRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="alert-modal-title"
      aria-describedby="alert-modal-message"
    >
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl scale-in animate-in slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 
          id="alert-modal-title"
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-3"
        >
          Alert
        </h3>
        <p 
          id="alert-modal-message"
          className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base"
        >
          {message}
        </p>
        <div className="flex justify-end">
          <button
            ref={okButtonRef}
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClose();
              }
            }}
            className="px-5 py-2.5 bg-[#0095da] hover:bg-[#007ab8] text-white rounded-lg font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
            aria-label="OK"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

