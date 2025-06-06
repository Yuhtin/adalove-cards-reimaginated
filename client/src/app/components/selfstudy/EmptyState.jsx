
import { Book, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const EmptyState = ({ onImportClick }) => {
  return (
    <div className="text-center py-16 animate-fade-in">
      <div className="relative mb-8">
        <Book className="h-24 w-24 mx-auto text-gray-300 dark:text-gray-600" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-ada-red rounded-full animate-pulse" />
      </div>
      
      <h3 className="text-xl font-semibold mb-2">Nenhuma atividade encontrada</h3>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        Parece que você ainda não tem atividades cadastradas ou os filtros aplicados não retornaram resultados.
      </p>
      
      <Button 
        onClick={onImportClick}
        className="bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 text-white"
      >
        <Download className="h-4 w-4 mr-2" />
        Importar Atividades
      </Button>
    </div>
  );
};

export default EmptyState;
