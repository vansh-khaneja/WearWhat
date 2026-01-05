'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/api';

export function AuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const session = await getSession();
        if (active && session && session.user_id) {
          router.push('/dashboard');
        }
      } catch {
        // silently ignore; stay on home page
      }
    })();
    return () => {
      active = false;
    };
  }, [router]);

  return null;
}
