'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Search, User, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react';

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  onLogout?: () => void;
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export default function DashboardHeader({ 
  userName, 
  userEmail, 
  onLogout,
  onMenuClick,
  showMobileMenu = false
}: DashboardHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  // Focus search input when shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Close dropdown on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowUserDropdown(false);
        setShowSearch(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Search:', searchQuery);
    }
  };

  const userInitial = (userName || userEmail || 'U').charAt(0).toUpperCase();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo and Mobile Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
              aria-label="Toggle menu"
              aria-expanded={showMobileMenu}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2 sm:gap-3">
              <Image 
                src="/logo.png" 
                alt="WearWhat Logo" 
                width={32} 
                height={32} 
                className="object-contain w-7 h-7 sm:w-8 sm:h-8"
              />
              <span className="text-lg sm:text-xl font-bold text-gray-900">WearWhat</span>
            </div>
          </div>

          {/* Center: Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search outfits, items..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none text-sm text-gray-900 bg-white transition-all"
                  aria-label="Search"
                />
              </div>
            </form>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* User Profile Dropdown */}
            <div className="relative" ref={userDropdownRef}>
              <button
                onClick={() => setShowUserDropdown(!showUserDropdown)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-2"
                aria-label="User menu"
                aria-expanded={showUserDropdown}
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-[#0095da] to-[#007ab8] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-semibold">{userInitial}</span>
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold text-gray-900 leading-tight">
                    {userName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 leading-tight truncate max-w-[120px]">
                    {userEmail || 'user@example.com'}
                  </p>
                </div>
                <ChevronDown className={`hidden sm:block w-4 h-4 text-gray-500 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showUserDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-gray-200 sm:hidden">
                    <p className="text-sm font-semibold text-gray-900">{userName || 'User'}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail || 'user@example.com'}</p>
                  </div>
                  <button
                    onClick={() => {
                      // Navigate to account settings
                      setShowUserDropdown(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    aria-label="Account settings"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Account Settings</span>
                  </button>
                  {onLogout && (
                    <button
                      onClick={() => {
                        onLogout();
                        setShowUserDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      aria-label="Sign out"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <div className="mt-3 md:hidden animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search outfits, items..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none text-sm text-gray-900 bg-white"
                aria-label="Search"
              />
            </form>
          </div>
        )}
      </div>
    </header>
  );
}

