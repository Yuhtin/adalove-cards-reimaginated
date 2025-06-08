import { LayoutGrid, Clock, Table } from 'lucide-react';

const ViewToggle = ({ viewMode, onViewModeChange }) => {
  const views = [
    { id: 'cards', icon: LayoutGrid, label: 'Cards' },
    { id: 'timeline', icon: Clock, label: 'Timeline' },
    { id: 'table', icon: Table, label: 'Tabela' }
  ];

  return (
    <div className="glassmorphism rounded-2xl p-1.5 border border-white/10 backdrop-blur-xl">
      <div className="flex space-x-1">
        {views.map((view) => {
          const Icon = view.icon;
          const isActive = viewMode === view.id;
          return (
            <button
              key={view.id}
              onClick={() => onViewModeChange(view.id)}
              className={`
                flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                ${isActive
                  ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white shadow-lg shadow-ada-red/25'
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">{view.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ViewToggle;