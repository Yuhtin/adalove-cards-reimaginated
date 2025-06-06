import { ExternalLink, User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ActivityTable = ({ activities, onStatusChange, onActivityClick }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Feito':
        return <Badge className="bg-green-500 text-white">Feito</Badge>;
      case 'Fazendo':
        return <Badge className="bg-yellow-500 text-white">Fazendo</Badge>;
      default:
        return <Badge className="bg-primary text-primary-foreground">A Fazer</Badge>;
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border">
            <TableHead className="font-semibold">Atividade</TableHead>
            <TableHead className="font-semibold">Professor</TableHead>
            <TableHead className="font-semibold">Semana</TableHead>
            <TableHead className="font-semibold">Tipo</TableHead>
            <TableHead className="font-semibold">Data</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <TableRow 
              key={activity.id} 
              className="border-border hover:bg-muted/50 cursor-pointer"
              onClick={() => onActivityClick(activity)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{activity.name}</div>
                  <div className="flex space-x-1">
                    {activity.isRequired && (
                      <Badge variant="outline" className="border-foreground text-foreground text-xs">
                        Obrigatória
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  {activity.professor}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">Semana {activity.week}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="text-xs">
                  {activity.type}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {activity.date}
                </div>
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                {activity.url && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(activity.url, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ActivityTable;