import { LayoutGrid, Clock, User } from 'lucide-react';
import { Button } from '../ui/button';

const ViewToggle = ({ viewMode, onViewModeChange }) => {
  const views = [
    { id: 'cards', icon: LayoutGrid, label: 'Cards' },
    { id: 'timeline', icon: Clock, label: 'Timeline' },
    { id: 'table', icon: User, label: 'Tabela' }
  ];

  return (
    <div className="flex rounded-lg bg-muted p-1">
      {views.map((view) => {
        const Icon = view.icon;
        return (
          <Button
            key={view.id}
            variant={viewMode === view.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange(view.id)}
            className={`flex items-center space-x-2 ${
              viewMode === view.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted-foreground/10"
            }`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{view.label}</span>
          </Button>
        );
      })}
    </div>
  );
};

export default ViewToggle;