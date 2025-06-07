"use client"

import { useState, useRef, useEffect } from 'react';
import { Home, BookOpen, User, Settings, LogOut, Menu, X, ChevronDown } from 'lucide-react';
import { Button } from '../ui/button';

const ModernNavbar = ({
  currentPage,
  onPageChange,
  username = "Estudante",
  onSettingsClick,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      {/* Floating Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white/8 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl shadow-black/20">
            <div className="flex items-center justify-between px-6 py-4">

              {/* Logo Section */}
              <div className="flex items-center space-x-4">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-ada-red/20 to-ada-accent/20 rounded-2xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                  <div className="relative bg-white/10 backdrop-blur-sm p-2.5 rounded-2xl border border-white/20 group-hover:border-white/30 transition-all duration-300">
                    <img
                      src="/logo.png"
                      alt="AdaLove Logo"
                      className="h-9 w-9 object-contain"
                    />
                  </div>
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-lg font-bold text-white/90">
                    Ada<span className="bg-gradient-to-r from-ada-red to-ada-accent bg-clip-text text-transparent">Love 2</span>
                  </h1>
                  <p className="text-xs text-white/60 font-medium">By Davi Duarte</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;

                  return (
                    <div key={item.id} className="relative group">
                      <Button
                        onClick={() => onPageChange(item.id)}
                        className={`relative flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-300 ${isActive
                            ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white shadow-xl border border-white/20'
                            : 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20'
                          }`}
                      >
                        <Icon className="h-4 w-4" />
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-r from-ada-red/10 to-ada-accent/10 rounded-2xl"></div>
                        )}
                      </Button>

                      {/* Tooltip */}
                      <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
                        <div className="bg-black/90 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-xl border border-white/20 shadow-xl">
                          {item.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* User Section */}
              <div className="flex items-center space-x-3">
                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <Button
                    
                    className="flex items-center space-x-3 bg-white/8 hover:bg-white/12 border border-white/15 hover:border-white/25 rounded-2xl px-4 py-2.5 transition-all duration-300"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-ada-red to-ada-accent rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="hidden sm:block text-left">
                      <p className="text-sm font-medium text-white">{username}</p>
                      <p className="text-xs text-white/60">Estudante</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-white/60 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} />
                  </Button>

                  {/* Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div
                      className="absolute right-0 top-full mt-2 w-56 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl shadow-black/20 py-2 z-50"
                      onMouseLeave={() => setIsUserDropdownOpen(false)}
                    >
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-medium text-white">{username}</p>
                        <p className="text-xs text-white/60">Estudante</p>
                      </div>

                      <div className="py-1">
                        <Button
                          onClick={() => {
                            onSettingsClick();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-white/10 transition-colors duration-200 text-white/80 hover:text-white"
                        >
                          <Settings className="h-4 w-4" />
                          <span className="text-sm">Configurações</span>
                        </Button>

                        <Button
                          onClick={() => {
                            onLogout();
                            setIsUserDropdownOpen(false);
                          }}
                          className="w-full flex items-center space-x-3 px-4 py-2.5 text-left hover:bg-red-500/20 transition-colors duration-200 text-red-400 hover:text-red-300"
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="text-sm">Sair</span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Menu Button */}
                <Button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="md:hidden bg-white/8 hover:bg-white/12 border border-white/15 rounded-xl p-2 transition-all duration-300"
                >
                  {isMobileMenuOpen ? <X className="h-4 w-4 text-white" /> : <Menu className="h-4 w-4 text-white" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-2 bg-white/8 backdrop-blur-3xl border border-white/15 rounded-3xl shadow-2xl shadow-black/20 mx-4">
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
                      className={`w-full flex items-center space-x-3 p-4 rounded-2xl transition-all duration-300 ${isActive
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

      {/* Spacer to prevent content from going under the floating navbar */}
      <div className="h-20"></div>
    </>
  );
};

export default ModernNavbar;
