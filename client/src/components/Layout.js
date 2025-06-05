import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Layout({ children }) {
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'dark bg-ada-bg-dark' : 'bg-ada-bg-light'}`}>
      {/* Header */}
      <header className="bg-ada-section-dark dark:bg-ada-section-dark border-b border-ada-red/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-ada-red rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <h1 className="text-xl font-bold text-ada-text-primary-dark dark:text-ada-text-primary-dark">
                AdaLove 2
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link href="/dashboard" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === '/dashboard' 
                    ? 'bg-ada-red text-white' 
                    : 'text-ada-text-primary-dark hover:text-ada-accent-dark'
                }`}>
                Dashboard
              </Link>
              <Link href="/autoestudos" 
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  router.pathname === '/autoestudos' 
                    ? 'bg-ada-red text-white' 
                    : 'text-ada-text-primary-dark hover:text-ada-accent-dark'
                }`}>
                Autoestudos
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-ada-section-dark border border-ada-red/20 text-ada-text-primary-dark hover:bg-ada-red/10 transition-colors"
              >
                {isDark ? '☀️' : '🌙'}
              </button>
              <div className="w-8 h-8 bg-ada-accent-dark rounded-full"></div>
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