import { Clock, User } from 'lucide-react';

const RecentActivities = ({ activities }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'done':
        return { color: 'bg-green-500', badge: 'bg-green-500/10 text-green-600', label: 'Feito' };
      case 'doing':
        return { color: 'bg-yellow-500', badge: 'bg-yellow-500/10 text-yellow-600', label: 'Fazendo' };
      default:
        return { color: 'bg-gray-500', badge: 'bg-gray-500/10 text-gray-600', label: 'A Fazer' };
    }
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 border border-ada-red/10 animate-fade-in" style={{ animationDelay: '600ms' }}>
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Clock className="h-5 w-5 mr-2 text-ada-red" />
        Atividades Recentes
      </h3>
      
      <div className="space-y-4">
        {activities.slice(0, 5).map((activity) => {
          const statusConfig = getStatusConfig(activity.status);
          
          return (
            <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-ada-red/5 transition-colors">
              <div className={`w-3 h-3 rounded-full ${statusConfig.color}`} />
              
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{activity.name}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <User className="h-3 w-3 mr-1" />
                  <span className="mr-3">{activity.professor}</span>
                  <span>{activity.date}</span>
                </div>
              </div>
              
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusConfig.badge}`}>
                {statusConfig.label}
              </span>
            </div>
          );
        })}
      </div>
      
      {activities.length === 0 && (
        <div className="text-center py-8">
          <Clock className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p className="text-muted-foreground">Nenhuma atividade encontrada</p>
        </div>
      )}
    </div>
  );
};

export default RecentActivities;