import { Download, X } from 'lucide-react';
import { Button } from '../ui/button';

const ImportModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative glassmorphism rounded-2xl p-8 max-w-md w-full mx-4 border border-ada-red/20 animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-ada-red/10 rounded-lg transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-ada-red to-ada-accent rounded-full flex items-center justify-center mx-auto mb-6">
            <Download className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold mb-4 gradient-text">Importar da AdaLove</h2>
          
          <p className="text-muted-foreground mb-6">
            Em breve você poderá importar suas atividades diretamente da plataforma AdaLove original. 
            Esta funcionalidade está sendo desenvolvida para facilitar a migração dos seus dados.
          </p>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-ada-red/20 hover:bg-ada-red/10"
            >
              Fechar
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 text-white"
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
