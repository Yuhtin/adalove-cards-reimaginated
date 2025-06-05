'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';
import { studentActivities, types, sections } from '../../lib/api';
import Layout from '../../components/Layout';

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
      fetchData(); // Recarregar dados
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status da atividade');
    }
  };

  const getStatusColor = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'feito':
      case 'done':
        return 'bg-green-400';
      case 'fazendo':
      case 'doing':
        return 'bg-yellow-400';
      case 'a fazer':
      case 'todo':
      default:
        return 'bg-gray-400';
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
            <div className="w-8 h-8 border-4 border-ada-red/20 border-t-ada-red rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-ada-text-primary-dark/70">Carregando autoestudos...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ada-text-primary-dark">
              Autoestudos
            </h1>
            <p className="text-ada-text-primary-dark/70 mt-1">
              Gerencie suas atividades de autoestudo
            </p>
          </div>
          <button
            onClick={() => setShowImportModal(true)}
            className="bg-ada-red text-white px-6 py-3 rounded-lg hover:bg-ada-red/90 transition-colors font-medium"
          >
            Importar da AdaLove
          </button>
        </div>

        {/* Filters */}
        <div className="bg-ada-section-dark rounded-xl p-6 border border-ada-red/10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-ada-text-primary-dark mb-2">
                Buscar
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Nome da atividade..."
                className="w-full px-3 py-2 bg-ada-bg-dark border border-ada-red/20 rounded-lg text-ada-text-primary-dark placeholder-ada-text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-ada-red/50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-ada-text-primary-dark mb-2">
                Status
              </label>
              <select
                value={filters.statusTypeId}
                onChange={(e) => handleFilterChange('statusTypeId', e.target.value)}
                className="w-full px-3 py-2 bg-ada-bg-dark border border-ada-red/20 rounded-lg text-ada-text-primary-dark focus:outline-none focus:ring-2 focus:ring-ada-red/50"
              >
                <option value="">Todos os status</option>
                {statusTypes.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ada-text-primary-dark mb-2">
                Tipo
              </label>
              <select
                value={filters.activityTypeId}
                onChange={(e) => handleFilterChange('activityTypeId', e.target.value)}
                className="w-full px-3 py-2 bg-ada-bg-dark border border-ada-red/20 rounded-lg text-ada-text-primary-dark focus:outline-none focus:ring-2 focus:ring-ada-red/50"
              >
                <option value="">Todos os tipos</option>
                {activityTypes.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-ada-text-primary-dark mb-2">
                Semana
              </label>
              <input
                type="number"
                value={filters.weekNumber}
                onChange={(e) => handleFilterChange('weekNumber', e.target.value)}
                placeholder="Número da semana"
                className="w-full px-3 py-2 bg-ada-bg-dark border border-ada-red/20 rounded-lg text-ada-text-primary-dark placeholder-ada-text-primary-dark/50 focus:outline-none focus:ring-2 focus:ring-ada-red/50"
              />
            </div>

            <div className="flex items-end space-x-2">
              <button
                onClick={applyFilters}
                className="bg-ada-red text-white px-4 py-2 rounded-lg hover:bg-ada-red/90 transition-colors"
              >
                Filtrar
              </button>
              <button
                onClick={clearFilters}
                className="bg-ada-bg-dark text-ada-text-primary-dark border border-ada-red/20 px-4 py-2 rounded-lg hover:bg-ada-red/10 transition-colors"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>

        {/* Activities List */}
        {error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
            <p className="text-red-400">{error}</p>
            <button 
              onClick={fetchData}
              className="mt-4 bg-ada-red text-white px-4 py-2 rounded-lg hover:bg-ada-red/90 transition-colors"
            >
              Tentar novamente
            </button>
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-ada-section-dark rounded-xl p-12 border border-ada-red/10 text-center">
            <div className="w-16 h-16 bg-ada-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-ada-red text-2xl">📚</span>
            </div>
            <h3 className="text-xl font-bold text-ada-text-primary-dark mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-ada-text-primary-dark/70 mb-6">
              Importe suas atividades da AdaLove original para começar
            </p>
            <button
              onClick={() => setShowImportModal(true)}
              className="bg-ada-red text-white px-6 py-3 rounded-lg hover:bg-ada-red/90 transition-colors font-medium"
            >
              Importar Atividades
            </button>
          </div>
        ) : (
          <div className="bg-ada-section-dark rounded-xl border border-ada-red/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-ada-bg-dark/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-ada-text-primary-dark">Atividade</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-ada-text-primary-dark">Professor</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-ada-text-primary-dark">Semana</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-ada-text-primary-dark">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-ada-text-primary-dark">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-ada-text-primary-dark">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ada-red/10">
                  {activities.map(activity => (
                    <tr key={activity.id} className="hover:bg-ada-bg-dark/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <h3 className="font-medium text-ada-text-primary-dark">{activity.activityname}</h3>
                          <p className="text-sm text-ada-text-primary-dark/70">{activity.activitytypename}</p>
                          {activity.mandatory && (
                            <span className="inline-block mt-1 px-2 py-1 text-xs bg-ada-red/10 text-ada-red rounded-full">
                              Obrigatória
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-ada-text-primary-dark">
                        {activity.instructorname}
                      </td>
                      <td className="px-6 py-4 text-sm text-ada-text-primary-dark">
                        Semana {activity.weeknumber}
                      </td>
                      <td className="px-6 py-4 text-sm text-ada-text-primary-dark">
                        {formatDate(activity.activitydate)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(activity.statusname)}`}></div>
                          <span className="text-sm text-ada-text-primary-dark">{activity.statusname}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={activity.statustypeid}
                          onChange={(e) => updateActivityStatus(activity.id, parseInt(e.target.value))}
                          className="text-xs px-2 py-1 bg-ada-bg-dark border border-ada-red/20 rounded text-ada-text-primary-dark focus:outline-none focus:ring-1 focus:ring-ada-red/50"
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

        {/* Import Modal Placeholder */}
        {showImportModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-ada-section-dark rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-bold text-ada-text-primary-dark mb-4">
                Importar da AdaLove
              </h2>
              <p className="text-ada-text-primary-dark/70 mb-6">
                Esta funcionalidade será implementada em breve. Você poderá colar os dados JSON da AdaLove original aqui.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 bg-ada-bg-dark text-ada-text-primary-dark border border-ada-red/20 py-2 rounded-lg hover:bg-ada-red/10 transition-colors"
                >
                  Fechar
                </button>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 bg-ada-red text-white py-2 rounded-lg hover:bg-ada-red/90 transition-colors"
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