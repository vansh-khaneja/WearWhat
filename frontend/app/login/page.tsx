'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { signUp, login as backendLogin } from '@/lib/api';

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSignup, setShowSignup] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First: log into backend to set HttpOnly auth cookie for API calls
      const backendResp = await backendLogin({ email, password });
      if (backendResp?.user_id) {
        try {
          localStorage.setItem('user_id', backendResp.user_id);
          if (backendResp.email) localStorage.setItem('user_email', backendResp.email);
          if (backendResp.username) localStorage.setItem('user_username', backendResp.username);
        } catch {}
      }

      // Navigate to dashboard; middleware will allow based on backend cookie
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signUp({ username, email, password });
      // After signup, also log into backend to set cookie
      await backendLogin({ email, password });
      // Navigate to dashboard after backend sets cookie
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const switchToSignup = () => {
    setShowSignup(true);
    setError('');
    setEmail('');
    setPassword('');
    setUsername('');
  };

  const switchToLogin = () => {
    setShowSignup(false);
    setError('');
    setEmail('');
    setPassword('');
    setUsername('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#0095da' }}>
      {/* Decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-[#007ab8] rounded-full opacity-20 blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#007ab8] rounded-full opacity-20 blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <a href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="WearWhat Logo" 
              width={40} 
              height={40} 
              className="object-contain"
            />
            <span className="text-2xl font-bold text-white">WearWhat</span>
          </a>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {searchParams?.get('reason') === 'session-expired' && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              Your session expired. Please sign in again.
            </div>
          )}
          {!showSignup ? (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Log in</h1>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none transition-all text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none transition-all text-gray-900"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !email || !password}
                  className="w-full bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-lg focus:ring-[#0095da] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Logging in...' : 'Log in'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Not a member?{' '}
                <button
                  onClick={switchToSignup}
                  className="text-[#0095da] hover:text-[#007ab8] font-semibold underline"
                >
                  Sign up
                </button>
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900 mb-6">Get started</h1>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-5">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none transition-all text-gray-900"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none transition-all text-gray-900"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0095da] focus:border-[#0095da] outline-none transition-all text-gray-900"
                    placeholder="Enter your password"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading || !username || !email || !password}
                  className="w-full bg-[#0095da] hover:bg-[#007ab8] text-white px-6 py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-lg focus:ring-[#0095da] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? 'Creating account...' : 'Create account'}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-600">
                Already a member?{' '}
                <button
                  onClick={switchToLogin}
                  className="text-[#0095da] hover:text-[#007ab8] font-semibold underline"
                >
                  Sign in
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
