'use client';

import { Thermometer } from 'lucide-react';

interface TemperatureDisplayProps {
  temperature: number;
  condition?: string;
  autoDetected?: boolean;
  variant?: 'default' | 'compact';
}

export default function TemperatureDisplay({
  temperature,
  condition,
  autoDetected = true,
  variant = 'default'
}: TemperatureDisplayProps) {
  if (variant === 'compact') {
    return (
      <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Thermometer className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-600 mb-0.5">Temperature</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-orange-700">{temperature}</span>
                <span className="text-sm font-medium text-orange-600">°C</span>
              </div>
              {condition && (
                <p className="text-xs font-medium text-orange-600 mt-0.5">{condition}</p>
              )}
            </div>
          </div>
          {autoDetected && (
            <div className="px-3 py-1 bg-white rounded-full border border-orange-200">
              <span className="text-xs font-medium text-orange-700">Auto</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-orange-100 rounded-lg">
            <Thermometer className="w-4 h-4 text-orange-600" />
          </div>
          <span>Current Temperature</span>
        </div>
      </label>
      <div className="relative px-5 py-4 border-2 border-orange-200 rounded-xl bg-gradient-to-r from-orange-50 to-amber-50 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-orange-700">{temperature}</span>
            <span className="text-lg font-medium text-orange-600">°C</span>
          </div>
          {condition && (
            <div className="mt-2 text-center">
              <span className="text-sm font-medium text-orange-600">{condition}</span>
            </div>
          )}
          {autoDetected && (
            <div className="px-3 py-1 bg-white/80 rounded-full border border-orange-200">
              <span className="text-xs font-medium text-orange-700">Auto-detected</span>
            </div>
          )}
        </div>
      </div>
      <p className="mt-2 text-xs text-gray-500 text-center">
        Temperature will be fetched automatically from backend
      </p>
    </div>
  );
}

