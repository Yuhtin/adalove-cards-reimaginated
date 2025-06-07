"use client"

import { useState } from 'react';
import { Home, BookOpen, User, Settings, LogOut, Menu, X } from 'lucide-react';
import { Button } from '../ui/button';

const ModernNavbar = ({ 
  currentPage, 
  onPageChange, 
  username = "Estudante", 
  onSettingsClick,
  onLogout 
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: Home,
      description: 'Visão geral dos seus estudos'
    },
    { 
      id: 'selfstudy', 
      label: 'Autoestudos', 
      icon: BookOpen,
      description: 'Gerencie suas atividades'
    }
  ];

  return (
    <>
      {/* Main Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/5 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-ada-red to-ada-accent rounded-2xl blur opacity-75"></div>
                <div className="relative bg-gradient-to-br from-ada-red to-ada-accent p-3 rounded-2xl shadow-xl border border-white/20">
                  <span className="text-white font-bold text-xl tracking-wider">A</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">
                  Ada<span className="bg-gradient-to-r from-ada-red to-ada-accent bg-clip-text text-transparent">Love</span>
                </h1>
                <p className="text-xs text-slate-400 font-medium">Plataforma de Autoestudos</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                
                return (
                  <div key={item.id} className="relative group">
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-ada-red to-ada-accent rounded-2xl blur opacity-50"></div>
                    )}
                    <Button
                      onClick={() => onPageChange(item.id)}
                      className={`relative flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white shadow-xl border border-white/20'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-semibold">{item.label}</span>
                    </Button>
                    
                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                      <div className="bg-black/80 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg border border-white/10">
                        {item.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* User Section */}
            <div className="flex items-center space-x-3">
              {/* User Info */}
              <div className="hidden sm:flex items-center space-x-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2">
                <div className="w-8 h-8 bg-gradient-to-br from-ada-red to-ada-accent rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{username}</p>
                  <p className="text-xs text-slate-400">Estudante</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <Button
                  onClick={onSettingsClick}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl p-2 transition-all duration-300"
                >
                  <Settings className="h-5 w-5 text-white" />
                </Button>
                
                <Button
                  onClick={onLogout}
                  className="bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 hover:border-red-500/50 rounded-xl p-2 transition-all duration-300"
                >
                  <LogOut className="h-5 w-5 text-red-400" />
                </Button>
              </div>

              {/* Mobile Menu Button */}
              <Button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5 text-white" /> : <Menu className="h-5 w-5 text-white" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/5 backdrop-blur-2xl border-t border-white/10 animate-fade-in">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile User Info */}
              <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 bg-gradient-to-br from-ada-red to-ada-accent rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{username}</p>
                  <p className="text-sm text-slate-400">Estudante</p>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      onClick={() => {
                        onPageChange(item.id);
                        setIsMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white'
                          : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-semibold">{item.label}</p>
                        <p className="text-xs opacity-80">{item.description}</p>
                      </div>
                    </Button>
                  );
                })}
              </div>

              {/* Mobile Actions */}
              <div className="flex space-x-2 pt-4 border-t border-white/10">
                <Button
                  onClick={() => {
                    onSettingsClick();
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-3 flex items-center justify-center space-x-2"
                >
                  <Settings className="h-5 w-5 text-white" />
                  <span className="text-white font-semibold">Configurações</span>
                </Button>
                
                <Button
                  onClick={onLogout}
                  className="flex-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-2xl p-3 flex items-center justify-center space-x-2"
                >
                  <LogOut className="h-5 w-5 text-red-400" />
                  <span className="text-red-400 font-semibold">Sair</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer to prevent content from going under the fixed navbar */}
      <div className="h-16"></div>
    </>
  );
};

export default ModernNavbar;
