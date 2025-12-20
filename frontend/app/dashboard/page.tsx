'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  Shirt, 
  Calendar,
  Palette,
  Settings,
  LogOut,
  Plus,
  User,
  ChevronRight,
  MessageCircle,
  Send
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState('');
  const [activeSection, setActiveSection] = useState('today');
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([
    { role: 'ai', content: "Hi! I'm your Style AI assistant. Ask me anything about styling, outfit suggestions, or fashion advice!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user is logged in
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/login');
      return;
    }
    // You can fetch user email from API if needed
    setUserEmail('user@example.com');
  }, [router]);

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
    router.push('/login');
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
    { id: 'today', label: 'Today', icon: Sparkles },
    { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
    { id: 'week', label: 'Week', icon: Calendar },
    { id: 'design', label: 'Design', icon: Palette },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#0095da] rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
              </svg>
            </div>
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
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)] flex flex-col">
          <div className="p-6 flex flex-col flex-1">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0095da] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="mt-8">
              <button className="w-full bg-[#0095da] hover:bg-[#007ab8] text-white px-4 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors">
                <Plus className="w-5 h-5" />
                Add Item
              </button>
            </div>

            <div className="mt-auto pt-8 border-t border-gray-200 relative" ref={accountDropdownRef}>
              <button
                onClick={() => setShowAccountDropdown(!showAccountDropdown)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-700" />
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-bold text-gray-900">Account</p>
                  <p className="text-xs text-gray-600 truncate">
                    {userEmail || 'user@example.com'}
                  </p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {showAccountDropdown && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setActiveSection('account');
                      setShowAccountDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="w-5 h-5" />
                    <span className="text-sm">Settings</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm">Sign out</span>
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
                <button className="mt-6 bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 mx-auto transition-colors">
                  <Plus className="w-5 h-5" />
                  Add First Item
                </button>
              </div>
            </div>
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
                      {userEmail.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">
                      {userEmail || 'User Account'}
                    </p>
                    <p className="text-sm text-gray-600">Member since {new Date().toLocaleDateString()}</p>
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
    </div>
  );
}

