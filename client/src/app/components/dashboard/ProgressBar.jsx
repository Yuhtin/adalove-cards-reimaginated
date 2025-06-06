const ProgressBar = ({ completed, inProgress, total }) => {
  const percentage = total > 0 ? Math.round(((completed + inProgress * 0.5) / total) * 100) : 0;
  
  return (
    <div className="glassmorphism rounded-2xl p-6 border border-ada-red/10 animate-fade-in" style={{ animationDelay: '400ms' }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Progresso Geral</h3>
        <span className="text-2xl font-bold text-ada-red">{percentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-ada-red to-ada-accent transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{completed} concluídas</span>
        <span>{inProgress} em andamento</span>
        <span>{total - completed - inProgress} pendentes</span>
      </div>
      
      <div className="mt-4 p-3 bg-ada-red/5 rounded-lg">
        <p className="text-sm text-center">
          <span className="font-semibold text-ada-red">{completed + inProgress}</span> de <span className="font-semibold">{total}</span> atividades obrigatórias
        </p>
      </div>
    </div>
  );
};

export default ProgressBar;