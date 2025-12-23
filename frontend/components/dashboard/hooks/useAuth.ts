'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const id = localStorage.getItem('user_id');
    const email = localStorage.getItem('user_email') || '';
    const username = localStorage.getItem('user_username') || '';
    
    if (!id) {
      router.push('/login');
      return;
    }

    setUserId(id);
    setUserEmail(email);
    setUserName(username);
    setIsAuthenticated(true);
  }, [router]);

  const logout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_username');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return {
    userId,
    userEmail,
    userName,
    isAuthenticated,
    logout
  };
}

