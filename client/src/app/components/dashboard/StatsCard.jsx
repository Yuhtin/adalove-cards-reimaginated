const StatsCard = ({ title, value, icon: Icon, color, delay = 0 }) => {
  const colorClasses = {
    red: 'from-ada-red/20 to-ada-red/10 border-ada-red/20 text-ada-red',
    green: 'from-green-500/20 to-green-500/10 border-green-500/20 text-green-600',
    yellow: 'from-yellow-500/20 to-yellow-500/10 border-yellow-500/20 text-yellow-600',
    gray: 'from-gray-500/20 to-gray-500/10 border-gray-500/20 text-gray-600',
    blue: 'from-blue-500/20 to-blue-500/10 border-blue-500/20 text-blue-600'
  };

  return (
    <div 
      className={`glassmorphism rounded-2xl p-6 border bg-gradient-to-br ${colorClasses[color]} hover:scale-105 transition-all duration-300 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-80">{title}</p>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-xl glassmorphism">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;