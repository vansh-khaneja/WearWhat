'use client';

import { Plus } from 'lucide-react';

interface UploadButtonProps {
  onClick: () => void;
  uploading: boolean;
  message?: { type: 'success' | 'error'; text: string } | null;
  variant?: 'default' | 'small';
}

export default function UploadButton({ 
  onClick, 
  uploading, 
  message,
  variant = 'default' 
}: UploadButtonProps) {
  if (variant === 'small') {
    return (
      <>
        <button 
          onClick={onClick}
          className="bg-[#0095da] hover:bg-[#007ab8] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
        {message && (
          <div className={`mt-2 text-xs px-2 py-1 rounded ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <button 
        onClick={onClick}
        disabled={uploading}
        className="w-full bg-[#0095da] hover:bg-[#007ab8] text-white px-3 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Plus className="w-4 h-4" />
        {uploading ? 'Uploading...' : 'Add Item'}
      </button>
      {message && (
        <div className={`mt-2 text-xs px-2 py-1 rounded ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700' 
            : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}
    </>
  );
}

