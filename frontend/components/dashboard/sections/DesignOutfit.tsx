'use client';

import { useState, useMemo } from 'react';
import { Palette, X, Save, Shirt, Sparkles } from 'lucide-react';
import type { Outfit } from '@/lib/api';
import OutfitCard from '../components/OutfitCard';

interface DesignOutfitProps {
  outfits: Outfit[];
  loadingOutfits: boolean;
}

type OutfitCategory = 'upperWear' | 'bottomWear' | 'outerWear' | 'footwear' | 'otherItems' | null;

export default function DesignOutfit({ outfits, loadingOutfits }: DesignOutfitProps) {
  const [selectedItems, setSelectedItems] = useState<{
    upperWear: Outfit | null;
    bottomWear: Outfit | null;
    outerWear: Outfit | null;
    footwear: Outfit | null;
    otherItems: Outfit | null;
  }>({
    upperWear: null,
    bottomWear: null,
    outerWear: null,
    footwear: null,
    otherItems: null
  });
  const [activeCategory, setActiveCategory] = useState<OutfitCategory>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Categorize outfits based on their tags
  const categorizedOutfits = useMemo(() => {
    const categories: Record<string, Outfit[]> = {
      upperWear: [],
      bottomWear: [],
      outerWear: [],
      footwear: [],
      otherItems: []
    };

    outfits.forEach(outfit => {
      const categoryGroup = outfit.tags?.categoryGroup as string;
      if (categoryGroup && categories[categoryGroup]) {
        categories[categoryGroup].push(outfit);
      } else {
        categories.otherItems.push(outfit);
      }
    });

    return categories;
  }, [outfits]);

  const handleSelectItem = (category: string, outfit: Outfit) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: outfit
    }));
    setShowPreview(true);
  };

  const handleRemoveItem = (category: string) => {
    setSelectedItems(prev => ({
      ...prev,
      [category]: null
    }));
  };

  const handleSaveOutfit = () => {
    // TODO: Implement save functionality
    console.log('Saving outfit:', selectedItems);
    alert('Outfit saved! (Feature coming soon)');
  };

  const hasSelectedItems = Object.values(selectedItems).some(item => item !== null);
  const selectedItemsArray = Object.values(selectedItems).filter(item => item !== null) as Outfit[];

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
            <Palette className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Design your outfit
          </h2>
          <p className="text-gray-600 mb-2">
            Add items to your wardrobe first to start designing outfits
          </p>
        </div>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    upperWear: 'Upper Wear',
    bottomWear: 'Bottom Wear',
    outerWear: 'Outer Wear',
    footwear: 'Footwear',
    otherItems: 'Accessories & Others'
  };

  return (
    <div className="space-y-6">
      {/* Selected Items Preview */}
      {hasSelectedItems && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Your Outfit Design</h2>
            <button
              onClick={handleSaveOutfit}
              className="bg-[#0095da] hover:bg-[#007ab8] text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors text-sm"
            >
              <Save className="w-4 h-4" />
              Save Outfit
            </button>
          </div>
          
          {/* Preview Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            {Object.entries(selectedItems).map(([category, outfit]) => (
              <div key={category} className="relative">
                {outfit ? (
                  <div className="relative group">
                    <div className="aspect-square rounded-lg overflow-hidden border-2 border-[#0095da] bg-gray-100">
                      <img
                        src={outfit.image_url}
                        alt={category}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveItem(category)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <p className="text-xs text-gray-600 mt-1 text-center">{categoryLabels[category]}</p>
                  </div>
                ) : (
                  <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center">
                    <span className="text-xs text-gray-400 text-center px-2">{categoryLabels[category]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Composite Preview */}
          {showPreview && selectedItemsArray.length > 0 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-[#0095da]" />
                <span className="text-sm font-semibold text-gray-700">Combined Preview</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {selectedItemsArray.map((outfit, index) => (
                  <img
                    key={index}
                    src={outfit.image_url}
                    alt={`Item ${index + 1}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Category Selection */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Select Items by Category</h2>
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.keys(categoryLabels).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(activeCategory === category ? null : category as OutfitCategory)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeCategory === category
                  ? 'bg-[#0095da] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {categoryLabels[category]} ({categorizedOutfits[category]?.length || 0})
            </button>
          ))}
        </div>

        {/* Items Grid */}
        {activeCategory ? (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {categoryLabels[activeCategory]} Items
            </h3>
            {categorizedOutfits[activeCategory]?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {categorizedOutfits[activeCategory].map((outfit) => {
                  const isSelected = selectedItems[activeCategory]?.outfit_id === outfit.outfit_id;
                  return (
                    <div
                      key={outfit.outfit_id}
                      className={`relative cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-[#0095da] ring-offset-2' : ''
                      }`}
                      onClick={() => handleSelectItem(activeCategory, outfit)}
                    >
                      <OutfitCard
                        outfit={outfit}
                        onClick={() => {}}
                        showCategory={false}
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#0095da] text-white rounded-full flex items-center justify-center">
                          <span className="text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Shirt className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>No {categoryLabels[activeCategory]} items in your wardrobe</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <Palette className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Select a category to start designing</p>
            <p className="text-sm mt-2">Choose items from different categories to create your perfect outfit</p>
          </div>
        )}
      </div>
    </div>
  );
}
