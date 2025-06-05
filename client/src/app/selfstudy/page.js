import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Autoestudos() {
  const [cards, setCards] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      // Replace with actual API call to /api/cards
      const mockCards = [
        {
          id: 1,
          title: "EAP - Estrutura Analítica de Projeto",
          description: "A Estrutura Analítica do Trabalho (EAP), é um recurso para dividir o projeto em pacotes de tarefas...",
          instructor: "Fabiana Martins de Oliveira",
          type: "Autoestudo",
          status: "pending",
          week: "Semana 08",
          dueDate: "2025-01-30",
          priority: "high",
          tags: ["Projeto", "Gestão"]
        },
        {
          id: 2,
          title: "Matriz CSD",
          description: "Matriz de Conhecimento, Suposições e Dúvidas para organização de ideias",
          instructor: "Fabiana Martins de Oliveira",
          type: "Autoestudo", 
          status: "completed",
          week: "Semana 07",
          dueDate: "2025-01-23",
          priority: "medium",
          tags: ["Análise", "Metodologia"]
        },
        // Add more mock data...
      ];
      setCards(mockCards);
    } catch (error) {
      console.error('Erro ao buscar cards:', error);
    }
  };

  const filteredCards = cards.filter(card => {
    const matchesFilter = filter === 'all' || card.status === filter;
    const matchesSearch = card.title.toLowerCase().includes(search.toLowerCase()) ||
                         card.instructor.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const StatusBadge = ({ status }) => {
    const styles = {
      completed: 'bg-green-400/10 text-green-400 border-green-400/20',
      pending: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20',
      overdue: 'bg-red-400/10 text-red-400 border-red-400/20'
    };
    
    const labels = {
      completed: 'Concluído',
      pending: 'Pendente',
      overdue: 'Atrasado'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const PriorityIndicator = ({ priority }) => {
    const colors = {
      high: 'bg-red-400',
      medium: 'bg-yellow-400',
      low: 'bg-green-400'
    };
    
    return <div className={`w-1 h-full ${colors[priority]} rounded-l-lg`}></div>;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-ada-text-primary-dark dark:text-ada-text-primary-dark">
              Autoestudos
            </h1>
            <p className="text-ada-text-primary-dark/70 mt-1">
              Gerencie suas atividades acadêmicas
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' 
                  ? 'bg-ada-red text-white' 
                  : 'bg-ada-section-dark text-ada-text-primary-dark hover:bg-ada-red/10'
              }`}
            >
              📋
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-ada-red text-white' 
                  : 'bg-ada-section-dark text-ada-text-primary-dark hover:bg-ada-red/10'
              }`}
            >
              ⚏
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-ada-section-dark dark:bg-ada-section-dark rounded-xl p-6 border border-ada-red/10">
          <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar por título ou instrutor..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-3 bg-ada-bg-dark border border-ada-red/20 rounded-lg text-ada-text-primary-dark placeholder-ada-text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-ada-red/50"
              />
            </div>
            
            {/* Filters */}
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todos' },
                { key: 'pending', label: 'Pendentes' },
                { key: 'completed', label: 'Concluídos' },
                { key: 'overdue', label: 'Atrasados' }
              ].map(filterOption => (
                <button
                  key={filterOption.key}
                  onClick={() => setFilter(filterOption.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.key
                      ? 'bg-ada-red text-white'
                      : 'bg-ada-bg-dark text-ada-text-primary-dark hover:bg-ada-red/10'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Cards List/Grid */}
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-3'
        }>
          {filteredCards.map(card => (
            <div key={card.id} className={`bg-ada-section-dark dark:bg-ada-section-dark rounded-xl border border-ada-red/10 hover:border-ada-red/30 transition-colors cursor-pointer ${
              viewMode === 'list' ? 'flex items-center' : 'p-6'
            }`}>
              {viewMode === 'list' ? (
                <>
                  <PriorityIndicator priority={card.priority} />
                  <div className="flex-1 flex items-center justify-between p-6">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-semibold text-ada-text-primary-dark truncate">
                          {card.title}
                        </h3>
                        <StatusBadge status={card.status} />
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-ada-text-primary-dark/70">
                        <span>👨‍🏫 {card.instructor}</span>
                        <span>📅 {card.week}</span>
                        <span>⏰ {new Date(card.dueDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {card.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-ada-accent-dark/10 text-ada-accent-dark rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button className="ml-4 text-ada-accent-dark hover:text-ada-red transition-colors">
                      →
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-ada-text-primary-dark">
                      {card.title}
                    </h3>
                    <StatusBadge status={card.status} />
                  </div>
                  <p className="text-ada-text-primary-dark/70 text-sm mb-4 line-clamp-2">
                    {card.description}
                  </p>
                  <div className="space-y-2 text-sm text-ada-text-primary-dark/70">
                    <div>👨‍🏫 {card.instructor}</div>
                    <div>📅 {card.week}</div>
                    <div>⏰ {new Date(card.dueDate).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-1">
                      {card.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-ada-accent-dark/10 text-ada-accent-dark rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <button className="text-ada-accent-dark hover:text-ada-red transition-colors">
                      →
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}