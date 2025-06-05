import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Erro no login');
      }
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-ada-bg-dark flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="w-16 h-16 bg-ada-red rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-2xl">A</span>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-ada-text-primary-dark">
            AdaLove 2
          </h2>
          <p className="mt-2 text-ada-text-primary-dark/70">
            Faça login em sua conta
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-ada-text-primary-dark mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 bg-ada-section-dark border border-ada-red/20 rounded-lg text-ada-text-primary-dark placeholder-ada-text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-ada-red/50"
                placeholder="seu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-ada-text-primary-dark mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full px-4 py-3 bg-ada-section-dark border border-ada-red/20 rounded-lg text-ada-text-primary-dark placeholder-ada-text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-ada-red/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ada-red text-white py-3 px-4 rounded-lg hover:bg-ada-red/90 transition-colors font-medium disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="text-center">
            <span className="text-ada-text-primary-dark/70">Não tem uma conta? </span>
            <Link href="/register" className="text-ada-accent-dark hover:text-ada-red transition-colors font-medium">
              Registre-se
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}