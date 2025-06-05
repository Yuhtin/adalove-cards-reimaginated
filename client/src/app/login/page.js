'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '@/lib/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await auth.login({ username, password });
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      login(data.user, data.token);
      
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      setError(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ada-bg-light dark:bg-ada-bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-ada-red mb-2">AdaLove</h1>
          <p className="text-ada-text-primary-light dark:text-ada-text-primary-dark">
            Faça login para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="bg-ada-section-light dark:bg-ada-section-dark rounded-lg shadow-lg p-8">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-ada-red/20 rounded-md focus:outline-none focus:ring-ada-red/50 focus:border-ada-red bg-white dark:bg-ada-bg-dark text-ada-text-primary-light dark:text-ada-text-primary-dark"
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Senha
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-ada-red/20 rounded-md focus:outline-none focus:ring-ada-red/50 focus:border-ada-red bg-white dark:bg-ada-bg-dark text-ada-text-primary-light dark:text-ada-text-primary-dark"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ada-red hover:bg-ada-red/90 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-ada-text-primary-light dark:text-ada-text-primary-dark">
              Não tem uma conta?{' '}
              <Link href="/register" className="text-ada-red hover:underline font-medium">
                Cadastre-se
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}