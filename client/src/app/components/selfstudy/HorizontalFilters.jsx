import { useState } from 'react';
import { Search, Filter, X, Download, ChevronDown } from 'lucide-react';

const HorizontalFilters = ({ filters, onFilterChange, onClearFilters, onImportClick }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.status !== 'Todos') count++;
    if (filters.type !== 'Todos') count++;
    if (filters.required !== 'Todos') count++;
    return count;
  };

  const getActiveFilters = () => {
    const active = [];
    if (filters.search) active.push({ key: 'search', label: `Busca: "${filters.search}"` });
    if (filters.status !== 'Todos') {
      // Display friendly name but keep the actual value for filtering
      const statusDisplay = filters.status === 'A fazer' ? 'A Fazer' : filters.status;
      active.push({ key: 'status', label: `Status: ${statusDisplay}` });
    }
    if (filters.type !== 'Todos') active.push({ key: 'type', label: `Tipo: ${filters.type}` });
    if (filters.required !== 'Todos') active.push({ key: 'required', label: `Obrigatório: ${filters.required}` });
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

  const activeFiltersCount = getActiveFiltersCount();
  const activeFilters = getActiveFilters();

  return (
    <div className="space-y-4">
      {/* Main Filter Bar */}
      <div className="glassmorphism rounded-2xl p-4 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 flex-1">
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

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`
                flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                ${showFilters 
                  ? 'bg-gradient-to-r from-ada-red to-ada-accent text-white' 
                  : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10'
                }
              `}
            >
              <Filter className="h-4 w-4" />
              <span className="text-sm">Filtros</span>
              {activeFiltersCount > 0 && (
                <span className="bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {activeFiltersCount}
                </span>
              )}
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
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

        {/* Expanded Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red/50"
                >
                  <option value="Todos">Todos</option>
                  <option value="A fazer">A Fazer</option>
                  <option value="Fazendo">Fazendo</option>
                  <option value="Feito">Feito</option>
                </select>
              </div>

              {/* Type Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red/50"
                >
                  <option value="Todos">Todos</option>
                  <option value="Apresentação">Apresentação</option>
                  <option value="Instrução">Instrução</option>
                  <option value="Autoestudo">Autoestudo</option>
                  <option value="Avaliação e Pesquisa">Avaliação e Pesquisa</option>
                  <option value="Desenvolvimento de Projetos">Desenvolvimento de Projetos</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>

              {/* Required Filter */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Obrigatório</label>
                <select
                  value={filters.required}
                  onChange={(e) => handleFilterChange('required', e.target.value)}
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red/50"
                >
                  <option value="Todos">Todos</option>
                  <option value="Sim">Sim</option>
                  <option value="Não">Não</option>
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={onClearFilters}
                  className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Limpar filtros</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 px-3 py-1.5 bg-ada-red/20 border border-ada-red/30 rounded-lg text-sm text-ada-red-light"
            >
              <span>{filter.label}</span>
              <button
                onClick={() => removeFilter(filter.key)}
                className="hover:bg-ada-red/30 rounded-full p-0.5 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HorizontalFilters;
