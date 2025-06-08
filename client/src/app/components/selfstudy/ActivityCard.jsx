import { User, Calendar, Clock, ExternalLink, BookOpen, Database } from 'lucide-react';

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
          color: 'bg-slate-500',
          badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
          label: 'A Fazer'
        };
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusConfig = getStatusConfig(activity.status);

  return (
    <div
      className="glassmorphism rounded-2xl p-6 border border-white/10 backdrop-blur-xl hover:border-ada-red/30 transition-all duration-300 animate-fade-in cursor-pointer group"
      style={{ animationDelay: `${index * 100}ms` }}
      onClick={() => onActivityClick(activity)}
    >
      {/* Header with Icon and Week */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-ada-red to-ada-accent rounded-xl flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Semana {activity.week || '01'}</span>
            </div>
          </div>
        </div>
        <div className={`w-3 h-3 rounded-full ${statusConfig.color}`} />
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg leading-tight mb-4 text-white group-hover:text-ada-red-light transition-colors">
        {activity.name}
      </h3>

      {/* Date and Time */}
      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2 text-sm text-slate-400">
          <Clock className="h-4 w-4" />
          <span>{formatDate(activity.date)} - {formatTime(activity.date) || '10:00h'}</span>
        </div>
      </div>

      {/* Professor */}
      <div className="flex items-center space-x-2 mb-6 text-sm text-slate-400">
        <User className="h-4 w-4" />
        <span>{activity.professor}</span>
      </div>

      {/* Footer with Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {activity.url && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(activity.url, '_blank');
              }}
              className="p-2 bg-white/5 hover:bg-ada-red/20 rounded-lg transition-colors"
            >
              <ExternalLink className="h-4 w-4 text-slate-400 hover:text-ada-red" />
            </button>
          )}
        </div>

        {/* Status Dropdown */}
        <select
          value={activity.status}
          onChange={(e) => {
            e.stopPropagation();
            onStatusChange(activity.id, e.target.value);
          }}
          onClick={(e) => e.stopPropagation()}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red/50 transition-all"
        >
          <option value="A Fazer">A Fazer</option>
          <option value="Fazendo">Fazendo</option>
          <option value="Feito">Feito</option>
        </select>
      </div>
    </div>
  );
};

export default ActivityCard;