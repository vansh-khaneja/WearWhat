'use client';

import { useState } from 'react';
import { suggestOutfits } from '@/lib/api';
import type { WeeklyOutfitDay } from '@/lib/api';

export function useWeekPlanning(userId: string | null, temperature: number) {
  const [weeklyOutfits, setWeeklyOutfits] = useState<WeeklyOutfitDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 7 });

  const planWeek = async () => {
    if (!userId) {
      throw new Error('Please log in to plan your week');
    }

    setLoading(true);
    setProgress({ current: 0, total: 7 });
    setWeeklyOutfits([]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const generatedOutfits: WeeklyOutfitDay[] = [];

    try {
      // Generate outfits one by one to show progress
      for (let i = 0; i < daysOfWeek.length; i++) {
        setProgress({ current: i + 1, total: 7 });
        
        try {
          const response = await suggestOutfits(userId, temperature);
          if (response.outfits && response.outfits.length > 0) {
            // Use the first outfit from the suggestion
            const selectedOutfit = response.outfits[0];
            generatedOutfits.push({
              day: daysOfWeek[i],
              outfit: selectedOutfit,
              composite_image_url: response.composite_image_url || undefined
            });
          }
        } catch (error) {
          console.error(`Failed to generate outfit for ${daysOfWeek[i]}:`, error);
          // Continue with other days even if one fails
        }
        
        // Small delay to make progress visible
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setWeeklyOutfits(generatedOutfits);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 7 });
    }
  };

  return {
    weeklyOutfits,
    loading,
    progress,
    planWeek
  };
}

