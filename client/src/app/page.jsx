'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/api';

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (auth.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-ada-red/30 border-t-ada-red rounded-full animate-spin"></div>
          <span className="text-lg text-slate-400">Carregando...</span>
        </div>
      </div>
    );
  }

  return null;
}