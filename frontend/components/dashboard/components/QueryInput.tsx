'use client';

import { MessageCircle, Send } from 'lucide-react';
import { useState } from 'react';

interface QueryInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => void;
  placeholder?: string;
  examples?: string[];
  disabled?: boolean;
  variant?: 'default' | 'inline';
}

export default function QueryInput({
  value,
  onChange,
  onSubmit,
  placeholder = "e.g., casual, formal, summer dress, office wear...",
  examples = ['outfit for party', 'casual wear', 'formal outfit'],
  disabled = false,
  variant = 'default'
}: QueryInputProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim() && !disabled) {
      onSubmit(value.trim());
    }
  };

  if (variant === 'inline') {
    return (
      <form onSubmit={handleSubmit} className="flex gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-5 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none text-gray-900 bg-white shadow-sm transition-all hover:border-gray-300"
            disabled={disabled}
          />
        </div>
        <button
          type="submit"
          disabled={!value.trim() || disabled}
          className="bg-gradient-to-r from-[#0095da] to-[#007ab8] hover:from-[#007ab8] hover:to-[#006a9e] text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
          aria-label="Get outfit"
        >
          <Send className="w-5 h-5" />
          Get Outfit
        </button>
      </form>
    );
  }

  return (
    <div>
      <label htmlFor="query" className="block text-sm font-semibold text-gray-700 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <MessageCircle className="w-4 h-4 text-blue-600" />
          </div>
          <span>Style Preference <span className="text-gray-400 font-normal">(Optional)</span></span>
        </div>
      </label>
      <div className="relative">
        <input
          type="text"
          id="query"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-5 py-3.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none text-gray-900 bg-white shadow-sm transition-all hover:border-gray-300"
          placeholder={placeholder}
          disabled={disabled}
        />
      </div>
      <p className="mt-2 text-xs text-gray-500">
        💡 Add specific style preferences or occasion requirements
      </p>
      {examples.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-xs text-gray-500 font-medium">Examples:</span>
          {examples.map((example, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onChange(example)}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-1"
              aria-label={`Use example: ${example}`}
            >
              {example}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

