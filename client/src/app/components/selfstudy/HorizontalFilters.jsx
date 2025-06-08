import { Search, X, Download } from 'lucide-react';
import FilterDropdown from './FilterDropdown';

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
    { value: 'Orientação', label: 'Orientação' },
    { value: 'Instrução', label: 'Instrução' },
    { value: 'Autoestudo', label: 'Autoestudo' },
    { value: 'Artefatos', label: 'Artefatos' }
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
      const statusOption = statusOptions.find(opt => opt.value === filters.status);
      active.push({ key: 'status', label: statusOption?.label || filters.status, type: 'filter' });
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
    <div className="space-y-4 relative z-40">
      {/* Main Filter Bar */}
      <div className="glassmorphism rounded-2xl p-6 border border-white/10 backdrop-blur-xl relative z-50">
        <div className="flex flex-col pb-3 lg:flex-row gap-6">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Buscar
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar atividades..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red/50 transition-all"
              />
            </div>
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Status Dropdown */}
            <div className="min-w-[140px]">
              <FilterDropdown
                label="Status"
                value={filters.status}
                options={statusOptions}
                onChange={(value) => handleFilterChange('status', value)}
              />
            </div>

            {/* Type Dropdown */}
            <div className="min-w-[140px]">
              <FilterDropdown
                label="Tipo"
                value={filters.type}
                options={typeOptions}
                onChange={(value) => handleFilterChange('type', value)}
              />
            </div>

            {/* Required Dropdown */}
            <div className="min-w-[140px]">
              <FilterDropdown
                label="Obrigatório"
                value={filters.required}
                options={requiredOptions}
                onChange={(value) => handleFilterChange('required', value)}
              />
            </div>
          </div>
        </div>
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <div
                  key={index}
                  className={`
                  flex items-center space-x-2 px-3 py-1.5 rounded-full text-sm transition-all
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
              <button
                onClick={onClearFilters}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Limpar todos</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HorizontalFilters;
