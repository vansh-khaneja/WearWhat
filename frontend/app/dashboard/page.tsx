'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Sparkles, 
  Shirt, 
  Calendar,
  Palette,
  Settings,
  Plus,
  User,
  MessageCircle,
  Send,
  LogOut,
  X,
  Trash2
} from 'lucide-react';
import { uploadOutfit, getOutfits, deleteOutfit } from '@/lib/api';
import type { Outfit } from '@/lib/api';
import { genericAttributes, specificAttributes } from '@/lib/tags';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [activeSection, setActiveSection] = useState('today');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: "Hi! I'm your Style AI assistant. Ask me anything about styling, outfit suggestions, or fashion advice!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [loadingOutfits, setLoadingOutfits] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [showOutfitModal, setShowOutfitModal] = useState(false);
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

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }
    // Get user email and username from localStorage
    const email = localStorage.getItem('user_email') || '';
    const username = localStorage.getItem('user_username') || '';
    setUserEmail(email);
    setUserName(username);
  }, [router]);

  // Fetch outfits when wardrobe section is active
  useEffect(() => {
    const fetchOutfits = async () => {
      if (activeSection === 'wardrobe') {
        const userId = localStorage.getItem('user_id');
        if (!userId) return;

        setLoadingOutfits(true);
        try {
          const response = await getOutfits(userId);
          setOutfits(response.outfits || []);
        } catch (error) {
          console.error('Failed to fetch outfits:', error);
          setOutfits([]);
        } finally {
          setLoadingOutfits(false);
        }
      }
    };

    fetchOutfits();
  }, [activeSection]);

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showOutfitModal) {
        setShowOutfitModal(false);
      }
    };

    if (showOutfitModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [showOutfitModal]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(event.target as Node)) {
        setShowAccountDropdown(false);
      }
    };

    if (showAccountDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAccountDropdown]);


  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_username');
    router.push('/login');
  };

  const handleAddItemClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadMessage({ type: 'error', text: 'Please select an image file' });
      setTimeout(() => setUploadMessage(null), 3000);
      return;
    }

    const userId = localStorage.getItem('user_id');
    if (!userId) {
      setUploadMessage({ type: 'error', text: 'User not logged in' });
      setTimeout(() => setUploadMessage(null), 3000);
      return;
    }

    setUploading(true);
    setUploadMessage(null);

    try {
      const response = await uploadOutfit(file, userId);
      setUploadMessage({ type: 'success', text: response.message || 'Outfit uploaded successfully!' });
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      // Refresh outfits if wardrobe section is active
      if (activeSection === 'wardrobe') {
        const userId = localStorage.getItem('user_id');
        if (userId) {
          try {
            const response = await getOutfits(userId);
            setOutfits(response.outfits || []);
          } catch (error) {
            console.error('Failed to refresh outfits:', error);
          }
        }
      }
      // Clear message after 3 seconds
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (error) {
      setUploadMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : 'Failed to upload outfit' 
      });
      // Clear message after 5 seconds for errors
      setTimeout(() => setUploadMessage(null), 5000);
    } finally {
      setUploading(false);
    }
  };

  const handleChatSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');

    // Simulate AI response (replace with actual API call later)
    setTimeout(() => {
      const aiResponse = `I understand you're asking about "${userMessage}". This is a placeholder response. Connect me to an AI API to get real style advice!`;
      setChatMessages(prev => [...prev, { role: 'ai', content: aiResponse }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const menuItems = [
    { id: 'today', label: "Today's Outfits", icon: Sparkles },
    { id: 'wardrobe', label: 'My Wardrobe', icon: Shirt },
    { id: 'week', label: 'Week Planning', icon: Calendar },
    { id: 'design', label: 'Design Outfit', icon: Palette },
    { id: 'chat', label: 'Style Chat', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="WearWhat Logo" 
              width={32} 
              height={32} 
              className="object-contain"
            />
            <span className="text-xl font-bold text-gray-900">WearWhat</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-700">
              <Settings className="w-5 h-5" />
              <span className="text-sm">0 items →</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] flex flex-col overflow-visible">
          <div className="p-4 flex flex-col flex-1 overflow-visible">
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-[15px] transition-colors ${
                      isActive
                        ? 'text-[#0095da] font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#0095da]' : ''}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-6">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button 
                onClick={handleAddItemClick}
                disabled={uploading}
                className="w-full bg-[#0095da] hover:bg-[#007ab8] text-white px-3 py-2.5 text-sm font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                {uploading ? 'Uploading...' : 'Add Item'}
              </button>
              {uploadMessage && (
                <div className={`mt-2 text-xs px-2 py-1 rounded ${
                  uploadMessage.type === 'success' 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-red-50 text-red-700'
                }`}>
                  {uploadMessage.text}
                </div>
              )}
            </div>

            <div className="mt-auto pt-6 border-t border-gray-200 relative" ref={accountDropdownRef}>
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded transition-colors"
              >
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-semibold text-gray-900">
                    {userName || 'Account'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {userEmail || 'user@example.com'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showAccountDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setActiveSection('account');
                      setShowAccountDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowAccountDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {activeSection === 'today' && "Today's Suggestions"}
              {activeSection === 'wardrobe' && 'My Wardrobe'}
              {activeSection === 'week' && 'Week Planning'}
              {activeSection === 'design' && 'Design Outfit'}
              {activeSection === 'chat' && 'Style Chat'}
            </h1>
            <p className="text-gray-600">
              {activeSection === 'today' && 'AI-powered outfit suggestions for today'}
              {activeSection === 'wardrobe' && 'Manage your clothing items'}
              {activeSection === 'week' && 'Plan your outfits for the entire week'}
              {activeSection === 'design' && 'Create and customize your outfits'}
              {activeSection === 'chat' && 'Chat with AI for personalized style advice and outfit suggestions'}
            </p>
          </div>

          {/* Today's Suggestions Content */}
          {activeSection === 'today' && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#0095da] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Get today's outfit suggestions
                </h2>
                <p className="text-gray-600 mb-2">
                  Get AI-powered outfit recommendations based on weather, your schedule, and style
                </p>
                <button className="mt-6 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors">
                  <Sparkles className="w-5 h-5" />
                  Get Suggestions
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  Weather-aware • Style-matched • Schedule-optimized
                </p>
              </div>
            </div>
          )}

          {/* Wardrobe Content */}
          {activeSection === 'wardrobe' && (
            <>
              {loadingOutfits ? (
                <div className="bg-white rounded-2xl p-12 text-center">
                  <p className="text-gray-600">Loading your wardrobe...</p>
                </div>
              ) : outfits.length === 0 ? (
                <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-[#0095da] rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Shirt className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">
                      Your wardrobe is empty
                    </h2>
                    <p className="text-gray-600 mb-2">
                      Start building your digital wardrobe by adding your clothing items
                    </p>
                    <button 
                      onClick={handleAddItemClick}
                      className="mt-6 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add First Item
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {outfits.length} {outfits.length === 1 ? 'item' : 'items'}
                    </h2>
                    <button 
                      onClick={handleAddItemClick}
                      className="bg-[#0095da] hover:bg-[#007ab8] text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4" />
                      Add Item
                    </button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {outfits.map((outfit) => (
                      <div 
                        key={outfit.outfit_id} 
                        onClick={() => {
                          setSelectedOutfit(outfit);
                          setShowOutfitModal(true);
                        }}
                        className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow bg-gray-100 cursor-pointer"
                      >
                        <img 
                          src={outfit.image_url} 
                          alt={`Outfit ${outfit.outfit_id}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', outfit.image_url);
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
                          onLoad={() => {
                            console.log('Image loaded successfully:', outfit.image_url);
                          }}
                          loading="lazy"
                          crossOrigin="anonymous"
                        />
                        {/* Category Badge */}
                        {outfit.tags?.category && (
                          <div className="absolute top-2 left-2 bg-[#0095da] text-white text-xs font-medium px-2 py-1 rounded-md shadow-sm">
                            {outfit.tags.category}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2 pointer-events-none">
                          <div className="text-white text-xs font-medium">
                            View Details
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Week Planning Content */}
          {activeSection === 'week' && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#0095da] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Plan your week
                </h2>
                <p className="text-gray-600 mb-2">
                  Plan outfits for the entire week based on your schedule and weather
                </p>
                <button className="mt-6 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors">
                  <Plus className="w-5 h-5" />
                  Plan Week
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  Weekly view • Weather forecast • Schedule integration
                </p>
              </div>
            </div>
          )}

          {/* Design Outfit Content */}
          {activeSection === 'design' && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-300 p-12 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-[#0095da] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  Design your outfit
                </h2>
                <p className="text-gray-600 mb-2">
                  Create and customize outfits by mixing and matching items from your wardrobe
                </p>
                <button className="mt-6 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors">
                  <Plus className="w-5 h-5" />
                  Design Outfit
                </button>
                <p className="mt-4 text-sm text-gray-500">
                  Mix & match • Save favorites • Style recommendations
                </p>
              </div>
            </div>
          )}

          {/* Style Chat Content */}
          {activeSection === 'chat' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'ai' && (
                      <div className="w-8 h-8 bg-[#0095da] rounded-full flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-[#0095da] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-700" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              <div className="border-t border-gray-200 p-4">
                <form onSubmit={handleChatSend} className="flex gap-3">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="Ask me about styling, outfits, or fashion advice..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none text-gray-900"
                  />
                  <button
                    type="submit"
                    disabled={!chatInput.trim()}
                    className="bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    Send
                  </button>
                </form>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  AI-powered style assistant • Get personalized fashion advice
                </p>
              </div>
            </div>
          )}

          {/* Account Content */}
          {activeSection === 'account' && (
            <div className="bg-white rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-700">
                      {(userName || userEmail).charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {userName || userEmail || 'User Account'}
                    </p>
                    <p className="text-sm text-gray-600">{userEmail || 'No email'}</p>
                    <p className="text-sm text-gray-500 mt-1">Member since {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={userEmail}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    />
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-700 px-6 py-3 rounded-lg font-semibold border border-red-200 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Outfit Detail Modal */}
      {showOutfitModal && selectedOutfit && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowOutfitModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image Section */}
            <div className="w-full md:w-1/2 bg-gray-100 flex items-center justify-center p-6">
              <img 
                src={selectedOutfit.image_url} 
                alt={`Outfit ${selectedOutfit.outfit_id}`}
                className="max-w-full max-h-[70vh] object-contain rounded-lg"
              />
            </div>

            {/* Tags Section */}
            <div className="w-full md:w-1/2 p-6 overflow-y-auto max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Item Details</h2>
                <button
                  onClick={() => setShowOutfitModal(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6">
                {/* Generic Attributes - Show all options */}
                {Object.entries(genericAttributes).map(([key, options]) => {
                  const selectedValue = selectedOutfit.tags?.[key];
                  const displayKey = key.charAt(0).toUpperCase() + key.slice(1);
                  
                  return (
                    <div key={key}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-semibold text-gray-700">{displayKey}</h3>
                        {selectedValue && (
                          <span className="text-sm text-[#0095da] font-medium">{selectedValue}</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {options.map((option) => {
                          const isSelected = selectedValue === option;
                          return (
                            <span
                              key={option}
                              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                                isSelected
                                  ? 'bg-gray-900 text-white border-2 border-gray-900'
                                  : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              {option}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Specific Attributes - Show all options based on categoryGroup */}
                {selectedOutfit.tags?.categoryGroup && specificAttributes[selectedOutfit.tags.categoryGroup] && (
                  Object.entries(specificAttributes[selectedOutfit.tags.categoryGroup]).map(([attrKey, options]) => {
                    if (options.length === 0) return null;
                    
                    // Try to find the selected value by checking different key variations
                    const camelKey = attrKey.charAt(0).toLowerCase() + attrKey.slice(1);
                    const selectedValue = selectedOutfit.tags?.[attrKey] || 
                                        selectedOutfit.tags?.[camelKey] ||
                                        Object.entries(selectedOutfit.tags || {}).find(
                                          ([key]) => key.toLowerCase() === attrKey.toLowerCase()
                                        )?.[1];
                    
                    const displayKey = attrKey
                      .replace(/([A-Z])/g, ' $1')
                      .replace(/^./, str => str.toUpperCase())
                      .trim();
                    
                    return (
                      <div key={attrKey}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-sm font-semibold text-gray-700">{displayKey}</h3>
                          {selectedValue && (
                            <span className="text-sm text-[#0095da] font-medium">{String(selectedValue)}</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {options.map((option) => {
                            const isSelected = selectedValue && String(selectedValue).toLowerCase() === option.toLowerCase();
                            return (
                              <span
                                key={option}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-default ${
                                  isSelected
                                    ? 'bg-gray-900 text-white border-2 border-gray-900'
                                    : 'bg-white text-gray-700 border border-gray-300'
                                }`}
                              >
                                {option}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200 flex gap-3 items-center">
                <button
                  onClick={() => {
                    setConfirmModalConfig({
                      title: 'Delete Item',
                      message: 'Are you sure you want to delete this item? This action cannot be undone.',
                      confirmText: 'Delete',
                      cancelText: 'Cancel',
                      onConfirm: async () => {
                        try {
                          await deleteOutfit(selectedOutfit.outfit_id);
                          setShowOutfitModal(false);
                          setShowConfirmModal(false);
                          // Refresh outfits list
                          const userId = localStorage.getItem('user_id');
                          if (userId && activeSection === 'wardrobe') {
                            const response = await getOutfits(userId);
                            setOutfits(response.outfits || []);
                          }
                        } catch (error) {
                          setShowConfirmModal(false);
                          setAlertMessage(error instanceof Error ? error.message : 'Failed to delete outfit');
                          setShowAlertModal(true);
                        }
                      }
                    });
                    setShowConfirmModal(true);
                  }}
                  className="p-3 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg border border-red-200 transition-colors flex items-center justify-center"
                  title="Delete item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    // TODO: Implement save functionality
                    console.log('Save clicked for outfit:', selectedOutfit?.outfit_id);
                    setShowOutfitModal(false);
                  }}
                  className="flex-1 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && confirmModalConfig && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => {
            setShowConfirmModal(false);
            setConfirmModalConfig(null);
          }}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {confirmModalConfig.title}
            </h3>
            <p className="text-gray-600 mb-6">
              {confirmModalConfig.message}
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setConfirmModalConfig(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                {confirmModalConfig.cancelText || 'Cancel'}
              </button>
              <button
                onClick={() => {
                  confirmModalConfig.onConfirm();
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                {confirmModalConfig.confirmText || 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Alert Modal */}
      {showAlertModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4"
          onClick={() => setShowAlertModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Alert
            </h3>
            <p className="text-gray-600 mb-6">
              {alertMessage}
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAlertModal(false)}
                className="px-4 py-2 bg-[#0095da] hover:bg-[#007ab8] text-white rounded-lg font-medium transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

