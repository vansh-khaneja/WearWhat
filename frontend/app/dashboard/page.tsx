'use client';

import { useState, useRef } from 'react';
import DashboardLayout from '@/components/dashboard/layout/DashboardLayout';
import TodaysSuggestions from '@/components/dashboard/sections/TodaysSuggestions';
import MyWardrobe from '@/components/dashboard/sections/MyWardrobe';
import WeekPlanning from '@/components/dashboard/sections/WeekPlanning';
import DesignOutfit from '@/components/dashboard/sections/DesignOutfit';
import StyleChat from '@/components/dashboard/sections/StyleChat';
import AccountSettings from '@/components/dashboard/sections/AccountSettings';
import OutfitDetailModal from '@/components/dashboard/modals/OutfitDetailModal';
import ConfirmModal from '@/components/dashboard/modals/ConfirmModal';
import AlertModal from '@/components/dashboard/modals/AlertModal';
import { useAuth } from '@/components/dashboard/hooks/useAuth';
import { useOutfits } from '@/components/dashboard/hooks/useOutfits';
import { useSuggestions } from '@/components/dashboard/hooks/useSuggestions';
import { useWeekPlanning } from '@/components/dashboard/hooks/useWeekPlanning';
import { useModals } from '@/components/dashboard/hooks/useModals';

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('today');
  const [temperature] = useState<number>(22); // Default static temperature in Celsius
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: "Hi! I'm your Style AI assistant. Ask me anything about styling, outfit suggestions, or fashion advice!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editedTags, setEditedTags] = useState<Record<string, any>>({});
  const [originalTags, setOriginalTags] = useState<Record<string, any>>({});

  // Custom hooks
  const { userId, userEmail, userName, logout } = useAuth();
  const { outfits, loading: loadingOutfits, uploading, uploadMessage, uploadOutfit, deleteOutfit, updateOutfit } = useOutfits(userId, activeSection);
  const { suggestedOutfits, compositeImageUrl, loading: loadingSuggestions, query, setQuery, getSuggestions, suggestionQuery, setSuggestionQuery } = useSuggestions(userId, temperature, activeSection);
  const { weeklyOutfits, loading: loadingWeekPlan, progress: weekPlanProgress, planWeek } = useWeekPlanning(userId, temperature);
  const { outfitModal, confirmModal, alertModal } = useModals();

  // Section titles and descriptions
  const sectionConfig: Record<string, { title: string; description: string }> = {
    today: { title: "Today's Suggestions", description: 'AI-powered outfit suggestions for today' },
    wardrobe: { title: 'My Wardrobe', description: 'Manage your clothing items' },
    week: { title: 'Week Planning', description: 'Plan your outfits for the entire week' },
    design: { title: 'Design Outfit', description: 'Create and customize your outfits' },
    chat: { title: 'Style Chat', description: 'Chat with AI for personalized style advice and outfit suggestions' },
    account: { title: 'Account Settings', description: 'Manage your account settings' }
  };

  const currentSection = sectionConfig[activeSection] || sectionConfig.today;

  const handleAddItemClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadOutfit(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleGetSuggestions = async (queryParam?: string) => {
    try {
      await getSuggestions(queryParam);
    } catch (error) {
      alertModal.open(error instanceof Error ? error.message : 'Failed to get suggestions');
    }
  };

  const handleSuggestionQuerySubmit = async (query: string) => {
    try {
      await getSuggestions(query);
      setSuggestionQuery('');
    } catch (error) {
      alertModal.open(error instanceof Error ? error.message : 'Failed to get suggestions');
    }
  };

  const handlePlanWeek = async () => {
    try {
      await planWeek();
        } catch (error) {
      alertModal.open(error instanceof Error ? error.message : 'Failed to plan week');
    }
  };

  const handleOutfitClick = (outfit: any) => {
    outfitModal.open(outfit);
    setOriginalTags(JSON.parse(JSON.stringify(outfit.tags || {})));
    setEditedTags(JSON.parse(JSON.stringify(outfit.tags || {})));
  };

  const handleSaveOutfit = async (tags: Record<string, any>) => {
    if (!outfitModal.outfit) return;
    try {
      await updateOutfit(outfitModal.outfit.outfit_id, tags);
      outfitModal.close();
      setEditedTags({});
      setOriginalTags({});
    } catch (error) {
      alertModal.open(error instanceof Error ? error.message : 'Failed to update outfit');
    }
  };

  const handleDeleteOutfit = () => {
    if (!outfitModal.outfit) return;
    confirmModal.open({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          await deleteOutfit(outfitModal.outfit!.outfit_id);
          outfitModal.close();
          confirmModal.close();
          setEditedTags({});
          setOriginalTags({});
          } catch (error) {
          confirmModal.close();
          alertModal.open(error instanceof Error ? error.message : 'Failed to delete outfit');
        }
      }
    });
  };

  const handleChatSend = (message: string) => {
    setChatMessages(prev => [...prev, { role: 'user', content: message }]);
    setChatInput('');

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiResponse = `I understand you're asking about "${message}". This is a placeholder response. Connect me to an AI API to get real style advice!`;
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1000);
  };

  return (
    <DashboardLayout
      activeSection={activeSection}
      onSectionChange={setActiveSection}
      onUploadClick={handleAddItemClick}
      userName={userName}
      userEmail={userEmail}
      uploading={uploading}
      uploadMessage={uploadMessage}
      onLogout={logout}
    >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {currentSection.title}
            </h1>
            <p className="text-gray-600">
          {currentSection.description}
            </p>
          </div>

          {/* Today's Suggestions Content */}
          {activeSection === 'today' && (
        <TodaysSuggestions
          temperature={temperature}
          onGetSuggestions={handleGetSuggestions}
          suggestedOutfits={suggestedOutfits}
          compositeImageUrl={compositeImageUrl}
          loadingSuggestions={loadingSuggestions}
          query={query}
          onQueryChange={setQuery}
          onSuggestionQuerySubmit={handleSuggestionQuerySubmit}
          suggestionQuery={suggestionQuery}
          onSuggestionQueryChange={setSuggestionQuery}
        />
          )}

          {/* Wardrobe Content */}
          {activeSection === 'wardrobe' && (
        <MyWardrobe
          outfits={outfits}
          loadingOutfits={loadingOutfits}
          onOutfitClick={handleOutfitClick}
          onAddItemClick={handleAddItemClick}
        />
          )}

      {/* Week Planning Content */}
      {activeSection === 'week' && (
        <WeekPlanning
          weeklyOutfits={weeklyOutfits}
          loadingWeekPlan={loadingWeekPlan}
          weekPlanProgress={weekPlanProgress}
          onPlanWeek={handlePlanWeek}
          temperature={temperature}
        />
      )}

          {/* Design Outfit Content */}
      {activeSection === 'design' && (
        <DesignOutfit
          outfits={outfits}
          loadingOutfits={loadingOutfits}
        />
      )}

          {/* Style Chat Content */}
          {activeSection === 'chat' && (
        <StyleChat
          messages={chatMessages}
          onSendMessage={handleChatSend}
          inputValue={chatInput}
          onInputChange={setChatInput}
        />
          )}

          {/* Account Content */}
          {activeSection === 'account' && (
        <AccountSettings
          userName={userName}
          userEmail={userEmail}
          onLogout={logout}
        />
      )}

      {/* Modals */}
      <OutfitDetailModal
        outfit={outfitModal.outfit}
        isOpen={outfitModal.isOpen}
        onClose={() => {
          outfitModal.close();
                    setEditedTags({});
                    setOriginalTags({});
                  }}
        onSave={handleSaveOutfit}
        onDelete={handleDeleteOutfit}
        tags={editedTags}
        onTagsChange={setEditedTags}
        originalTags={originalTags}
      />

      {confirmModal.config && (
        <ConfirmModal
          isOpen={confirmModal.isOpen}
          title={confirmModal.config.title}
          message={confirmModal.config.message}
          confirmText={confirmModal.config.confirmText}
          cancelText={confirmModal.config.cancelText}
          onConfirm={confirmModal.config.onConfirm}
          onCancel={confirmModal.close}
        />
      )}

      <AlertModal
        isOpen={alertModal.isOpen}
        message={alertModal.message}
        onClose={alertModal.close}
      />
    </DashboardLayout>
  );
}
