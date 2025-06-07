"use client"

import { useState } from 'react';
import { X, User, Palette, Bell, Shield, Lock, Info, Save, Camera } from 'lucide-react';
import { Button } from '../ui/button';

const SettingsModal = ({ isOpen, onClose, username = "Estudante" }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      name: username,
      email: '',
      bio: '',
      avatar: null
    },
    appearance: {
      theme: 'dark',
      accentColor: 'ada-red',
      animations: true,
      compactMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      activityReminders: true,
      weeklyDigest: false
    },
    privacy: {
      profileVisibility: 'private',
      activityVisibility: 'private',
      dataSharing: false
    }
  });

  const sections = [
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      description: 'Informações pessoais e avatar'
    },
    {
      id: 'appearance',
      label: 'Aparência',
      icon: Palette,
      description: 'Tema, cores e personalização'
    },
    {
      id: 'notifications',
      label: 'Notificações',
      icon: Bell,
      description: 'Preferências de notificação'
    },
    {
      id: 'account',
      label: 'Conta',
      icon: Shield,
      description: 'Configurações da conta'
    },
    {
      id: 'privacy',
      label: 'Privacidade',
      icon: Lock,
      description: 'Controle de privacidade'
    },
    {
      id: 'about',
      label: 'Sobre',
      icon: Info,
      description: 'Informações do sistema'
    }
  ];

  const updateSetting = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Informações do Perfil</h3>
        
        {/* Avatar Section */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative group">
            <div className="w-20 h-20 bg-gradient-to-br from-ada-red to-ada-accent rounded-full flex items-center justify-center">
              <User className="h-8 w-8 text-white" />
            </div>
            <Button className="absolute inset-0 w-20 h-20 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Camera className="h-5 w-5 text-white" />
            </Button>
          </div>
          <div>
            <h4 className="text-white font-medium">Foto do Perfil</h4>
            <p className="text-white/60 text-sm">Clique para alterar sua foto</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Nome</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) => updateSetting('profile', 'name', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              placeholder="Seu nome completo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) => updateSetting('profile', 'email', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Bio</label>
            <textarea
              value={settings.profile.bio}
              onChange={(e) => updateSetting('profile', 'bio', e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors resize-none"
              placeholder="Conte um pouco sobre você..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Personalização</h3>
        
        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Tema</label>
            <div className="grid grid-cols-2 gap-3">
              {['dark', 'light'].map((theme) => (
                <Button
                  key={theme}
                  onClick={() => updateSetting('appearance', 'theme', theme)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    settings.appearance.theme === theme
                      ? 'border-ada-accent bg-ada-accent/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-center">
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-full ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}></div>
                    <span className="text-white text-sm capitalize">{theme === 'dark' ? 'Escuro' : 'Claro'}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Cor de Destaque</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'ada-red', color: '#E30614', name: 'Ada Red' },
                { id: 'ada-accent', color: '#F24444', name: 'Ada Accent' },
                { id: 'blue', color: '#3B82F6', name: 'Azul' }
              ].map((color) => (
                <Button
                  key={color.id}
                  onClick={() => updateSetting('appearance', 'accentColor', color.id)}
                  className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                    settings.appearance.accentColor === color.id
                      ? 'border-white/40 bg-white/10'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color.color }}
                    ></div>
                    <span className="text-white text-sm">{color.name}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Toggle Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Animações</h4>
                <p className="text-white/60 text-sm">Ativar transições e animações</p>
              </div>
              <Button
                onClick={() => updateSetting('appearance', 'animations', !settings.appearance.animations)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.appearance.animations ? 'bg-ada-accent' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  settings.appearance.animations ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">Modo Compacto</h4>
                <p className="text-white/60 text-sm">Interface mais densa</p>
              </div>
              <Button
                onClick={() => updateSetting('appearance', 'compactMode', !settings.appearance.compactMode)}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.appearance.compactMode ? 'bg-ada-accent' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  settings.appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Preferências de Notificação</h3>

        <div className="space-y-4">
          {[
            { key: 'emailNotifications', label: 'Notificações por Email', desc: 'Receber atualizações por email' },
            { key: 'pushNotifications', label: 'Notificações Push', desc: 'Notificações no navegador' },
            { key: 'activityReminders', label: 'Lembretes de Atividades', desc: 'Lembrar sobre atividades pendentes' },
            { key: 'weeklyDigest', label: 'Resumo Semanal', desc: 'Relatório semanal de progresso' }
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{item.label}</h4>
                <p className="text-white/60 text-sm">{item.desc}</p>
              </div>
              <Button
                onClick={() => updateSetting('notifications', item.key, !settings.notifications[item.key])}
                className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                  settings.notifications[item.key] ? 'bg-ada-accent' : 'bg-white/20'
                }`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                  settings.notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                }`}></div>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Configurações da Conta</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Alterar Senha</label>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Senha atual"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              />
              <input
                type="password"
                placeholder="Nova senha"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/20">
            <h4 className="text-white font-medium mb-2">Zona de Perigo</h4>
            <Button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 transition-colors duration-200">
              Excluir Conta
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Controle de Privacidade</h3>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-3">Visibilidade do Perfil</label>
            <div className="space-y-2">
              {[
                { value: 'public', label: 'Público', desc: 'Visível para todos' },
                { value: 'private', label: 'Privado', desc: 'Apenas você pode ver' }
              ].map((option) => (
                <Button
                  key={option.value}
                  onClick={() => updateSetting('privacy', 'profileVisibility', option.value)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 ${
                    settings.privacy.profileVisibility === option.value
                      ? 'border-ada-accent bg-ada-accent/20'
                      : 'border-white/20 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="text-left">
                    <p className="text-white font-medium">{option.label}</p>
                    <p className="text-white/60 text-sm">{option.desc}</p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${
                    settings.privacy.profileVisibility === option.value
                      ? 'border-ada-accent bg-ada-accent'
                      : 'border-white/40'
                  }`}></div>
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-medium">Compartilhamento de Dados</h4>
              <p className="text-white/60 text-sm">Permitir análise de dados para melhorias</p>
            </div>
            <Button
              onClick={() => updateSetting('privacy', 'dataSharing', !settings.privacy.dataSharing)}
              className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                settings.privacy.dataSharing ? 'bg-ada-accent' : 'bg-white/20'
              }`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                settings.privacy.dataSharing ? 'translate-x-6' : 'translate-x-1'
              }`}></div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAboutSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Sobre o AdaLove</h3>

        <div className="space-y-4">
          <div className="bg-white/5 border border-white/20 rounded-xl p-4">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-ada-red to-ada-accent rounded-2xl flex items-center justify-center">
                <img src="/logo.png" alt="AdaLove" className="h-8 w-8 object-contain" />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg">AdaLove 2.0</h4>
                <p className="text-white/60">A AdaLove reimaginada chegou.</p>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/60">Versão:</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Última atualização:</span>
                <span className="text-white">Junho 2025</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Desenvolvido por:</span>
                <span className="text-white">Davi Duarte, CC.2025</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-colors duration-200">
              Termos de Uso
            </Button>
            <Button className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-colors duration-200">
              Política de Privacidade
            </Button>
            <Button className="w-full p-3 bg-white/5 hover:bg-white/10 border border-white/20 rounded-xl text-white transition-colors duration-200">
              Suporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Configurações</h2>
          <Button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        <div className="flex h-[calc(100%-80px)]">
          {/* Sidebar */}
          <div className="w-64 border-r border-white/20 p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <Button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-white/15 text-white border border-white/25'
                        : 'text-white/70 hover:text-white hover:bg-white/8'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">{section.label}</p>
                      <p className="text-xs opacity-70">{section.description}</p>
                    </div>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'appearance' && renderAppearanceSection()}
            {activeSection === 'notifications' && renderNotificationsSection()}
            {activeSection === 'account' && renderAccountSection()}
            {activeSection === 'privacy' && renderPrivacySection()}
            {activeSection === 'about' && renderAboutSection()}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/20 bg-white/5 backdrop-blur-sm">
          <div className="flex justify-end space-x-3">
            <Button
              onClick={onClose}
              className="px-6 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-white transition-colors duration-200"
            >
              Cancelar
            </Button>
            <Button
              className="px-6 py-2 bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 rounded-xl text-white transition-all duration-200 flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
