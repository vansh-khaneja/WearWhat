'use client';

import { useState, useEffect } from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeSection: string;
  onSectionChange: (section: string) => void;
  onUploadClick: () => void;
  userName: string;
  userEmail: string;
  uploading: boolean;
  uploadMessage: { type: 'success' | 'error'; text: string } | null;
  onLogout: () => void;
}

export default function DashboardLayout({
  children,
  activeSection,
  onSectionChange,
  onUploadClick,
  userName,
  userEmail,
  uploading,
  uploadMessage,
  onLogout
}: DashboardLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Check if sidebar is collapsed from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed');
    if (saved === 'true') {
      setIsCollapsed(true);
    }
  }, []);

  // Close mobile menu when clicking outside or on route change
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update collapsed state when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('sidebar-collapsed');
      setIsCollapsed(saved === 'true');
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader
        userName={userName}
        userEmail={userEmail}
        onLogout={onLogout}
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        showMobileMenu={isMobileMenuOpen}
      />
      <div className="flex relative">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={onSectionChange}
          onUploadClick={onUploadClick}
          userName={userName}
          userEmail={userEmail}
          uploading={uploading}
          uploadMessage={uploadMessage}
          onLogout={onLogout}
          isMobileOpen={isMobileMenuOpen}
          onMobileClose={() => setIsMobileMenuOpen(false)}
        />
        <main className="flex-1 lg:ml-64 transition-all duration-300 ease-in-out">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

