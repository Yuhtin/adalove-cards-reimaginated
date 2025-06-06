import { Calendar, ChevronRight, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const WeekSelector = ({ onWeekSelect, activitiesByWeek }) => {
  const weeks = Object.keys(activitiesByWeek).map(Number).sort();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {weeks.map((week, index) => {
        const weekData = activitiesByWeek[week];
        const progressPercentage = weekData.total > 0 ? (weekData.completed / weekData.total) * 100 : 0;
        
        return (
          <Card 
            key={week}
            className="glassmorphism cursor-pointer hover:scale-105 transition-all duration-300 border-primary/20 animate-fade-in group bg-card/50"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onWeekSelect(week)}
          >
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <span>Semana {week}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Atividades</span>
                <span className="font-medium">{weekData.completed}/{weekData.total}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </div>

              {weekData.completed === weekData.total && weekData.total > 0 && (
                <div className="flex items-center space-x-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  <span>Completa</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WeekSelector;