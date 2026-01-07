'use client';

import { useState, useEffect } from 'react';
import { suggestOutfits } from '@/lib/api';
import type { Outfit, SuggestOutfitResponse } from '@/lib/api';

export function useSuggestions(userId: string | null, temperature: number, activeSection: string) {
  const [suggestedOutfits, setSuggestedOutfits] = useState<Outfit[]>([]);
  const [compositeImageUrl, setCompositeImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [suggestionQuery, setSuggestionQuery] = useState<string>('');
  const [todayWeather, setTodayWeather] = useState<{temperature?: number; condition?: string} | null>(null);

  // Auto-load suggestions when "Today" section is first opened
  useEffect(() => {
    if (activeSection === 'today' && suggestedOutfits.length === 0 && !loading) {
      const loadSuggestions = async () => {
        setLoading(true);
        try {
          // Get suggestions with weather data (coordinates fetched from user location in backend)
          const response = await suggestOutfits(
            temperature,
            query.trim() || undefined,
            undefined // condition will be fetched from weather
          );

          setSuggestedOutfits(response.outfits || []);
          setCompositeImageUrl(response.composite_image_url || null);

          // Set weather data from response
          if (response.weather) {
            setTodayWeather({
              temperature: response.weather.temp_c,
              condition: response.weather.condition_text
            });
          }
        } catch (error) {
          // Silently fail on auto-load
          console.error('Failed to auto-load suggestions:', error);
        } finally {
          setLoading(false);
        }
      };
      loadSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection]);

  const getSuggestions = async (queryParam?: string) => {
    setLoading(true);
    try {
      const response = await suggestOutfits(
        temperature,
        queryParam || query.trim() || undefined,
        undefined // condition will be fetched from weather
      );

      setSuggestedOutfits(response.outfits || []);
      setCompositeImageUrl(response.composite_image_url || null);

      // Update weather data from response
      if (response.weather) {
        setTodayWeather({
          temperature: response.weather.temp_c,
          condition: response.weather.condition_text
        });
      }

      if (queryParam !== undefined) {
        setQuery(queryParam);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    suggestedOutfits,
    compositeImageUrl,
    loading,
    query,
    setQuery,
    suggestionQuery,
    setSuggestionQuery,
    getSuggestions,
    todayWeather
  };
}

