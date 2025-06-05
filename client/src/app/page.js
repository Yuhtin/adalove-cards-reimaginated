'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-ada-bg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-ada-red rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <div className="w-8 h-8 border-4 border-ada-red/20 border-t-ada-red rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-ada-text-primary-dark/70">Carregando AdaLove 2...</p>
        </div>
      </div>
    );
  }

  return null;
}