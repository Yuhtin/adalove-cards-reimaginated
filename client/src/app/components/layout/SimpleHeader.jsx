import { useState, useEffect } from 'react';
import { User, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const SimpleHeader = ({ 
  isDark, 
  onThemeToggle, 
  username = "Estudante", 
  userAvatar,
  onSettingsClick,
  onLogout 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when popover is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      <header className="fixed top-4 right-4 z-50">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              className="h-12 w-12 rounded-full p-0 bg-card/90 backdrop-blur-md hover:bg-card border border-border shadow-lg"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={userAvatar} alt={username} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-64 bg-card/95 backdrop-blur-md border-border shadow-xl" 
            align="end"
            sideOffset={8}
          >
            <div className="space-y-3">
              {/* User info */}
              <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar} alt={username} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{username}</p>
                  <p className="text-sm text-muted-foreground">Estudante Inteli</p>
                </div>
              </div>
              
              {/* Actions */}
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-muted"
                  onClick={() => {
                    onSettingsClick();
                    setIsOpen(false);
                  }}
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Configurações
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start hover:bg-muted"
                  onClick={onThemeToggle}
                >
                  {isDark ? <Sun className="h-4 w-4 mr-3" /> : <Moon className="h-4 w-4 mr-3" />}
                  {isDark ? 'Modo Claro' : 'Modo Escuro'}
                </Button>
                
                <div className="border-t border-border my-2" />
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4 mr-3" />
                  Sair
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </header>
    </>
  );
};

export default SimpleHeader;