'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export default function Layout({ children }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme, mounted } = useTheme();

  const handleLogout = () => {
    logout();
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-ada-bg-light dark:bg-ada-bg-dark flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-ada-red/20 border-t-ada-red rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ada-bg-light dark:bg-ada-bg-dark">
      {/* Header */}
      <header className="bg-ada-section-light dark:bg-ada-section-dark border-b border-ada-red/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center space-x-3 hover:opacity-80 transition-opacity no-underline">
              <div className="w-8 h-8 bg-ada-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-bold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                AdaLove 2
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline ${
                  pathname === '/dashboard' 
                    ? 'bg-ada-red text-white' 
                    : 'text-ada-text-primary-light dark:text-ada-text-primary-dark hover:text-ada-accent-light dark:hover:text-ada-accent-dark'
                }`}>
                Dashboard
              </Link>
              <Link href="/selfstudy" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors no-underline ${
                  pathname === '/selfstudy' 
                    ? 'bg-ada-red text-white' 
                    : 'text-ada-text-primary-light dark:text-ada-text-primary-dark hover:text-ada-accent-light dark:hover:text-ada-accent-dark'
                }`}>
                Autoestudos
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => {
                  console.log('Toggle theme clicked, current isDark:', isDark);
                  toggleTheme();
                }}
                className="p-2 rounded-lg bg-ada-section-light dark:bg-ada-section-dark border border-ada-red/20 text-ada-text-primary-light dark:text-ada-text-primary-dark hover:bg-ada-red/10 transition-colors"
                title={`Alternar para ${isDark ? 'modo claro' : 'modo escuro'}`}
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              
              {/* User dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-ada-red/10 transition-colors">
                  <div className="w-8 h-8 bg-ada-accent-light dark:bg-ada-accent-dark rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="hidden sm:block text-ada-text-primary-light dark:text-ada-text-primary-dark text-sm">
                    {user?.username}
                  </span>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-ada-section-light dark:bg-ada-section-dark border border-ada-red/20 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-ada-red/10">
                      <p className="text-sm text-ada-text-primary-light dark:text-ada-text-primary-dark font-medium">{user?.username}</p>
                      <p className="text-xs text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70">Estudante</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-ada-text-primary-light dark:text-ada-text-primary-dark hover:bg-ada-red/10 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}