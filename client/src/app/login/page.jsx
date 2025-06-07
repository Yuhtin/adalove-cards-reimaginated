'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { auth } from '../../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Extract username from email (before @)
      const username = email.split('@')[0];
      const { user } = await auth.login({ username, password });
      
      // Redirect to dashboard after successful login
      router.push('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <div
      className="min-h-screen relative bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'url(https://www.inteli.edu.br/wp-content/uploads/2024/08/oem-campus-2.jpg)'
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6">
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-ada-red to-ada-accent rounded-3xl blur-xl opacity-50 animate-pulse"></div>
          </div>

          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            AdaLove<span className="bg-gradient-to-r from-ada-red to-ada-accent bg-clip-text text-transparent"> 2</span>
          </h1>
        </div>

        <div className="w-full max-w-md">
          <Card className="bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl animate-scale-in hover:bg-white/10 transition-all duration-500 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-ada-accent/10 to-ada-red/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            <CardHeader className="relative text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-white mb-3 tracking-wide">
                Bem-vindo de volta!
              </CardTitle>
              <p className="text-slate-400 text-sm font-medium">
                Faça login para acessar sua plataforma de autoestudos
              </p>
            </CardHeader>

            <CardContent className="relative pt-2 px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 text-red-300 text-sm font-medium animate-fade-in">
                    {error}
                  </div>
                )}
                
                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">Email</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ada-accent/70 group-focus-within:text-ada-accent transition-colors" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 backdrop-blur-sm border-2 border-ada-accent/20 rounded-2xl focus:border-ada-accent/60 focus:bg-white/10 transition-all duration-300 text-white placeholder-white/50 outline-none"
                        placeholder="seu.email@inteli.edu.br"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white/90">Senha</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-ada-accent/70 group-focus-within:text-ada-accent transition-colors" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-12 pr-14 py-3.5 bg-white/5 backdrop-blur-sm border-2 border-ada-accent/20 rounded-2xl focus:border-ada-accent/60 focus:bg-white/10 transition-all duration-300 text-white placeholder-white/50 outline-none"
                        placeholder="••••••••"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-ada-accent/70 hover:text-ada-accent transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative group mt-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-ada-accent to-ada-red rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    type="submit"
                    className="relative w-full bg-gradient-to-r from-ada-accent to-ada-red hover:from-ada-accent/90 hover:to-ada-red/90 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-white/20 hover:border-white/30 tracking-wide"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-semibold">Entrando...</span>
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="mt-6 text-sm text-white/70">
                  Não tem uma conta?{' '}
                  <button
                    onClick={navigateToRegister}
                    className="text-ada-red hover:text-ada-red/80 font-semibold hover:underline transition-colors"
                  >
                    Cadastre-se aqui
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
