'use client';

import { Shirt, Plus } from 'lucide-react';
import OutfitCard from '../components/OutfitCard';
import UploadButton from '../components/UploadButton';
import type { Outfit } from '@/lib/api';

interface MyWardrobeProps {
  outfits: Outfit[];
  loadingOutfits: boolean;
  onOutfitClick: (outfit: Outfit) => void;
  onAddItemClick: () => void;
}

export default function MyWardrobe({
  outfits,
  loadingOutfits,
  onOutfitClick,
  onAddItemClick
}: MyWardrobeProps) {
  if (loadingOutfits) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <p className="text-gray-600">Loading your wardrobe...</p>
      </div>
    );
  }

  if (outfits.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#0095da] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Shirt className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Your wardrobe is empty
          </h2>
          <p className="text-gray-600 mb-2">
            Start building your digital wardrobe by adding your clothing items
          </p>
          <button 
            onClick={onAddItemClick}
            className="mt-6 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add First Item
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          {outfits.length} {outfits.length === 1 ? 'item' : 'items'}
        </h2>
        <UploadButton
          onClick={onAddItemClick}
          uploading={false}
          variant="small"
        />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
        {outfits.map((outfit) => (
          <OutfitCard
            key={outfit.outfit_id}
            outfit={outfit}
            onClick={() => onOutfitClick(outfit)}
          />
        ))}
      </div>
    </div>
  );
}

