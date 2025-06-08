import { Check, Clock, Play } from 'lucide-react';

const StatusSelector = ({ status, onStatusChange, activityId }) => {
  const statusOptions = [
    {
      value: 'A fazer',
      label: 'A Fazer',
      icon: Clock,
      color: 'bg-slate-500',
      hoverColor: 'hover:bg-slate-400',
      textColor: 'text-white'
    },
    {
      value: 'Fazendo',
      label: 'Fazendo',
      icon: Play,
      color: 'bg-yellow-500',
      hoverColor: 'hover:bg-yellow-400',
      textColor: 'text-white'
    },
    {
      value: 'Feito',
      label: 'Feito',
      icon: Check,
      color: 'bg-green-500',
      hoverColor: 'hover:bg-green-400',
      textColor: 'text-white'
    }
  ];

  const currentStatusIndex = statusOptions.findIndex(option => option.value === status);
  const currentStatus = statusOptions[currentStatusIndex] || statusOptions[0];

  const handleClick = (e) => {
    e.stopPropagation();
    // Cycle to next status
    const nextIndex = (currentStatusIndex + 1) % statusOptions.length;
    const nextStatus = statusOptions[nextIndex];
    onStatusChange(activityId, nextStatus.value);
  };

  const Icon = currentStatus.icon;

  return (
    <button
      onClick={handleClick}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-xl font-medium transition-all duration-300 group
        ${currentStatus.color} ${currentStatus.hoverColor} ${currentStatus.textColor}
        shadow-lg hover:shadow-xl transform hover:scale-105
      `}
      title={`Clique para alterar para ${statusOptions[(currentStatusIndex + 1) % statusOptions.length].label}`}
    >
      <Icon className="h-4 w-4" />
      <span className="text-sm">{currentStatus.label}</span>
      
      {/* Subtle indicator for next status */}
      <div className="opacity-0 group-hover:opacity-50 transition-opacity">
        <span className="text-xs">→</span>
      </div>
    </button>
  );
};

export default StatusSelector;
