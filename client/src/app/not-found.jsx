'use client'

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from './components/ui/button';

export default function NotFound() {
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      window.location.pathname
    );
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-ada-red/20 to-ada-accent/10 rounded-full blur-3xl animate-float opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-ada-accent/15 to-ada-red/10 rounded-full blur-3xl animate-float opacity-30" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-ada-red/10 rounded-full blur-2xl animate-pulse opacity-20"></div>
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto animate-fade-in">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-ada-red to-ada-accent rounded-3xl blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-ada-red to-ada-accent p-4 rounded-3xl shadow-xl border border-white/20">
              <span className="text-white font-bold text-3xl tracking-wider">A</span>
            </div>
          </div>
        </div>

        {/* 404 Error */}
        <div className="mb-8">
          <h1 className="text-8xl font-bold bg-gradient-to-r from-ada-red to-ada-accent bg-clip-text text-transparent mb-4">
            404
          </h1>
          <h2 className="text-3xl font-bold text-white mb-4">
            Página não encontrada
          </h2>
          <p className="text-lg text-slate-400 mb-8">
            Oops! A página que você está procurando não existe ou foi movida.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/90 hover:to-ada-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-white/20 hover:border-white/30">
              <Home className="h-5 w-5 mr-2" />
              Voltar ao Início
            </Button>
          </Link>
          
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full border-ada-red/30 hover:bg-ada-red/10 text-white font-semibold py-4 rounded-2xl transition-all duration-300"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Voltar à Página Anterior
          </Button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl">
          <p className="text-sm text-slate-400">
            Se você acredita que isso é um erro, entre em contato com o suporte ou tente novamente mais tarde.
          </p>
        </div>
      </div>
    </div>
  );
}
