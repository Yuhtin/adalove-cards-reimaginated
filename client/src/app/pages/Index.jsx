import { useState, useEffect } from 'react';
import SimpleHeader from '@/components/layout/SimpleHeader';
import Dashboard from '@/pages/Dashboard';
import SelfStudy from '@/pages/SelfStudy';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import UserSettingsModal from '@/components/settings/UserSettingsModal';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('João Santos');
  const [userAvatar, setUserAvatar] = useState();
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Apply theme
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleThemeToggle = () => {
    setIsDark(!isDark);
  };

  const handleLogin = (user) => {
    setUsername(user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handlePasswordChange = async (oldPassword, newPassword) => {
    // Implementar lógica de mudança de senha
    console.log('Changing password...');
  };

  const handleDataImport = (file) => {
    // Implementar lógica de importação
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result);
        console.log('Imported data:', data);
        alert('Dados importados com sucesso!');
      } catch (error) {
        alert('Erro ao importar dados. Verifique se o arquivo JSON é válido.');
      }
    };
    reader.readAsText(file);
  };

  // Se não estiver autenticado, mostrar páginas de login/registro
  if (!isAuthenticated) {
    if (authPage === 'login') {
      return (
        <Login
          onLogin={handleLogin}
          onNavigateToRegister={() => setAuthPage('register')}
        />
      );
    } else {
      return (
        <Register
          onRegister={handleLogin}
          onNavigateToLogin={() => setAuthPage('login')}
        />
      );
    }
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard username={username} />;
      case 'selfstudy':
        return <SelfStudy />;
      default:
        return <Dashboard username={username} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <SimpleHeader
        isDark={isDark}
        onThemeToggle={handleThemeToggle}
        username={username}
        userAvatar={userAvatar}
        onSettingsClick={() => setShowSettings(true)}
        onLogout={handleLogout}
      />
      
      {/* Navigation floating buttons */}
      <div className="fixed top-4 left-4 z-40 flex space-x-2">
        <button
          onClick={() => setCurrentPage('dashboard')}
          className={`px-4 py-2 rounded-lg glassmorphism border transition-all ${
            currentPage === 'dashboard' 
              ? 'bg-primary text-primary-foreground border-primary' 
              : 'border-primary/20 hover:bg-primary/10'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setCurrentPage('selfstudy')}
          className={`px-4 py-2 rounded-lg glassmorphism border transition-all ${
            currentPage === 'selfstudy' 
              ? 'bg-primary text-primary-foreground border-primary' 
              : 'border-primary/20 hover:bg-primary/10'
          }`}
        >
          Autoestudos
        </button>
      </div>
      
      <main className="relative pt-20 px-4">
        {renderCurrentPage()}
      </main>
      
      <UserSettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        username={username}
        userAvatar={userAvatar}
        onAvatarChange={setUserAvatar}
        onPasswordChange={handlePasswordChange}
        onDataImport={handleDataImport}
      />
      
      {/* Footer */}
      <footer className="border-t border-primary/10 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">
            AdaLove 2 - Instituto de Tecnologia e Liderança (Inteli) © 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;