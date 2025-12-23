'use client';

import { useState, useEffect } from 'react';
import { suggestOutfits } from '@/lib/api';
import type { Outfit } from '@/lib/api';

export function useSuggestions(userId: string | null, temperature: number, activeSection: string) {
  const [suggestedOutfits, setSuggestedOutfits] = useState<Outfit[]>([]);
  const [compositeImageUrl, setCompositeImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState<string>('');
  const [suggestionQuery, setSuggestionQuery] = useState<string>('');

  // Auto-load suggestions when "Today" section is first opened
  useEffect(() => {
    if (activeSection === 'today' && suggestedOutfits.length === 0 && !loading && userId) {
      const loadSuggestions = async () => {
        setLoading(true);
        try {
          const response = await suggestOutfits(userId, temperature, query.trim() || undefined);
          setSuggestedOutfits(response.outfits || []);
          setCompositeImageUrl(response.composite_image_url || null);
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
    if (!userId) {
      throw new Error('Please log in to get suggestions');
    }

    setLoading(true);
    try {
      const response = await suggestOutfits(userId, temperature, queryParam || query.trim() || undefined);
      setSuggestedOutfits(response.outfits || []);
      setCompositeImageUrl(response.composite_image_url || null);
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
    getSuggestions
  };
}

