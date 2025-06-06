'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true); 
  const [mounted, setMounted] = useState(false);

  const applyTheme = (darkMode) => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  };

  useEffect(() => {
    setMounted(true);
    
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const shouldUseDark = savedTheme ? savedTheme === 'dark' : true; // Forçar dark como padrão
    
    setIsDark(shouldUseDark);
    applyTheme(shouldUseDark);
    
    if (!savedTheme) {
      localStorage.setItem('theme', shouldUseDark ? 'dark' : 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    
    setIsDark(newIsDark);
    applyTheme(newIsDark);
    
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light');
  };

  const value = {
    isDark,
    toggleTheme,
    mounted
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser usado dentro de um ThemeProvider');
  }
  return context;
} 