import { useState } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
      
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 shadow-2xl animate-fade-in">
          <CardHeader className="space-y-4 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-500 rounded-xl flex items-center justify-center mx-auto shadow-lg">
              <span className="text-white font-bold text-2xl">A</span>
            </div>
            
            <CardTitle className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Bem-vindo ao <span className="bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">AdaLove 2</span>
            </CardTitle>
            
            <p className="text-gray-600 dark:text-gray-300">
              Acesse sua conta para gerenciar seus autoestudos
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Email</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 dark:text-gray-100"
                    placeholder="seu.email@inteli.edu.br"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Senha</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors text-gray-900 dark:text-gray-100"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>
            </form>
            
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Não tem uma conta?{' '}
                <button
                  onClick={onNavigateToRegister}
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:underline font-medium"
                >
                  Cadastre-se
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;