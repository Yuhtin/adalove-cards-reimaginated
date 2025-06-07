import { useState, useRef } from 'react';
import { User, Lock, Upload, Download, X, Camera } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
const UserSettingsModal = ({
  isOpen,
  onClose,
  username,
  userAvatar,
  onAvatarChange,
  onPasswordChange,
  onDataImport
}) => {
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
      alert('As senhas não coincidem');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await onPasswordChange(passwords.current, passwords.new);
      setPasswords({ current: '', new: '', confirm: '' });
      alert('Senha alterada com sucesso!');
    } catch (error) {
      alert('Erro ao alterar senha');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onAvatarChange(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      onDataImport(file);
    } else {
      alert('Por favor, selecione um arquivo JSON válido');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative glassmorphism rounded-2xl max-w-md w-full mx-4 border border-primary/20 animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-primary/10 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          <CardTitle className="text-2xl font-bold gradient-text">
            Configurações
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Foto de Perfil
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={userAvatar} alt={username} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                    {username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <button
                  onClick={() => avatarInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 p-2 bg-primary rounded-full text-white hover:bg-primary/80 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              
              <div>
                <p className="font-medium">{username}</p>
                <p className="text-sm text-muted-foreground">Estudante</p>
              </div>
            </div>
            
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
          
          {/* Password Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Lock className="h-5 w-5 mr-2" />
              Alterar Senha
            </h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="password"
                placeholder="Senha atual"
                value={passwords.current}
                onChange={(e) => setPasswords(prev => ({ ...prev, current: e.target.value }))}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                required
              />
              
              <input
                type="password"
                placeholder="Nova senha"
                value={passwords.new}
                onChange={(e) => setPasswords(prev => ({ ...prev, new: e.target.value }))}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                required
              />
              
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={passwords.confirm}
                onChange={(e) => setPasswords(prev => ({ ...prev, confirm: e.target.value }))}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                required
              />
              
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/80 hover:to-accent/80 text-white"
              >
                {isChangingPassword ? 'Alterando...' : 'Alterar Senha'}
              </Button>
            </form>
          </div>
          
          {/* Import Data Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center">
              <Download className="h-5 w-5 mr-2" />
              Importar Dados
            </h3>
            
            <p className="text-sm text-muted-foreground">
              Importe seus dados da AdaLove original através de um arquivo JSON.
            </p>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileImport}
              className="hidden"
            />
            
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full border-primary/20 hover:bg-primary/10"
            >
              <Upload className="h-4 w-4 mr-2" />
              Selecionar Arquivo JSON
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserSettingsModal;
