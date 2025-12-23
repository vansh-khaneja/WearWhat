'use client';

import { useState, useEffect } from 'react';
import { getOutfits, uploadOutfit, deleteOutfit, updateOutfit } from '@/lib/api';
import type { Outfit } from '@/lib/api';

export function useOutfits(userId: string | null, activeSection: string) {
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch outfits when wardrobe section is active
  useEffect(() => {
    const fetchOutfits = async () => {
      if (activeSection === 'wardrobe' && userId) {
        setLoading(true);
        try {
          const response = await getOutfits(userId);
          setOutfits(response.outfits || []);
        } catch (error) {
          console.error('Failed to fetch outfits:', error);
          setOutfits([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOutfits();
  }, [activeSection, userId]);

  const handleUpload = async (file: File) => {
    if (!userId) {
      setUploadMessage({ type: 'error', text: 'User not logged in' });
      setTimeout(() => setUploadMessage(null), 3000);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadMessage({ type: 'error', text: 'Please select an image file' });
      setTimeout(() => setUploadMessage(null), 3000);
      return;
    }

    setUploading(true);
    setUploadMessage(null);

    try {
      const response = await uploadOutfit(file, userId);
      setUploadMessage({ type: 'success', text: response.message || 'Outfit uploaded successfully!' });
      
      // Refresh outfits if wardrobe section is active
      if (activeSection === 'wardrobe' && userId) {
        try {
          const response = await getOutfits(userId);
          setOutfits(response.outfits || []);
        } catch (error) {
          console.error('Failed to refresh outfits:', error);
        }
      }
      
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (error) {
      setUploadMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to upload outfit' 
      });
      setTimeout(() => setUploadMessage(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (outfitId: string) => {
    try {
      await deleteOutfit(outfitId);
      // Refresh outfits list
      if (userId && activeSection === 'wardrobe') {
        const response = await getOutfits(userId);
        setOutfits(response.outfits || []);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (outfitId: string, tags: Record<string, any>) => {
    try {
      await updateOutfit(outfitId, tags);
      // Refresh outfits list
      if (userId && activeSection === 'wardrobe') {
        const response = await getOutfits(userId);
        setOutfits(response.outfits || []);
      }
    } catch (error) {
      throw error;
    }
  };

  const refreshOutfits = async () => {
    if (userId) {
      setLoading(true);
      try {
        const response = await getOutfits(userId);
        setOutfits(response.outfits || []);
      } catch (error) {
        console.error('Failed to refresh outfits:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    outfits,
    loading,
    uploading,
    uploadMessage,
    uploadOutfit: handleUpload,
    deleteOutfit: handleDelete,
    updateOutfit: handleUpdate,
    refreshOutfits
  };
}

