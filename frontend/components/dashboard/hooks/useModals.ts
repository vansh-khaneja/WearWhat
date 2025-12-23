'use client';

import { useState } from 'react';
import type { Outfit } from '@/lib/api';

export function useModals() {
  const [showOutfitModal, setShowOutfitModal] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmModalConfig, setConfirmModalConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  } | null>(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const openOutfitModal = (outfit: Outfit) => {
    setSelectedOutfit(outfit);
    setShowOutfitModal(true);
  };

  const closeOutfitModal = () => {
    setShowOutfitModal(false);
    setSelectedOutfit(null);
  };

  const openConfirmModal = (config: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
  }) => {
    setConfirmModalConfig(config);
    setShowConfirmModal(true);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
    setConfirmModalConfig(null);
  };

  const openAlertModal = (message: string) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };

  const closeAlertModal = () => {
    setShowAlertModal(false);
    setAlertMessage('');
  };

  return {
    outfitModal: {
      isOpen: showOutfitModal,
      outfit: selectedOutfit,
      open: openOutfitModal,
      close: closeOutfitModal
    },
    confirmModal: {
      isOpen: showConfirmModal,
      config: confirmModalConfig,
      open: openConfirmModal,
      close: closeConfirmModal
    },
    alertModal: {
      isOpen: showAlertModal,
      message: alertMessage,
      open: openAlertModal,
      close: closeAlertModal
    }
  };
}

