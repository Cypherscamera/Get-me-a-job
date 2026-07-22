'use client';

import React, { useState } from 'react';
import { Lock, User, AlertCircle, Briefcase } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (username: string) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setLoading(true);

    // Simulate a brief premium loading animation
    setTimeout(() => {
      const lowerUser = username.trim().toLowerCase();
      const lowerPass = password.trim();

      if (
        (lowerUser === 'aryan' && lowerPass === 'aryan') ||
        (lowerUser === 'ankit' && lowerPass === 'ankit')
      ) {
        onLoginSuccess(lowerUser);
      } else {
        setError('Invalid username or password.');
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-4 py-12 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-2xl border border-[#d2d2d7] shadow-xl transition-all duration-300">
        
        {/* Branding & Header */}
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 bg-[#0071e3] rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 animate-bounce-slow">
            <Briefcase className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-[#1d1d1f]">
            Get Me A Job
          </h2>
          <p className="mt-2 text-sm text-[#858585]">
            Access your job application pipeline dashboard
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label htmlFor="username" className="block text-xs font-semibold text-[#858585] uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-4.5 w-4.5 text-[#858585]" />
                </span>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#d2d2d7] rounded-xl bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all duration-200"
                  placeholder="e.g. aryan"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#858585] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4.5 w-4.5 text-[#858585]" />
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-[#d2d2d7] rounded-xl bg-[#f5f5f7] text-[#1d1d1f] text-sm placeholder-[#858585] focus:outline-none focus:ring-2 focus:ring-[#0071e3] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>


          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-[#0071e3] hover:bg-[#0077ed] active:bg-[#0062c4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0071e3] disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-500/10 transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Logging in...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
