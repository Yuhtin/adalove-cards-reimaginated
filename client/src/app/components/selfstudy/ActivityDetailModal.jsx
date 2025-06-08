import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { User, Calendar, Star, Link, BookOpen, Tag, ExternalLink } from 'lucide-react';

const ActivityDetailModal = ({ activity, isOpen, onClose }) => {
  if (!activity) return null;

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Feito':
        return { color: 'bg-green-500', label: 'Feito' };
      case 'Fazendo':
        return { color: 'bg-yellow-500', label: 'Fazendo' };
      case 'A fazer':
        return { color: 'bg-gray-500', label: 'A Fazer' };
      default:
        return { color: 'bg-gray-500', label: 'A Fazer' };
    }
  };

  const statusConfig = getStatusConfig(activity.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glassmorphism border-primary/20">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold pr-8">
            Detalhes da Atividade
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Nome da Atividade */}
          <div className="space-y-2">
            <h3 className="font-semibold text-xl leading-tight">{activity.name}</h3>
            <div className="flex items-center space-x-2">
              <Badge className={`${statusConfig.color} text-white`}>
                {statusConfig.label}
              </Badge>
              {activity.isRequired && (
                <Badge variant="destructive" className="bg-primary text-white">
                  <Star className="h-3 w-3 mr-1" />
                  Obrigatória
                </Badge>
              )}
            </div>
          </div>

          {/* Informações */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <User className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Professor</p>
                <p className="font-medium">{activity.professor}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Data</p>
                <p className="font-medium">{activity.date}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <BookOpen className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Semana</p>
                <p className="font-medium">Semana {activity.week}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Tag className="h-4 w-4 text-primary flex-shrink-0" />
              <div>
                <p className="text-sm text-muted-foreground">Tipo</p>
                <p className="font-medium">{activity.type}</p>
              </div>
            </div>

            {activity.url && (
              <div className="flex items-center space-x-3">
                <Link className="h-4 w-4 text-primary flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">URL</p>
                  <Button
                    variant="link"
                    className="p-0 h-auto font-medium text-primary hover:text-accent"
                    onClick={() => window.open(activity.url, '_blank')}
                  >
                    <span className="truncate max-w-[200px]">{activity.url}</span>
                    <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ActivityDetailModal;