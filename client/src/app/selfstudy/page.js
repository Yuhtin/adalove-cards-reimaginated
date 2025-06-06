'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { studentActivities, types, sections } from '../../lib/api';
import Layout from '../../components/Layout';

// Componentes de ícones SVG
const DownloadIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const SearchIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
  </svg>
);

const FilterIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

const ClearIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const BookIcon = () => (
  <svg className="icon-xl" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V4.804z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="icon-xl" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
  </svg>
);

const UserIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const ChartIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
  </svg>
);

const CogIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default function SelfStudy() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [activities, setActivities] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [statusTypes, setStatusTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    statusTypeId: '',
    activityTypeId: '',
    weekNumber: '',
    mandatory: ''
  });
  const [showImportModal, setShowImportModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, authLoading, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [activitiesData, activityTypesData, statusTypesData] = await Promise.all([
        studentActivities.getAll(filters),
        types.getActivityTypes(),
        types.getStatusTypes()
      ]);
      
      setActivities(activitiesData);
      setActivityTypes(activityTypesData);
      setStatusTypes(statusTypesData);
      
    } catch (err) {
      setError('Erro ao carregar atividades');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    fetchData();
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      statusTypeId: '',
      activityTypeId: '',
      weekNumber: '',
      mandatory: ''
    });
    setTimeout(() => fetchData(), 100);
  };

  const updateActivityStatus = async (activityId, newStatusId) => {
    try {
      await studentActivities.updateStatus(activityId, newStatusId);
      fetchData();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status da atividade');
    }
  };

  const getStatusColor = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'feito':
      case 'done':
        return 'bg-green-500 text-white';
      case 'fazendo':
      case 'doing':
        return 'bg-yellow-500 text-white';
      case 'a fazer':
      case 'todo':
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-ada-red/20 border-t-ada-red rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-ada-text-primary-light dark:text-ada-text-primary-dark">Carregando autoestudos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ada-text-primary-light dark:text-ada-text-primary-dark">
              Autoestudos
            </h1>
            <p className="text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70 mt-1">
              Gerencie suas atividades de autoestudo de forma eficiente
            </p>
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-ada-red text-white px-6 py-3 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 whitespace-nowrap flex items-center gap-2"
          >
            <DownloadIcon />
            Importar da AdaLove
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-ada-section-light dark:bg-ada-section-dark rounded-2xl p-6 shadow-lg border border-ada-red/10">
          <h2 className="text-lg font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark mb-4 flex items-center gap-2">
            <FilterIcon />
            Filtros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nome da atividade..."
                className="w-full px-4 py-3 bg-ada-bg-light dark:bg-ada-bg-dark border border-ada-red/20 rounded-xl text-ada-text-primary-light dark:text-ada-text-primary-dark placeholder-ada-text-primary-light/50 dark:placeholder-ada-text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Status
              </label>
              <select
                value={filters.statusTypeId}
                onChange={(e) => handleFilterChange('statusTypeId', e.target.value)}
                className="w-full px-4 py-3 bg-ada-bg-light dark:bg-ada-bg-dark border border-ada-red/20 rounded-xl text-ada-text-primary-light dark:text-ada-text-primary-dark focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red transition-all"
              >
                <option value="">Todos os status</option>
                {statusTypes.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Tipo
              </label>
              <select
                value={filters.activityTypeId}
                onChange={(e) => handleFilterChange('activityTypeId', e.target.value)}
                className="w-full px-4 py-3 bg-ada-bg-light dark:bg-ada-bg-dark border border-ada-red/20 rounded-xl text-ada-text-primary-light dark:text-ada-text-primary-dark focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red transition-all"
              >
                <option value="">Todos os tipos</option>
                {activityTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark mb-2">
                Semana
              </label>
              <input
                type="number"
                value={filters.weekNumber}
                onChange={(e) => handleFilterChange('weekNumber', e.target.value)}
                placeholder="Número da semana"
                className="w-full px-4 py-3 bg-ada-bg-light dark:bg-ada-bg-dark border border-ada-red/20 rounded-xl text-ada-text-primary-light dark:text-ada-text-primary-dark placeholder-ada-text-primary-light/50 dark:placeholder-ada-text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red transition-all"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-6">
            <button
              onClick={applyFilters}
              className="bg-ada-red text-white px-6 py-2.5 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
            >
              <SearchIcon />
              Filtrar
            </button>
            <button
              onClick={clearFilters}
              className="bg-ada-section-light dark:bg-ada-section-dark text-ada-text-primary-light dark:text-ada-text-primary-dark border border-ada-red/20 px-6 py-2.5 rounded-xl hover:bg-ada-red/10 transition-all duration-200 font-medium flex items-center gap-2"
            >
              <ClearIcon />
              Limpar
            </button>
          </div>
        </div>

        {/* Activities Content */}
        {error ? (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-2xl p-8 text-center shadow-lg">
            <div className="flex justify-center mb-4">
              <ExclamationIcon />
            </div>
            <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-4">{error}</p>
            <button 
              onClick={fetchData}
              className="bg-ada-red text-white px-6 py-3 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
            >
              <RefreshIcon />
              Tentar novamente
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-ada-section-light dark:bg-ada-section-dark rounded-2xl p-12 text-center shadow-lg border border-ada-red/10">
            <div className="flex justify-center mb-6 text-ada-text-primary-light/30 dark:text-ada-text-primary-dark/30">
              <BookIcon />
            </div>
            <h3 className="text-2xl font-bold text-ada-text-primary-light dark:text-ada-text-primary-dark mb-3">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70 mb-8 text-lg max-w-md mx-auto">
              Importe suas atividades da AdaLove original para começar a organizar seus estudos
            </p>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-ada-red text-white px-8 py-4 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-lg flex items-center gap-2 mx-auto"
            >
              <DownloadIcon />
              Importar Atividades
            </button>
          </div>
        ) : (
          <div className="bg-ada-section-light dark:bg-ada-section-dark rounded-2xl shadow-lg border border-ada-red/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ada-red/5 dark:bg-ada-red/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                      <div className="flex items-center gap-2">
                        <DocumentIcon />
                        Atividade
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                      <div className="flex items-center gap-2">
                        <UserIcon />
                        Professor
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                      <div className="flex items-center gap-2">
                        <CalendarIcon />
                        Semana
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                      <div className="flex items-center gap-2">
                        <CalendarIcon />
                        Data
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                      <div className="flex items-center gap-2">
                        <ChartIcon />
                        Status
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                      <div className="flex items-center gap-2">
                        <CogIcon />
                        Ações
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ada-red/10">
                  {activities.map(activity => (
                    <tr key={activity.id} className="hover:bg-ada-red/5 transition-all duration-200">
                      <td className="px-6 py-5">
                        <div>
                          <h3 className="font-semibold text-ada-text-primary-light dark:text-ada-text-primary-dark mb-1">{activity.activityname}</h3>
                          <p className="text-sm text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70">{activity.activitytypename}</p>
                          {activity.mandatory && (
                            <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-xs bg-ada-red/10 text-ada-red rounded-full font-medium">
                              <StarIcon />
                              Obrigatória
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-ada-text-primary-light dark:text-ada-text-primary-dark">
                        {activity.instructorname}
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-block px-3 py-1 text-sm bg-ada-red/10 text-ada-red rounded-full font-medium">
                          Semana {activity.weeknumber}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-ada-text-primary-light dark:text-ada-text-primary-dark">
                        {formatDate(activity.activitydate)}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusColor(activity.statusname)}`}>
                          {activity.statusname}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <select
                          value={activity.statustypeid}
                          onChange={(e) => updateActivityStatus(activity.id, parseInt(e.target.value))}
                          className="px-3 py-2 bg-ada-bg-light dark:bg-ada-bg-dark border border-ada-red/20 rounded-lg text-ada-text-primary-light dark:text-ada-text-primary-dark focus:outline-none focus:ring-2 focus:ring-ada-red/50 text-sm"
                        >
                          {statusTypes.map(status => (
                            <option key={status.id} value={status.id}>{status.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Import Modal */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-ada-section-light dark:bg-ada-section-dark rounded-2xl p-8 max-w-lg w-full shadow-2xl border border-ada-red/20">
              <div className="text-center mb-6">
                <div className="flex justify-center mb-4 text-ada-text-primary-light/30 dark:text-ada-text-primary-dark/30">
                  <DownloadIcon />
                </div>
                <h2 className="text-2xl font-bold text-ada-text-primary-light dark:text-ada-text-primary-dark mb-3">
                  Importar da AdaLove
                </h2>
                <p className="text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70">
                  Esta funcionalidade será implementada em breve. Você poderá colar os dados JSON da AdaLove original aqui.
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 bg-ada-section-light dark:bg-ada-section-dark text-ada-text-primary-light dark:text-ada-text-primary-dark border border-ada-red/20 py-3 rounded-xl hover:bg-ada-red/10 transition-all duration-200 font-medium"
                >
                  Fechar
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 bg-ada-red text-white py-3 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium shadow-lg"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}