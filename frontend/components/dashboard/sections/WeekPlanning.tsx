'use client';

import { Calendar, Plus } from 'lucide-react';
import WeekCarousel from '../components/WeekCarousel';
import type { WeeklyOutfitDay } from '@/lib/api';

interface WeekPlanningProps {
  weeklyOutfits: WeeklyOutfitDay[];
  loadingWeekPlan: boolean;
  weekPlanProgress: { current: number; total: number };
  onPlanWeek: () => Promise<void>;
  temperature?: number;
}

export default function WeekPlanning({
  weeklyOutfits,
  loadingWeekPlan,
  weekPlanProgress,
  onPlanWeek,
  temperature = 22
}: WeekPlanningProps) {
  if (loadingWeekPlan) {
    const daysOfWeek = ['Today', 'Tomorrow', 'Day After Tomorrow'];
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#0095da] rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Generating Your Weekly Plan
            </h2>
            <p className="text-gray-600">
              Creating outfits for the next 3 days...
            </p>
          </div>
          
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Progress
              </span>
              <span className="text-sm font-bold text-[#0095da]">
                {weekPlanProgress.current}/{weekPlanProgress.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#0095da] to-[#007ab8] h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${(weekPlanProgress.current / weekPlanProgress.total) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Generating outfit for {weekPlanProgress.current > 0 ? daysOfWeek[weekPlanProgress.current - 1] : '...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (weeklyOutfits.length === 0) {
    return (
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-[#0095da] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Plan your week
          </h2>
          <p className="text-gray-600 mb-2">
            Plan outfits for the next 3 days based on your schedule and weather
          </p>
          <button 
            onClick={onPlanWeek}
            disabled={loadingWeekPlan}
            className="mt-6 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-5 h-5" />
            Plan Week
          </button>
          <p className="mt-4 text-sm text-gray-500">
            3-Day view • Weather forecast • Schedule integration
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Your Weekly Plan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Outfits for the next 3 days
          </p>
        </div>
        <button 
          onClick={onPlanWeek}
          disabled={loadingWeekPlan}
          className="bg-[#0095da] hover:bg-[#007ab8] text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all shadow-md hover:shadow-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Calendar className="w-4 h-4" />
          Regenerate
        </button>
      </div>
      
      <WeekCarousel weeklyOutfits={weeklyOutfits} />
    </div>
  );
}

