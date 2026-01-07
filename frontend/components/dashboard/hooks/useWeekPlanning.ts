'use client';

import { useState, useEffect } from 'react';
import { createWeeklyPlan, getWeeklyPlan } from '@/lib/api';
import type { WeeklyPlan, DailyPlan, WeeklyOutfitDay } from '@/lib/api';

export function useWeekPlanning(temperature: number) {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 3 });

  // Load existing weekly plan on mount
  useEffect(() => {
    const loadWeeklyPlan = async () => {
      try {
        const response = await getWeeklyPlan();
        if (response.weekly_plans && response.weekly_plans.length > 0) {
          setWeeklyPlan(response.weekly_plans[0]);
        }
      } catch (error) {
        console.error('Failed to load weekly plan:', error);
      }
    };
    loadWeeklyPlan();
  }, []);

  const planWeek = async () => {
    setLoading(true);
    setProgress({ current: 0, total: 3 });

    try {
      // Simulate progress for 3 days
      setProgress({ current: 1, total: 3 });
      await new Promise(resolve => setTimeout(resolve, 500));

      setProgress({ current: 2, total: 3 });
      await new Promise(resolve => setTimeout(resolve, 500));

      // Create new weekly plan
      await createWeeklyPlan(temperature);

      setProgress({ current: 3, total: 3 });

      // Load the newly created plan
      const response = await getWeeklyPlan();
      if (response.weekly_plans && response.weekly_plans.length > 0) {
        setWeeklyPlan(response.weekly_plans[0]);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
      setProgress({ current: 0, total: 3 });
    }
  };

  // Convert daily plans to the format expected by components
  const getWeeklyOutfits = () => {
    if (!weeklyPlan) return [];

    const daysOfWeek = ['day1', 'day2', 'day3'];
    return daysOfWeek.map(dayKey => {
      const dailyPlan = weeklyPlan.daily_plans[dayKey];
      if (!dailyPlan || !dailyPlan.outfit_ids.length) return null;

      // For now, create a mock outfit from the first outfit_id
      // TODO: In the future, we might want to fetch the actual outfit details
      const mockOutfit = {
        outfit_id: dailyPlan.outfit_ids[0],
        wardrobe_id: weeklyPlan.wardrobe_id,
        image_url: dailyPlan.image_url || '',
        tags: {}
      };

      return {
        day: dailyPlan.day,
        outfit: mockOutfit,
        composite_image_url: dailyPlan.image_url
      };
    }).filter(Boolean) as any[]; // Type assertion for compatibility
  };

  return {
    weeklyPlan,
    weeklyOutfits: getWeeklyOutfits(),
    loading,
    progress,
    planWeek
  };
}

