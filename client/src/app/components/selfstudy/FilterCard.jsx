import { useState } from 'react';
import { Filter, X, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const FilterCard = ({ filters, onFilterChange, onClearFilters, onImportClick }) => {
  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 border border-primary/10 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Filter className="h-5 w-5 text-primary mr-2" />
          <h3 className="font-semibold">Filtros</h3>
        </div>
        <Button
          onClick={onImportClick}
          size="sm"
          className="bg-gradient-to-r from-ada-red to-ada-accent hover:from-ada-red/80 hover:to-ada-accent/80 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Importar
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Buscar</label>
          <Input
            placeholder="Nome da atividade..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="border-primary/20 focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Status</label>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger className="border-primary/20 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-primary/20">
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="A Fazer">A Fazer</SelectItem>
              <SelectItem value="Fazendo">Fazendo</SelectItem>
              <SelectItem value="Feito">Feito</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Tipo</label>
          <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
            <SelectTrigger className="border-primary/20 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-primary/20">
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Auto Estudo">Auto Estudo</SelectItem>
              <SelectItem value="Avaliação e Pesquisa">Avaliação e Pesquisa</SelectItem>
              <SelectItem value="Desenvolvimento de Projetos">Desenvolvimento de Projetos</SelectItem>
              <SelectItem value="Outros">Outros</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Obrigatório</label>
          <Select value={filters.required} onValueChange={(value) => handleFilterChange('required', value)}>
            <SelectTrigger className="border-primary/20 focus:border-primary">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-popover border border-primary/20">
              <SelectItem value="Todos">Todos</SelectItem>
              <SelectItem value="Sim">Sim</SelectItem>
              <SelectItem value="Não">Não</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button 
          variant="outline" 
          onClick={onClearFilters}
          className="w-full border-primary/20 hover:bg-primary/10"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      </div>
    </div>
  );
};

export default FilterCard;