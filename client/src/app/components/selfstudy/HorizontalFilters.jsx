import { Search, X, Download } from 'lucide-react';

const HorizontalFilters = ({ filters, onFilterChange, onClearFilters, onImportClick }) => {

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const statusOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'A fazer', label: 'A Fazer' },
    { value: 'Fazendo', label: 'Fazendo' },
    { value: 'Feito', label: 'Feito' }
  ];

  const typeOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Apresentação', label: 'Apresentação' },
    { value: 'Instrução', label: 'Instrução' },
    { value: 'Autoestudo', label: 'Autoestudo' },
    { value: 'Avaliação e Pesquisa', label: 'Avaliação' },
    { value: 'Desenvolvimento de Projetos', label: 'Projetos' },
    { value: 'Outros', label: 'Outros' }
  ];

  const requiredOptions = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Sim', label: 'Obrigatório' },
    { value: 'Não', label: 'Opcional' }
  ];

  const getActiveFilters = () => {
    const active = [];
    if (filters.search) active.push({ key: 'search', label: `"${filters.search}"`, type: 'search' });
    if (filters.status !== 'Todos') {
      const statusDisplay = filters.status === 'A fazer' ? 'A Fazer' : filters.status;
      active.push({ key: 'status', label: statusDisplay, type: 'filter' });
    }
    if (filters.type !== 'Todos') {
      const typeOption = typeOptions.find(opt => opt.value === filters.type);
      active.push({ key: 'type', label: typeOption?.label || filters.type, type: 'filter' });
    }
    if (filters.required !== 'Todos') {
      const reqOption = requiredOptions.find(opt => opt.value === filters.required);
      active.push({ key: 'required', label: reqOption?.label || filters.required, type: 'filter' });
    }
    return active;
  };

  const removeFilter = (key) => {
    const defaultValues = {
      search: '',
      status: 'Todos',
      type: 'Todos',
      required: 'Todos'
    };
    handleFilterChange(key, defaultValues[key]);
  };

  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="glassmorphism rounded-2xl p-4 border border-white/10 backdrop-blur-xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar atividades..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red/50 transition-all"
            />
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-3 flex-1">
            {/* Status Filter Chips */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-medium">Status:</span>
              <div className="flex gap-1">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('status', option.value)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${filters.status === option.value
                        ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white shadow-lg shadow-ada-red/25'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter Chips */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-medium">Tipo:</span>
              <div className="flex gap-1 flex-wrap">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('type', option.value)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${filters.type === option.value
                        ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white shadow-lg shadow-ada-red/25'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Required Filter Chips */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-400 font-medium">Obrigatório:</span>
              <div className="flex gap-1">
                {requiredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('required', option.value)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${filters.required === option.value
                        ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white shadow-lg shadow-ada-red/25'
                        : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      }
                    `}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Import Button */}
          <button
            onClick={onImportClick}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 text-white rounded-xl font-medium transition-all duration-300 shadow-lg shadow-ada-red/25"
          >
            <Download className="h-4 w-4" />
            <span className="text-sm">Importar</span>
          </button>
        </div>

        {/* Clear Filters */}
        {activeFilters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className={`
                    flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm transition-all
                    ${filter.type === 'search'
                      ? 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                      : 'bg-ada-red/20 border border-ada-red/30 text-ada-red-light'
                    }
                  `}
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter.key)}
                    className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={onClearFilters}
              className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Limpar todos</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalFilters;
