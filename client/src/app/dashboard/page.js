'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { studentActivities } from '../../lib/api';
import Layout from '../../components/Layout';

export default function Dashboard() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({
    totalactivities: 0,
    todocount: 0,
    doingcount: 0,
    donecount: 0,
    mandatorycount: 0,
    totalweeks: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    fetchDashboardData();
  }, [isAuthenticated, authLoading, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const statsData = await studentActivities.getStats();
      setStats(statsData);
      
      const activitiesData = await studentActivities.getAll({ 
        limit: 5,
        orderBy: 'date',
        orderDirection: 'DESC'
      });
      setRecentActivities(activitiesData);
      
    } catch (err) {
      setError('Erro ao carregar dados do dashboard');
      console.error('Erro:', err);
    } finally {
      setLoading(false);
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
        return 'bg-red-400';
    }
  };

  const getStatusText = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'feito':
      case 'done':
        return 'Concluído';
      case 'fazendo':
      case 'doing':
        return 'Em andamento';
      case 'a fazer':
      case 'todo':
      default:
        return 'Pendente';
    }
  };

  const getStatusBadgeColor = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'feito':
      case 'done':
        return 'bg-green-400/10 text-green-400';
      case 'fazendo':
      case 'doing':
        return 'bg-yellow-400/10 text-yellow-400';
      case 'a fazer':
      case 'todo':
      default:
        return 'bg-red-400/10 text-red-400';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const StatCard = ({ title, value, color, icon, description }) => (
    <div className="bg-ada-section-dark dark:bg-ada-section-dark rounded-xl p-6 border border-ada-red/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ada-text-primary-dark/70 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value || 0}</p>
          {description && (
            <p className="text-xs text-ada-text-primary-dark/50 mt-1">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg ${color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-ada-red/20 border-t-ada-red rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-ada-text-primary-dark/70">Carregando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="mt-4 bg-ada-red text-white px-4 py-2 rounded-lg hover:bg-ada-red/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ada-text-primary-dark dark:text-ada-text-primary-dark">
              Olá, {user?.username}! 👋
            </h1>
            <p className="text-ada-text-primary-dark/70 mt-1">
              Acompanhe seu progresso nos autoestudos
            </p>
          </div>
          <Link href="/selfstudy">
            <button className="bg-ada-red text-white px-6 py-3 rounded-lg hover:bg-ada-red/90 transition-colors font-medium">
              Ver Todos os Autoestudos
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Atividades"
            value={stats.totalactivities}
            color="text-ada-accent-dark"
            icon="📚"
            description={`${stats.totalweeks} semanas`}
          />
          <StatCard
            title="Concluídas"
            value={stats.donecount}
            color="text-green-400"
            icon="✅"
            description="Finalizadas"
          />
          <StatCard
            title="Em Andamento"
            value={stats.doingcount}
            color="text-yellow-400"
            icon="⏳"
            description="Progredindo"
          />
          <StatCard
            title="Pendentes"
            value={stats.todocount}
            color="text-red-400"
            icon="📋"
            description="A fazer"
          />
        </div>

        {/* Progress Overview */}
        {stats.totalactivities > 0 && (
          <div className="bg-ada-section-dark dark:bg-ada-section-dark rounded-xl p-6 border border-ada-red/10">
            <h2 className="text-xl font-bold text-ada-text-primary-dark dark:text-ada-text-primary-dark mb-4">
              Progresso Geral
            </h2>
            <div className="w-full bg-ada-bg-dark rounded-full h-4 mb-4">
              <div 
                className="bg-gradient-to-r from-ada-red to-ada-accent-dark h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((stats.donecount + stats.doingcount * 0.5) / stats.totalactivities) * 100}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-ada-text-primary-dark/70">
              <span>{Math.round(((stats.donecount + stats.doingcount * 0.5) / stats.totalactivities) * 100)}% concluído</span>
              <span>{stats.mandatorycount} obrigatórias</span>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-ada-section-dark dark:bg-ada-section-dark rounded-xl p-6 border border-ada-red/10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ada-text-primary-dark dark:text-ada-text-primary-dark">
              Atividades Recentes
            </h2>
            <Link href="/selfstudy" className="text-ada-accent-dark hover:text-ada-red transition-colors text-sm font-medium">
              Ver todas →
            </Link>
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-ada-text-primary-dark/70 mb-4">Nenhuma atividade encontrada</p>
              <Link href="/selfstudy">
                <button className="bg-ada-red text-white px-4 py-2 rounded-lg hover:bg-ada-red/90 transition-colors">
                  Importar atividades
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-ada-bg-dark/50 rounded-lg border border-ada-red/5 hover:border-ada-red/10 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.statusname)}`}></div>
                    <div>
                      <h3 className="font-medium text-ada-text-primary-dark">{activity.activityname}</h3>
                      <p className="text-sm text-ada-text-primary-dark/70">
                        {activity.instructorname} • Semana {activity.weeknumber} • {formatDate(activity.activitydate)}
                      </p>
                      {activity.mandatory && (
                        <span className="inline-block mt-1 px-2 py-1 text-xs bg-ada-red/10 text-ada-red rounded-full">
                          Obrigatória
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(activity.statusname)}`}>
                    {getStatusText(activity.statusname)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}