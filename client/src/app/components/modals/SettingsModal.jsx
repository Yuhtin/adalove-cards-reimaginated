"use client"

import { useState, useEffect } from 'react';
import { X, User, Palette, Bell, Shield, Lock, Info, Save, Camera, Loader2, Database, Upload, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { auth, dataImport } from '../../../lib/api';
import { settings } from '../../../lib/settings';
import { toast } from '../ui/use-toast';
import { validateFile, validateJsonContent, formatFileSize, getStatusDisplay, estimateProcessingTime, pollImportStatus } from '../../../lib/dataImport';

const SettingsModal = ({ isOpen, onClose, username = "Estudante", onUserUpdate }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [userSettings, setUserSettings] = useState({
    profile: {
      name: username,
      email: '',
      iconUrl: null
    },
    appearance: settings.get('appearance'),
    passwords: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

  // Data import state
  const [importState, setImportState] = useState({
    isUploading: false,
    uploadProgress: 0,
    importJobId: null,
    importStatus: 'idle', // idle, uploading, processing, completed, error
    importError: null,
    dragActive: false
  });

  const [importStats, setImportStats] = useState({
    totalActivities: 0,
    totalSections: 0,
    totalUsers: 0,
    lastImportDate: null
  });

  const [importHistory, setImportHistory] = useState([]);

  // Load user profile when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUserProfile();
      loadImportData();
      // Load settings from localStorage
      setUserSettings(prev => ({
        ...prev,
        appearance: settings.get('appearance')
      }));
    }
  }, [isOpen]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      const profile = await auth.getProfile();
      setUserSettings(prev => ({
        ...prev,
        profile: {
          name: profile.username,
          email: profile.email || '',
          iconUrl: profile.iconUrl
        }
      }));
    } catch (error) {
      console.error('Error loading profile:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar o perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadImportData = async () => {
    try {
      const [stats, history] = await Promise.all([
        dataImport.getStatistics(),
        dataImport.getImportHistory()
      ]);

      setImportStats(stats);
      setImportHistory(history);
    } catch (error) {
      console.error('Error loading import data:', error);
    }
  };

  const handleFileUpload = async (file) => {
    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.isValid) {
      toast({
        title: "Arquivo inválido",
        description: fileValidation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    // Validate JSON content
    const contentValidation = await validateJsonContent(file);
    if (!contentValidation.isValid) {
      toast({
        title: "Conteúdo inválido",
        description: contentValidation.errors.join(', '),
        variant: "destructive"
      });
      return;
    }

    try {
      setImportState(prev => ({ ...prev, isUploading: true, uploadProgress: 0 }));

      const result = await dataImport.uploadFile(file, (progress) => {
        setImportState(prev => ({ ...prev, uploadProgress: progress }));
      });

      setImportState(prev => ({
        ...prev,
        isUploading: false,
        importJobId: result.jobId,
        importStatus: 'processing'
      }));

      // Start polling for status updates
      pollImportStatus(result.jobId, (status) => {
        setImportState(prev => ({ ...prev, ...status }));

        if (status.status === 'completed') {
          toast({
            title: "Importação concluída",
            description: `${status.recordsProcessed} registros importados com sucesso`,
          });
          loadImportData(); // Refresh stats and history
        } else if (status.status === 'error') {
          toast({
            title: "Erro na importação",
            description: status.error || "Erro desconhecido",
            variant: "destructive"
          });
        }
      });

      toast({
        title: "Upload iniciado",
        description: `Arquivo ${file.name} enviado. Processamento iniciado.`,
      });

    } catch (error) {
      setImportState(prev => ({
        ...prev,
        isUploading: false,
        importStatus: 'error',
        importError: error.message
      }));

      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setImportState(prev => ({ ...prev, dragActive: true }));
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setImportState(prev => ({ ...prev, dragActive: false }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setImportState(prev => ({ ...prev, dragActive: false }));

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const cancelImport = async () => {
    if (importState.importJobId) {
      try {
        await dataImport.cancelImport(importState.importJobId);
        setImportState(prev => ({
          ...prev,
          importStatus: 'cancelled',
          importJobId: null
        }));
        toast({
          title: "Importação cancelada",
          description: "O processo de importação foi cancelado",
        });
      } catch (error) {
        toast({
          title: "Erro ao cancelar",
          description: error.message,
          variant: "destructive"
        });
      }
    }
  };

  const sections = [
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      description: 'Informações pessoais e avatar'
    },
    {
      id: 'data',
      label: 'Dados',
      icon: Database,
      description: 'Importação e migração de dados'
    },
    {
      id: 'account',
      label: 'Conta',
      icon: Shield,
      description: 'Configurações da conta'
    },
    {
      id: 'about',
      label: 'Sobre',
      icon: Info,
      description: 'Informações do sistema'
    }
  ];

  const updateSetting = (section, key, value) => {
    const newSettings = {
      ...userSettings,
      [section]: {
        ...userSettings[section],
        [key]: value
      }
    };

    setUserSettings(newSettings);

    // Apply appearance changes immediately
    if (section === 'appearance') {
      const updatedAppearance = newSettings.appearance;
      settings.update('appearance', updatedAppearance);

      console.log('Updating appearance:', key, value);
      console.log('New appearance settings:', updatedAppearance);

      // Force immediate application
      setTimeout(() => {
        settings.applyAppearanceSettings(updatedAppearance);
      }, 0);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // Save profile changes
      if (userSettings.profile.name !== username) {
        const response = await auth.updateProfile({
          username: userSettings.profile.name,
          iconUrl: userSettings.profile.iconUrl
        });

        // Update parent component with new username
        if (onUserUpdate) {
          onUserUpdate(response.user);
        }

        toast({
          title: "Sucesso",
          description: "Perfil atualizado com sucesso",
        });
      }

      // Save password changes
      if (userSettings.passwords.currentPassword && userSettings.passwords.newPassword) {
        if (userSettings.passwords.newPassword !== userSettings.passwords.confirmPassword) {
          toast({
            title: "Erro",
            description: "As senhas não coincidem",
            variant: "destructive"
          });
          return;
        }

        await auth.changePassword({
          oldPassword: userSettings.passwords.currentPassword,
          newPassword: userSettings.passwords.newPassword
        });

        toast({
          title: "Sucesso",
          description: "Senha alterada com sucesso",
        });

        // Clear password fields
        setUserSettings(prev => ({
          ...prev,
          passwords: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          }
        }));
      }

      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: "Erro",
        description: error.response?.data?.message || "Erro ao salvar configurações",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const renderProfileSection = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Informações do Perfil</h3>

        {/* Avatar Section */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative group">
            {userSettings.profile.iconUrl ? (
              <img
                src={userSettings.profile.iconUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-ada-red to-ada-accent rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
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
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Nome</label>
            <input
              type="text"
              value={userSettings.profile.name}
              onChange={(e) => updateSetting('profile', 'name', e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              placeholder="Seu nome completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
            <input
              type="email"
              value={userSettings.profile.email}
              readOnly
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/60 cursor-not-allowed"
              placeholder="seu@email.com"
            />
            <p className="text-xs text-white/50 mt-1">Email não pode ser alterado</p>
          </div>
        </div>

        <Button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-2 bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 rounded-xl text-white transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Salvar</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderDataSection = () => {
    const statusDisplay = getStatusDisplay(importState.importStatus);

    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Importação de Autoestudos</h3>
          <p className="text-white/60 text-sm mb-6">
            Importe o arquivo JSON oficial exportado do AdaLove 1.0 para migrar seus autoestudos para o AdaLove 2.0
          </p>

          {/* Import Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Database className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Minhas Atividades</p>
                  <p className="text-white font-semibold text-lg">{importStats.totalActivities}</p>
                </div>
              </div>
            </div>

            <div className="bg-white/5 border border-white/20 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Upload className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <p className="text-white/60 text-sm">Importações</p>
                  <p className="text-white font-semibold text-lg">{importStats.totalImports || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* File Upload Area */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white/80 mb-3">Importar Meus Autoestudos</label>
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${importState.dragActive
                ? 'border-ada-accent bg-ada-accent/10'
                : 'border-white/20 hover:border-white/40'
                }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={importState.isUploading || importState.importStatus === 'processing'}
              />

              <div className="space-y-4">
                <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto">
                  <Upload className="h-8 w-8 text-white/60" />
                </div>

                <div>
                  <p className="text-white font-medium mb-2">
                    Arraste o arquivo JSON oficial aqui ou clique para selecionar
                  </p>
                  <p className="text-white/60 text-sm">
                    Export oficial do AdaLove 1.0 (formato: response.json - máximo 10MB)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Import Progress */}
          {(importState.isUploading || importState.importStatus === 'processing') && (
            <div className="bg-white/5 border border-white/20 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-6 h-6 ${statusDisplay.color}`}>
                    {importState.isUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <Clock className="h-6 w-6" />
                    )}
                  </div>
                  <span className="text-white font-medium">
                    {importState.isUploading ? 'Enviando arquivo...' : 'Processando dados...'}
                  </span>
                </div>

                {importState.importJobId && (
                  <Button
                    onClick={cancelImport}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded text-red-400 text-sm"
                  >
                    Cancelar
                  </Button>
                )}
              </div>

              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-ada-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${importState.uploadProgress}%` }}
                ></div>
              </div>

              <p className="text-white/60 text-sm mt-2">
                {importState.uploadProgress}% concluído
              </p>
            </div>
          )}

          {/* Import Status */}
          {importState.importStatus !== 'idle' && !importState.isUploading && (
            <div className={`bg-white/5 border rounded-xl p-4 mb-6 ${importState.importStatus === 'completed' ? 'border-green-500/30' :
              importState.importStatus === 'error' ? 'border-red-500/30' :
                'border-white/20'
              }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-6 h-6 ${statusDisplay.color}`}>
                  {importState.importStatus === 'completed' && <CheckCircle className="h-6 w-6" />}
                  {importState.importStatus === 'error' && <AlertCircle className="h-6 w-6" />}
                  {importState.importStatus === 'processing' && <Clock className="h-6 w-6" />}
                </div>
                <div>
                  <p className="text-white font-medium">{statusDisplay.label}</p>
                  {importState.importError && (
                    <p className="text-red-400 text-sm">{importState.importError}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Import History */}
          {importHistory.length > 0 && (
            <div>
              <h4 className="text-white font-medium mb-3">Histórico de Importações</h4>
              <div className="space-y-2">
                {importHistory.slice(0, 5).map((job) => {
                  const statusDisplay = getStatusDisplay(job.status);
                  return (
                    <div key={job.id} className="bg-white/5 border border-white/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 ${statusDisplay.color}`}>
                            {job.status === 'completed' && <CheckCircle className="h-4 w-4" />}
                            {job.status === 'error' && <AlertCircle className="h-4 w-4" />}
                            {job.status === 'processing' && <Clock className="h-4 w-4" />}
                          </div>
                          <div>
                            <p className="text-white text-sm font-medium">{job.filename}</p>
                            <p className="text-white/60 text-xs">
                              {formatFileSize(job.file_size)} • {job.records_processed || 0}/{job.estimated_records} registros
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-medium ${statusDisplay.color}`}>
                            {statusDisplay.label}
                          </p>
                          <p className="text-white/60 text-xs">
                            {new Date(job.created_at).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      {job.error_message && (
                        <p className="text-red-400 text-xs mt-2">{job.error_message}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

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
                value={userSettings.passwords.currentPassword}
                onChange={(e) => updateSetting('passwords', 'currentPassword', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              />
              <input
                type="password"
                placeholder="Nova senha (mínimo 6 caracteres)"
                value={userSettings.passwords.newPassword}
                onChange={(e) => updateSetting('passwords', 'newPassword', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              />
              <input
                type="password"
                placeholder="Confirmar nova senha"
                value={userSettings.passwords.confirmPassword}
                onChange={(e) => updateSetting('passwords', 'confirmPassword', e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-ada-accent transition-colors"
              />
              {userSettings.passwords.newPassword && userSettings.passwords.confirmPassword &&
                userSettings.passwords.newPassword !== userSettings.passwords.confirmPassword && (
                  <p className="text-red-400 text-sm">As senhas não coincidem</p>
                )}
              {userSettings.passwords.newPassword && userSettings.passwords.newPassword.length < 6 && (
                <p className="text-red-400 text-sm">A senha deve ter pelo menos 6 caracteres</p>
              )}
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 rounded-xl text-white transition-all duration-200 flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Salvando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Salvar</span>
              </>
            )}
          </Button>
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
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 glassmorphism backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-4xl h-[80vh] bg-white/10 backdrop-blur-3xl border border-white/20 rounded-3xl shadow-2xl shadow-black/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-xl font-bold text-white">Configurações</h2>
          <Button
            onClick={onClose}
            className="p-2  bg-white/05 border-white/10 hover:bg-white/10 hover:border-white/20 border backdrop-blur-sm rounded-xl transition-colors duration-200"
          >
            <X className="h-5 w-5 text-white" />
          </Button>
        </div>

        <div className="flex h-[calc(100%-80px)]">
          {/* Sidebar */}
          <div className="w-55 border-r border-white/20 p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;

                return (
                  <Button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={` flex items-center space-x-3 px-4 py-3 bg-white/05 hover:bg-white/10 rounded-xl transition-all duration-200 ${isActive
                      ? 'bg-white/15 text-white border border-white/25'
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                      }`}
                  >
                    <Icon className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">{section.label}</p>
                    </div>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'profile' && renderProfileSection()}
            {activeSection === 'data' && renderDataSection()}
            {activeSection === 'account' && renderAccountSection()}
            {activeSection === 'about' && renderAboutSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;