import { Calendar, User, Clock, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ActivityTimeline = ({ activities, onStatusChange, onActivityClick }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Feito':
        return { color: 'bg-green-500', textColor: 'text-green-600' };
      case 'Fazendo':
        return { color: 'bg-yellow-500', textColor: 'text-yellow-600' };
      default:
        return { color: 'bg-primary', textColor: 'text-primary' };
    }
  };

  return (
    <div className="space-y-6">
      {activities.map((activity, index) => {
        const statusConfig = getStatusConfig(activity.status);
        
        return (
          <div key={activity.id} className="relative">
            {/* Timeline line */}
            {index !== activities.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-border" />
            )}
            
            <div className="flex space-x-4">
              {/* Timeline dot */}
              <div className={`w-12 h-12 rounded-full ${statusConfig.color} flex items-center justify-center flex-shrink-0 mt-2`}>
                <Calendar className="h-5 w-5 text-white" />
              </div>
              
              {/* Content */}
              <div 
                className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-all duration-300 flex-1 cursor-pointer"
                onClick={() => onActivityClick(activity)}
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  {/* Main info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline" className="text-xs">
                        Semana {activity.week}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {activity.type}
                      </Badge>
                      {activity.isRequired && (
                        <Badge variant="outline" className="border-foreground text-foreground text-xs">
                          Obrigatória
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-2">{activity.name}</h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {activity.professor}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.date}
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-3">
                    {activity.url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(activity.url, '_blank');
                        }}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Abrir
                      </Button>
                    )}
                    
                    <Select 
                      value={activity.status} 
                      onValueChange={(value) => {
                        event?.stopPropagation();
                        onStatusChange(activity.id, value);
                      }}
                    >
                      <SelectTrigger 
                        className="w-32"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A Fazer">A Fazer</SelectItem>
                        <SelectItem value="Fazendo">Fazendo</SelectItem>
                        <SelectItem value="Feito">Feito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;