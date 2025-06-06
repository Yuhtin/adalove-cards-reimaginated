import { useState } from 'react';
import { User, Moon, Sun, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ currentPage, onPageChange, isDark, onThemeToggle, username = "Estudante" }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'selfstudy', label: 'Autoestudos' }
  ];

  return (
    <header className="sticky top-0 z-50 glassmorphism border-b border-ada-red/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ada-red to-ada-accent flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
          <span className="text-xl font-bold gradient-text">AdaLove 2</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={currentPage === item.id ? "default" : "ghost"}
              onClick={() => onPageChange(item.id)}
              className={currentPage === item.id ? 
                "bg-gradient-to-r from-ada-red to-ada-accent text-white" : 
                "hover:bg-ada-red/10"
              }
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            className="hover:bg-ada-red/10"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-lg glassmorphism">
            <User className="h-4 w-4 text-ada-red" />
            <span className="text-sm font-medium">{username}</span>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 glassmorphism border-b border-ada-red/10 animate-fade-in">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Button
                key={item.id}
                variant={currentPage === item.id ? "default" : "ghost"}
                onClick={() => {
                  onPageChange(item.id);
                  setIsMenuOpen(false);
                }}
                className={`w-full justify-start ${
                  currentPage === item.id ? 
                    "bg-gradient-to-r from-ada-red to-ada-accent text-white" : 
                    "hover:bg-ada-red/10"
                }`}
              >
                {item.label}
              </Button>
            ))}
            <div className="flex items-center space-x-2 px-3 py-2">
              <User className="h-4 w-4 text-ada-red" />
              <span className="text-sm font-medium">{username}</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};