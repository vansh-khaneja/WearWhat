'use client';

import { useState, memo } from 'react';
import { Shirt, AlertCircle } from 'lucide-react';
import type { Outfit } from '@/lib/api';

interface OutfitCardProps {
  outfit: Outfit;
  onClick: () => void;
  showCategory?: boolean;
  loading?: boolean;
}

// Loading Skeleton Component
function OutfitCardSkeleton() {
  return (
    <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 animate-pulse">
      <div className="w-full h-full bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200" />
      <div className="absolute top-2 left-2 w-16 h-5 bg-gray-300 rounded-md" />
    </div>
  );
}

function OutfitCard({ 
  outfit, 
  onClick, 
  showCategory = true,
  loading = false 
}: OutfitCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  if (loading) {
    return <OutfitCardSkeleton />;
  }

  return (
    <div 
      onClick={onClick}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2 focus:scale-[1.02]"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${outfit.tags?.category || 'outfit'} item`}
    >
      {/* Loading State */}
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 animate-pulse flex items-center justify-center">
          <Shirt className="w-12 h-12 text-gray-400" />
        </div>
      )}

      {/* Image */}
      {!imageError && (
        <img 
          src={outfit.image_url} 
          alt={`${outfit.tags?.category || 'Outfit'} ${outfit.outfit_id}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => {
            setImageLoaded(true);
          }}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
          }}
          loading="lazy"
          decoding="async"
        />
      )}

      {/* Error State */}
      {imageError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center p-4">
          <AlertCircle className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-xs text-gray-500 text-center font-medium">Failed to load image</p>
          <p className="text-xs text-gray-400 text-center mt-1">Click to view details</p>
        </div>
      )}

      {/* Category Badge */}
      {showCategory && outfit.tags?.category && !imageError && (
        <div className="absolute top-2 left-2 bg-[#0095da] text-white text-xs font-semibold px-2.5 py-1 rounded-md shadow-lg backdrop-blur-sm bg-opacity-95 z-10 transition-transform duration-200 group-hover:scale-105">
          {outfit.tags.category}
        </div>
      )}

      {/* Hover Overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end justify-center pb-3 pointer-events-none transition-all duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="text-white text-xs font-semibold bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
          View Details
        </div>
      </div>

      {/* Focus Ring Indicator */}
      <div className="absolute inset-0 ring-2 ring-[#0095da] ring-offset-2 rounded-lg opacity-0 focus-within:opacity-100 pointer-events-none transition-opacity" />
    </div>
  );
}

export default memo(OutfitCard);

