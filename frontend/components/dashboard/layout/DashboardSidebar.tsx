'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Shirt, 
  Calendar,
  Palette,
  MessageCircle,
  Plus,
  User,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onUploadClick: () => void;
  userName: string;
  userEmail: string;
  uploading: boolean;
  uploadMessage: { type: 'success' | 'error'; text: string } | null;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const menuItems: MenuItem[] = [
  { id: 'today', label: "Today's Outfits", icon: Sparkles },
  { id: 'wardrobe', label: 'My Wardrobe', icon: Shirt },
  { id: 'week', label: 'Week Planning', icon: Calendar },
  { id: 'design', label: 'Design Outfit', icon: Palette },
  { id: 'chat', label: 'Style Chat', icon: MessageCircle },
];

export default function DashboardSidebar({
  activeSection,
  onSectionChange,
  onUploadClick,
  userName,
  userEmail,
  uploading,
  uploadMessage,
  onLogout,
  isMobileOpen = false,
  onMobileClose
}: DashboardSidebarProps) {
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  // Close mobile sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobileOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onMobileClose?.();
      }
    };

    if (isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileOpen, onMobileClose]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAccountDropdown(false);
        if (isMobileOpen) {
          onMobileClose?.();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMobileOpen, onMobileClose]);

  // Save collapsed state to localStorage
  useEffect(() => {
    if (!isMobile) {
      const saved = localStorage.getItem('sidebar-collapsed');
      if (saved === 'true') {
        setIsCollapsed(true);
      }
    }
  }, [isMobile]);

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem('sidebar-collapsed', (!isCollapsed).toString());
  };

  const handleSectionChange = (sectionId: string) => {
    onSectionChange(sectionId);
    if (isMobile) {
      onMobileClose?.();
    }
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Collapse Toggle (Desktop only) */}
      {!isMobile && (
        <div className="flex justify-end p-2 border-b border-gray-200">
          <button
            onClick={handleToggleCollapse}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-1"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Mobile Close Button */}
      {isMobile && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">Menu</span>
          <button
            onClick={onMobileClose}
            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#0095da]"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1" role="navigation" aria-label="Main navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSectionChange(item.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSectionChange(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[15px] transition-all duration-200 ${
                  isActive
                    ? 'text-[#0095da] font-semibold bg-[#0095da]/10'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-1`}
                aria-current={isActive ? 'page' : undefined}
                aria-label={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-[#0095da]' : ''}`} />
                {(!isCollapsed || isMobile) && (
                  <span className="truncate">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-6">
          <button 
            onClick={() => {
              onUploadClick();
              if (isMobile) {
                onMobileClose?.();
              }
            }}
            disabled={uploading}
            className={`w-full bg-[#0095da] hover:bg-[#007ab8] text-white px-3 py-2.5 text-sm font-medium flex items-center justify-center gap-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-1 ${
              isCollapsed && !isMobile ? 'px-2' : ''
            }`}
            aria-label={isCollapsed && !isMobile ? 'Add item' : undefined}
          >
            <Plus className="w-4 h-4 flex-shrink-0" />
            {(!isCollapsed || isMobile) && (
              <span>{uploading ? 'Uploading...' : 'Add Item'}</span>
            )}
          </button>
          {uploadMessage && (!isCollapsed || isMobile) && (
            <div className={`mt-2 text-xs px-2 py-1.5 rounded ${
              uploadMessage.type === 'success' 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {uploadMessage.text}
            </div>
          )}
        </div>
      </div>

      {/* Account Section */}
      <div className="p-4 border-t border-gray-200 relative flex-shrink-0" ref={accountDropdownRef}>
        <button
          onClick={() => setShowAccountDropdown(!showAccountDropdown)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setShowAccountDropdown(!showAccountDropdown);
            }
          }}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-offset-1 ${
            isCollapsed && !isMobile ? 'justify-center' : ''
          }`}
          aria-label={isCollapsed && !isMobile ? 'Account menu' : undefined}
          aria-expanded={showAccountDropdown}
        >
          <div className="w-8 h-8 bg-gradient-to-br from-[#0095da] to-[#007ab8] rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-white" />
          </div>
          {(!isCollapsed || isMobile) && (
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userName || 'Account'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userEmail || 'user@example.com'}
              </p>
            </div>
          )}

          {/* Dropdown Menu */}
          {showAccountDropdown && (
            <div className={`absolute bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
              isCollapsed && !isMobile 
                ? 'left-full ml-2 bottom-0 w-48' 
                : 'bottom-full left-0 mb-2 w-full'
            }`}>
              <button
                onClick={() => {
                  handleSectionChange('account');
                  setShowAccountDropdown(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSectionChange('account');
                    setShowAccountDropdown(false);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-gray-900 hover:bg-gray-50 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-[#0095da] focus:ring-inset"
                aria-label="Account settings"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button
                onClick={() => {
                  onLogout();
                  setShowAccountDropdown(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onLogout();
                    setShowAccountDropdown(false);
                  }
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-inset"
                aria-label="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign out</span>
              </button>
            </div>
          )}
        </button>
      </div>
    </div>
  );

  // Mobile: Render as overlay
  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isMobileOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-in fade-in duration-200"
            onClick={onMobileClose}
            aria-hidden="true"
          />
        )}
        
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          role="navigation"
          aria-label="Main navigation"
        >
          <SidebarContent />
        </aside>
      </>
    );
  }

  // Desktop: Render as fixed sidebar
  return (
    <aside
      ref={sidebarRef}
      className={`hidden lg:flex fixed left-0 top-[var(--header-height)] h-[calc(100vh-var(--header-height))] bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
      style={{ '--header-height': '73px' } as React.CSSProperties}
      role="navigation"
      aria-label="Main navigation"
    >
      <SidebarContent />
    </aside>
  );
}


