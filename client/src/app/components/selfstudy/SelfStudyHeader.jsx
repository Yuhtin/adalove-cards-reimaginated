import { ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';

const SelfStudyHeader = ({ showWeekSelector, selectedWeek, onBackToWeeks }) => {
  return (
    <div className="text-center space-y-4 animate-fade-in">
      {!showWeekSelector && selectedWeek && (
        <Button
          variant="ghost"
          onClick={onBackToWeeks}
          className="mb-4 hover:bg-primary/10"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar às semanas
        </Button>
      )}
      
      <h1 className="text-4xl font-bold">
        {showWeekSelector ? (
          <>Semanas de Autoestudo <span className="text-4xl">📚</span></>
        ) : (
          <>Autoestudos da Semana {selectedWeek} <span className="text-4xl">✨</span></>
        )}
      </h1>
      
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        {showWeekSelector 
          ? 'Selecione uma semana para visualizar e gerenciar suas atividades'
          : 'Gerencie suas atividades com estilo e eficiência'
        }
      </p>
    </div>
  );
};

export default SelfStudyHeader;