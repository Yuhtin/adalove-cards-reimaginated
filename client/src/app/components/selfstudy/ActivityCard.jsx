import { User, Calendar, Clock, ExternalLink, BookOpen } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const ActivityCard = ({ activity, onStatusChange, onActivityClick, index }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Feito':
        return { 
          color: 'bg-green-500', 
          badge: 'bg-green-500/10 text-green-600 border-green-500/20', 
          label: 'Feito'
        };
      case 'Fazendo':
        return { 
          color: 'bg-yellow-500', 
          badge: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20', 
          label: 'Fazendo'
        };
      default:
        return { 
          color: 'bg-primary', 
          badge: 'bg-primary/10 text-primary border-primary/20', 
          label: 'A Fazer'
        };
    }
  };

  const statusConfig = getStatusConfig(activity.status);

  return (
    <div 
      className="bg-card rounded-2xl p-6 border border-border hover:shadow-lg transition-all duration-300 animate-fade-in relative group cursor-pointer min-h-[280px]"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onActivityClick(activity)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Autoestudo</span>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusConfig.color}`} />
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg leading-tight mb-3 text-foreground pr-4">
        {activity.name}
      </h3>

      {/* Professor */}
      <div className="flex items-center text-sm text-muted-foreground mb-3">
        <User className="h-4 w-4 mr-2" />
        {activity.professor}
      </div>

      {/* Status Badges */}
      <div className="flex flex-wrap gap-2 mb-4">
        {!activity.isRequired && (
          <Badge variant="destructive" className="bg-primary text-primary-foreground text-xs">
            Atividade não ponderada
          </Badge>
        )}
        {activity.isRequired && (
          <Badge variant="outline" className="border-foreground text-foreground text-xs">
            Atividade obrigatória
          </Badge>
        )}
      </div>

      {/* Description */}
      <div className="mb-4">
        <h4 className="font-semibold text-sm mb-2 flex items-center">
          <span className="w-4 h-4 mr-2">📝</span>
          Descrição
        </h4>
        <p className="text-sm text-muted-foreground line-clamp-2">
          Compreender o conceito e importância da atividade para o desenvolvimento acadêmico e profissional.
        </p>
      </div>

      {/* Footer */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            {activity.date}
          </div>
          {activity.url && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-1 text-primary hover:text-accent"
              onClick={(e) => {
                e.stopPropagation();
                window.open(activity.url, '_blank');
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Status Dropdown */}
        <Select 
          value={activity.status} 
          onValueChange={(value) => {
            event?.stopPropagation();
            onStatusChange(activity.id, value);
          }}
        >
          <SelectTrigger 
            className="w-full border-border focus:border-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border border-border">
            <SelectItem value="A Fazer">A Fazer</SelectItem>
            <SelectItem value="Fazendo">Fazendo</SelectItem>
            <SelectItem value="Feito">Feito</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ActivityCard;