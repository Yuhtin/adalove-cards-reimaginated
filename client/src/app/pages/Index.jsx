"use client";

import { useState, useEffect } from 'react';
import ModernNavbar from '../components/layout/ModernNavbar';
import Dashboard from './Dashboard';
import SelfStudy from './SelfStudy';
import Login from './Login';
import Register from './Register';
import UserSettingsModal from '../components/settings/UserSettingsModal';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState('login');
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-ada-red/20 to-ada-accent/10 rounded-full blur-3xl animate-float opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-ada-accent/15 to-ada-red/10 rounded-full blur-3xl animate-float opacity-30" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-ada-red/10 rounded-full blur-2xl animate-pulse opacity-20"></div>
      </div>

      <ModernNavbar
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        username={username}
        onSettingsClick={() => setShowSettings(true)}
        onLogout={handleLogout}
      />

      <main className="relative px-4">
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
      <footer className="relative border-t border-white/10 py-8 mt-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 font-medium">
            AdaLove 2 - Instituto de Tecnologia e Liderança (Inteli) © 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;