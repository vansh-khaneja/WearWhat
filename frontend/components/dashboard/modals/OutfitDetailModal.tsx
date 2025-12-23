'use client';

import { useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import type { Outfit } from '@/lib/api';
import { genericAttributes, specificAttributes } from '@/lib/tags';

interface OutfitDetailModalProps {
  outfit: Outfit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (tags: Record<string, any>) => Promise<void>;
  onDelete: () => void;
  tags: Record<string, any>;
  onTagsChange: (tags: Record<string, any>) => void;
  originalTags: Record<string, any>;
}

export default function OutfitDetailModal({
  outfit,
  isOpen,
  onClose,
  onSave,
  onDelete,
  tags,
  onTagsChange,
  originalTags
}: OutfitDetailModalProps) {
  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !outfit) return null;

  const handleSave = async () => {
    await onSave(tags);
  };

  const hasChanges = JSON.stringify(tags) !== JSON.stringify(originalTags);

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="outfit-modal-title"
    >
      <div 
        className="bg-white rounded-none sm:rounded-2xl max-w-6xl w-full h-full sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col md:flex-row shadow-2xl scale-in animate-in slide-in-from-bottom-2 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6 md:p-8 min-h-[40vh] md:min-h-0">
          <img 
            src={outfit.image_url} 
            alt={`Outfit ${outfit.outfit_id}`}
            className="max-w-full max-h-[40vh] sm:max-h-[70vh] object-contain rounded-lg shadow-lg"
            loading="eager"
          />
        </div>

        {/* Tags Section */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 overflow-y-auto max-h-[60vh] sm:max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between mb-4 sm:mb-6 sticky top-0 bg-white pb-4 border-b border-gray-200 -mt-4 pt-4 -mx-4 sm:-mx-6 px-4 sm:px-6 z-10">
            <h2 id="outfit-modal-title" className="text-xl sm:text-2xl font-bold text-gray-900">Item Details</h2>
            <button
              onClick={onClose}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onClose();
                }
              }}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2 -mr-2">
            {/* Generic Attributes - Show all options */}
            {Object.entries(genericAttributes).map(([key, options]) => {
              const selectedValue = tags[key];
              const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
              
              return (
                <div key={key} className="pb-4 border-b border-gray-100 last:border-0">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-700">{displayKey}</h3>
                    {selectedValue && (
                      <span className="text-xs sm:text-sm text-[#0095da] font-medium bg-[#0095da]/10 px-2 py-1 rounded-md">{selectedValue}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {options.map((option) => {
                      const isSelected = selectedValue === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            onTagsChange({
                              ...tags,
                              [key]: option
                            });
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onTagsChange({
                                ...tags,
                                [key]: option
                              });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-1 ${
                            isSelected
                              ? 'bg-[#0095da] text-white border-2 border-[#0095da] shadow-sm scale-105'
                              : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0095da] hover:bg-[#0095da]/5 hover:scale-105 active:scale-95'
                          }`}
                          aria-pressed={isSelected}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Specific Attributes - Show all options based on categoryGroup */}
            {tags?.categoryGroup && specificAttributes[tags.categoryGroup] && (
              Object.entries(specificAttributes[tags.categoryGroup]).map(([attrKey, options]) => {
                if (options.length === 0) return null;
                
                // Try to find the selected value by checking different key variations
                const camelKey = attrKey.charAt(0).toLowerCase() + attrKey.slice(1);
                const selectedValue = tags[attrKey] || 
                                    tags[camelKey] ||
                                    Object.entries(tags || {}).find(
                                      ([key]) => key.toLowerCase() === attrKey.toLowerCase()
                                    )?.[1];
                
                const displayKey = attrKey
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .trim();
                
                return (
                  <div key={attrKey} className="pb-4 border-b border-gray-100 last:border-0">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700">{displayKey}</h3>
                      {selectedValue && (
                        <span className="text-xs sm:text-sm text-[#0095da] font-medium bg-[#0095da]/10 px-2 py-1 rounded-md">{String(selectedValue)}</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {options.map((option) => {
                        const isSelected = selectedValue && String(selectedValue).toLowerCase() === option.toLowerCase();
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              // Update the tag - try both camelCase and original key
                              const updateKey = tags[attrKey] !== undefined ? attrKey : 
                                               tags[camelKey] !== undefined ? camelKey :
                                               Object.keys(tags).find(k => k.toLowerCase() === attrKey.toLowerCase()) || attrKey;
                              onTagsChange({
                                ...tags,
                                [updateKey]: option
                              });
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                const updateKey = tags[attrKey] !== undefined ? attrKey : 
                                                 tags[camelKey] !== undefined ? camelKey :
                                                 Object.keys(tags).find(k => k.toLowerCase() === attrKey.toLowerCase()) || attrKey;
                                onTagsChange({
                                  ...tags,
                                  [updateKey]: option
                                });
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-1 ${
                              isSelected
                                ? 'bg-[#0095da] text-white border-2 border-[#0095da] shadow-sm scale-105'
                                : 'bg-white text-gray-700 border border-gray-300 hover:border-[#0095da] hover:bg-[#0095da]/5 hover:scale-105 active:scale-95'
                            }`}
                            aria-pressed={isSelected}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-4 sm:pt-6 border-t border-gray-200 flex gap-3 items-center sticky bottom-0 bg-white -mb-4 sm:-mb-6 pb-4 sm:pb-6 -mx-4 sm:-mx-6 px-4 sm:px-6">
            <button
              onClick={onDelete}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onDelete();
                }
              }}
              className="p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center"
              title="Delete item"
              aria-label="Delete item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && hasChanges) {
                  e.preventDefault();
                  handleSave();
                }
              }}
              className="flex-1 bg-[#0095da] hover:bg-[#007ab8] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
              aria-label="Save changes"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

