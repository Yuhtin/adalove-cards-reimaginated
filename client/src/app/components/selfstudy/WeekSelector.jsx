import { Calendar, ChevronRight, CheckCircle } from 'lucide-react';

const WeekSelector = ({ onWeekSelect, activitiesByWeek }) => {
  // Fix sorting: ensure numerical sort instead of lexicographical
  const weeks = Object.keys(activitiesByWeek)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {weeks.map((week, index) => {
        const weekData = activitiesByWeek[week];
        const progressPercentage = weekData.total > 0 ? (weekData.completed / weekData.total) * 100 : 0;
        const isCompleted = weekData.completed === weekData.total && weekData.total > 0;

        return (
          <div
            key={week}
            className={`group relative glassmorphism rounded-3xl p-6 cursor-pointer hover:scale-105 transition-all duration-300 bg-white/5 backdrop-blur-xl shadow-xl hover:shadow-2xl animate-fade-in min-h-[220px] flex flex-col ${
              isCompleted
                ? 'border-2 border-green-400 hover:border-green-300 hover:shadow-green-400/20'
                : 'border border-white/20 hover:border-ada-red/30 hover:shadow-ada-red/20'
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onWeekSelect(week)}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                  isCompleted
                    ? 'bg-gradient-to-br from-green-500/20 to-green-400/20 border-green-400/50'
                    : 'bg-gradient-to-br from-ada-red/20 to-ada-accent/20 border-ada-red/20'
                }`}>
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <Calendar className="h-6 w-6 text-ada-red" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Semana {week}</h3>
                  <p className="text-sm text-slate-400">{weekData.total} atividades</p>
                </div>
              </div>
              <ChevronRight className={`h-5 w-5 group-hover:translate-x-1 transition-all duration-200 ${
                isCompleted
                  ? 'text-green-400 group-hover:text-green-300'
                  : 'text-slate-400 group-hover:text-ada-red'
              }`} />
            </div>

            {/* Progress Section */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="space-y-4 pb-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Progresso</span>
                  <span className="text-sm font-semibold text-white">{weekData.completed}/{weekData.total}</span>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="relative">
                  <div className="w-full h-3 bg-slate-800/50 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-ada-red via-ada-accent to-ada-red bg-size-200 animate-gradient-x transition-all duration-700 rounded-full relative"
                      style={{ width: `${progressPercentage}%` }}
                    >
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-xs text-slate-400">0%</span>
                    <span className="text-xs font-medium text-white">{Math.round(progressPercentage)}%</span>
                    <span className="text-xs text-slate-400">100%</span>
                  </div>
                </div>
              </div>

              {/* Status Details - Always show for consistency */}
              <div className="h-6 flex items-center">
                <div className="flex justify-between items-center text-xs w-full">
                  <span className="text-green-300 font-medium">
                    {weekData.completed || 0} Feitos
                  </span>
                  <span className="text-yellow-300 font-medium">
                    {weekData.inProgress || 0} Fazendo
                  </span>
                  <span className="text-slate-300 font-medium">
                    {weekData.pending || 0} A Fazer
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Effect Overlay */}
            <div className={`absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${
              isCompleted
                ? 'bg-gradient-to-br from-green-400/5 to-green-500/5'
                : 'bg-gradient-to-br from-ada-red/5 to-ada-accent/5'
            }`}></div>
          </div>
        );
      })}
    </div>
  );
};

export default WeekSelector;