'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getSession, logout as apiLogout } from '@/lib/api';

export function useAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    let active = true;
    (async () => {
      const session = await getSession();
      if (!active) return;
      if (!session) {
        setIsAuthenticated(false);
        if (pathname !== '/login') router.replace('/login');
        return;
      }
      setUserId(session.user_id || null);
      setUserEmail(session.email || '');
      setUserName(session.username || '');
      setIsAuthenticated(true);
    })();
    return () => { active = false; };
  }, [router, pathname]);

  const logout = async () => {
    try {
      await apiLogout();
    } catch {}
    setIsAuthenticated(false);
    router.replace('/login');
  };

  return {
    userId,
    userEmail,
    userName,
    isAuthenticated,
    logout,
  };
}

