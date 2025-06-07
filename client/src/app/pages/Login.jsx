"use client"

import { useState } from 'react';
import { Eye, EyeOff, User, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const Login = ({ onLogin, onNavigateToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      onLogin(email.split('@')[0] || 'Usuário');
      setIsLoading(false);
    }, 1000);
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
            <div className="absolute inset-0 bg-gradient-to-r from-ada-red/10 to-ada-accent/10 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>

            <CardHeader className="relative text-center pb-6 pt-8">
              <CardTitle className="text-2xl font-bold text-white mb-3 tracking-wide">
                Bem-vindo de volta
              </CardTitle>
              <p className="text-slate-400 text-sm font-medium">
                Acesse sua conta para continuar sua jornada
              </p>
            </CardHeader>
          
            <CardContent className="relative pt-2 px-8 pb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/90 tracking-wide">Email</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-ada-red/20 to-ada-accent/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-ada-red transition-all duration-300 z-10" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="relative w-full pl-12 pr-4 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:border-ada-red/50 focus:bg-white/10 transition-all duration-300 text-white placeholder-slate-400 outline-none hover:bg-white/8"
                      placeholder="seu.email@inteli.edu.br"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-white/90 tracking-wide">Senha</label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-ada-red/20 to-ada-accent/20 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-ada-red transition-all duration-300 z-10" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="relative w-full pl-12 pr-14 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl focus:border-ada-red/50 focus:bg-white/10 transition-all duration-300 text-white placeholder-slate-400 outline-none hover:bg-white/8"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-ada-red transition-all duration-300 z-10"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="relative group mt-8">
                  <div className="absolute inset-0 bg-gradient-to-r from-ada-red to-ada-accent rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Button
                    type="submit"
                    className="relative w-full bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/90 hover:to-ada-accent/90 text-white font-bold py-4 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 border border-white/20 hover:border-white/30 tracking-wide"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span className="font-semibold">Entrando...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <span>Entrar</span>
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-10 text-center">
                <p className="text-sm text-white-400 font-medium">
                  Não tem uma conta?{' '}
                  <button
                    onClick={onNavigateToRegister}
                    className="text-ada-accent hover:underline transition-all duration-300 ml-1"
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
};

export default Login;