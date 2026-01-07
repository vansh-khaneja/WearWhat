'use client';

import { Sparkles, MessageCircle } from 'lucide-react';
import TemperatureDisplay from '../components/TemperatureDisplay';
import QueryInput from '../components/QueryInput';
import type { Outfit } from '@/lib/api';

interface TodaysSuggestionsProps {
  temperature: number;
  condition?: string;
  onGetSuggestions: (query?: string) => Promise<void>;
  suggestedOutfits: Outfit[];
  compositeImageUrl: string | null;
  loadingSuggestions: boolean;
  query: string;
  onQueryChange: (query: string) => void;
  onSuggestionQuerySubmit: (query: string) => Promise<void>;
  suggestionQuery: string;
  onSuggestionQueryChange: (query: string) => void;
}

export default function TodaysSuggestions({
  temperature,
  condition,
  onGetSuggestions,
  suggestedOutfits,
  compositeImageUrl,
  loadingSuggestions,
  query,
  onQueryChange,
  onSuggestionQuerySubmit,
  suggestionQuery,
  onSuggestionQueryChange
}: TodaysSuggestionsProps) {
  if (loadingSuggestions && suggestedOutfits.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <p className="text-gray-600">Getting your outfit suggestions...</p>
      </div>
    );
  }

  if (suggestedOutfits.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl border border-gray-200 shadow-xl p-8 md:p-12">
        <div className="max-w-2xl mx-auto">
          {/* Icon with gradient background */}
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0095da] to-[#007ab8] rounded-3xl transform rotate-6"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0095da] to-[#007ab8] rounded-3xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Get today's outfit suggestions
          </h2>
          <p className="text-gray-600 mb-8 text-center text-lg">
            AI-powered outfit recommendations tailored to your style
          </p>
          
          {/* Temperature Display */}
          <div className="mb-6">
            <TemperatureDisplay temperature={temperature} condition={condition} />
          </div>

          {/* Query Input */}
          <div className="mb-8">
            <QueryInput
              value={query}
              onChange={onQueryChange}
              onSubmit={async (value) => {
                await onGetSuggestions(value);
              }}
            />
          </div>

          <button 
            onClick={() => onGetSuggestions()}
            disabled={loadingSuggestions}
            className="w-full bg-gradient-to-r from-[#0095da] to-[#007ab8] hover:from-[#007ab8] hover:to-[#006a9e] text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Sparkles className="w-6 h-6" />
            {loadingSuggestions ? 'Getting Suggestions...' : 'Get Suggestions'}
          </button>
          
          {/* Features */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Weather-aware</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Style-matched</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Schedule-optimized</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      {/* Left Side - Suggested Outfit Image */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Your Suggested Outfit
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">AI-curated just for you</p>
          </div>
          <button 
            onClick={() => onGetSuggestions()}
            disabled={loadingSuggestions}
            className="bg-gradient-to-r from-[#0095da] to-[#007ab8] hover:from-[#007ab8] hover:to-[#006a9e] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-semibold flex items-center gap-2 transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
            aria-label={loadingSuggestions ? 'Loading suggestions' : 'Refresh suggestions'}
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
            {loadingSuggestions ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        {/* Composite Image Display */}
        {loadingSuggestions ? (
          <div className="w-full min-h-[300px] sm:min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300 relative">
            <div className="absolute inset-0 bg-white/80 rounded-xl sm:rounded-2xl flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="text-center">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-[#0095da] border-t-transparent mx-auto mb-3"></div>
                <p className="text-sm sm:text-base text-gray-600 font-medium">Loading new outfit...</p>
              </div>
            </div>
            {compositeImageUrl && (
              <img 
                src={compositeImageUrl} 
                alt="Previous outfit"
                className="w-full h-full object-contain opacity-30 rounded-xl sm:rounded-2xl"
              />
            )}
          </div>
        ) : compositeImageUrl ? (
          <div className="w-full overflow-hidden rounded-xl sm:rounded-2xl">
            <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl w-full border-2 sm:border-4 border-gray-100">
              <img 
                src={compositeImageUrl} 
                alt="Suggested outfit composite"
                className="w-full h-auto object-contain max-h-[60vh] sm:max-h-[70vh]"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement?.parentElement;
                  if (parent && !parent.querySelector('.error-message')) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'error-message w-full p-8 flex items-center justify-center bg-gray-200 text-gray-500 rounded-xl sm:rounded-2xl';
                    errorDiv.textContent = 'Failed to load composite image';
                    parent.appendChild(errorDiv);
                  }
                }}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        ) : (
          <div className="w-full min-h-[300px] sm:min-h-[400px] bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
            <div className="text-center">
              <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm sm:text-base text-gray-500 font-medium">No suggestion available</p>
            </div>
          </div>
        )}
      </div>

      {/* Right Side - Chat/Query Interface */}
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 flex flex-col min-h-[400px] lg:min-h-[500px]">
        <div className="mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Get New Outfit
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Enter your style preference or occasion
          </p>
        </div>
        
        {/* Temperature Display - Only in Chat Column */}
        <div className="mb-4 sm:mb-6">
          <TemperatureDisplay temperature={temperature} condition={condition} variant="compact" />
        </div>

        {/* Query Input */}
        <div className="mt-auto">
          <QueryInput
            value={suggestionQuery}
            onChange={onSuggestionQueryChange}
            onSubmit={onSuggestionQuerySubmit}
            placeholder="e.g., outfit for party, casual wear, formal outfit..."
            variant="inline"
            disabled={loadingSuggestions}
          />
        </div>
      </div>
    </div>
  );
}

