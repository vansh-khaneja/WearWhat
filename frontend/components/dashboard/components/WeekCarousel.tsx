'use client';

import { Shirt, Thermometer, Calendar } from 'lucide-react';
import type { WeeklyOutfitDay } from '@/lib/api';

interface WeekCarouselProps {
  weeklyOutfits: WeeklyOutfitDay[];
  temperature?: number;
}

// Helper function to get date for a day of the week
function getDateForDay(dayName: string): string {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date();
  const currentDay = today.getDay();
  const targetDay = daysOfWeek.indexOf(dayName);
  
  // Calculate days difference
  let daysDiff = targetDay - currentDay;
  
  // If the target day is in the past this week, get next week's date
  if (daysDiff < 0) {
    daysDiff += 7;
  }
  
  // If it's today, show today; otherwise show the date
  if (daysDiff === 0) {
    const targetDate = new Date(today);
    return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
  
  const targetDate = new Date(today);
  targetDate.setDate(today.getDate() + daysDiff);
  
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function WeekCarousel({ weeklyOutfits, temperature = 22 }: WeekCarouselProps) {
  return (
    <div className="w-full">
      {/* Grid Layout - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {weeklyOutfits.map((dayOutfit, index) => {
          const dateStr = getDateForDay(dayOutfit.day);
          return (
            <div 
              key={index}
              className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-full">
                {/* Day Header with Date and Temperature */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {dayOutfit.day}
                      </h3>
                      <div className="flex items-center gap-1.5 text-sm text-gray-600">
                        <Calendar className="w-3.5 h-3.5" />
                        <span className="font-medium">{dateStr}</span>
                      </div>
                    </div>
                    {temperature && (
                      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-200">
                        <Thermometer className="w-4 h-4 text-orange-600" />
                        <span className="text-sm font-bold text-orange-700">{temperature}°C</span>
                      </div>
                    )}
                  </div>
                  <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

              {/* Outfit Image */}
              <div className="w-full bg-gray-100 rounded-lg overflow-hidden mb-3 shadow-inner" style={{ height: '320px', maxHeight: '320px', minHeight: '320px' }}>
                {(dayOutfit.composite_image_url || dayOutfit.outfit.image_url) ? (
                  <img 
                    src={dayOutfit.composite_image_url || dayOutfit.outfit.image_url} 
                    alt={`${dayOutfit.day} outfit`}
                    className="w-full h-full object-contain"
                    style={{ 
                      display: 'block',
                      width: '100%',
                      height: '100%',
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain'
                    }}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent && !parent.querySelector('.error-message')) {
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'error-message w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 text-xs p-2 text-center';
                        errorDiv.textContent = 'Failed to load';
                        parent.appendChild(errorDiv);
                      }
                    }}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                    <Shirt className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Day Footer Info */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <div className="w-1.5 h-1.5 bg-[#0095da] rounded-full"></div>
                <span>AI Suggested Outfit</span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}

