'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '@/lib/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }
    
    try {
      const data = await auth.register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      setSuccess('Conta criada com sucesso! Redirecionando...');
      
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      login(data.user, data.token);
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Erro no registro:', error);
      setError(error.response?.data?.message || 'Erro ao criar conta');
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
            Crie sua conta para começar
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 rounded-md bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm">
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-ada-section-light dark:bg-ada-section-dark rounded-lg shadow-lg p-8">
          <div className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Usuário
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-ada-red/20 rounded-md focus:outline-none focus:ring-ada-red/50 focus:border-ada-red bg-white dark:bg-ada-bg-dark text-ada-text-primary-light dark:text-ada-text-primary-dark"
                placeholder="Digite seu usuário"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-ada-red/20 rounded-md focus:outline-none focus:ring-ada-red/50 focus:border-ada-red bg-white dark:bg-ada-bg-dark text-ada-text-primary-light dark:text-ada-text-primary-dark"
                placeholder="Digite seu e-mail"
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
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-ada-red/20 rounded-md focus:outline-none focus:ring-ada-red/50 focus:border-ada-red bg-white dark:bg-ada-bg-dark text-ada-text-primary-light dark:text-ada-text-primary-dark"
                placeholder="Digite sua senha"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Confirmar Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-ada-red/20 rounded-md focus:outline-none focus:ring-ada-red/50 focus:border-ada-red bg-white dark:bg-ada-bg-dark text-ada-text-primary-light dark:text-ada-text-primary-dark"
                placeholder="Confirme sua senha"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ada-red hover:bg-ada-red/90 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-ada-text-primary-light dark:text-ada-text-primary-dark">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-ada-red hover:underline font-medium">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}