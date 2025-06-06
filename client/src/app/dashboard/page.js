'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { studentActivities } from '../../lib/api';
import Layout from '../../components/Layout';

// Componentes de ícones SVG
const BookIcon = () => (
  <svg className="icon-lg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V4.804z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="icon-lg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const ClockIcon = () => (
  <svg className="icon-lg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="icon-lg" viewBox="0 0 20 20" fill="currentColor">
    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="icon-lg" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

const StarIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const RefreshIcon = () => (
  <svg className="icon" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

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
        return 'bg-green-500';
      case 'fazendo':
      case 'doing':
        return 'bg-yellow-500';
      case 'a fazer':
      case 'todo':
      default:
        return 'bg-gray-400';
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
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'fazendo':
      case 'doing':
        return 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400';
      case 'a fazer':
      case 'todo':
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
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
    <div className="bg-ada-section-light dark:bg-ada-section-dark rounded-2xl p-6 border border-ada-red/10 shadow-lg hover:shadow-xl transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color} mt-1`}>{value || 0}</p>
          {description && (
            <p className="text-xs text-ada-text-primary-light/50 dark:text-ada-text-primary-dark/50 mt-1">{description}</p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-xl ${color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-ada-red/20 border-t-ada-red rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-ada-text-primary-light dark:text-ada-text-primary-dark">Carregando dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/20 rounded-2xl p-8 text-center shadow-lg">
          <p className="text-red-600 dark:text-red-400 text-lg font-medium mb-4">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="bg-ada-red text-white px-6 py-3 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium flex items-center gap-2 mx-auto"
          >
            <RefreshIcon />
            Tentar novamente
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-ada-text-primary-light dark:text-ada-text-primary-dark">
              Olá, {user?.username}!
            </h1>
            <p className="text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70 mt-1">
              Acompanhe seu progresso nos autoestudos
            </p>
          </div>
          <Link href="/selfstudy" className="bg-ada-red text-white px-6 py-3 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2 no-underline">
              Ver Todos os Autoestudos
              <ArrowRightIcon />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total de Atividades"
            value={stats.totalactivities}
            color="text-ada-accent-light dark:text-ada-accent-dark"
            icon={<BookIcon />}
            description={`${stats.totalweeks} semanas`}
          />
          <StatCard
            title="Concluídas"
            value={stats.donecount}
            color="text-green-600 dark:text-green-400"
            icon={<CheckIcon />}
            description="Finalizadas"
            trend={10}
          />
          <StatCard
            title="Em Andamento"
            value={stats.doingcount}
            color="text-yellow-600 dark:text-yellow-400"
            icon={<ClockIcon />}
            description="Progredindo"
            trend={-5}
          />
          <StatCard
            title="Pendentes"
            value={stats.todocount}
            color="text-gray-600 dark:text-gray-400"
            icon={<ClipboardIcon />}
            description="A fazer"
          />
        </div>

        {/* Progress Overview */}
        {stats.totalactivities > 0 && (
          <div className="bg-ada-section-light dark:bg-ada-section-dark rounded-2xl p-6 border border-ada-red/10 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUpIcon />
              <h2 className="text-xl font-bold text-ada-text-primary-light dark:text-ada-text-primary-dark">
                Progresso Geral
              </h2>
            </div>
            <div className="w-full bg-ada-bg-light dark:bg-ada-bg-dark rounded-full h-4 mb-4 border border-ada-red/10">
              <div 
                className="bg-gradient-to-r from-ada-red to-ada-accent-light dark:to-ada-accent-dark h-4 rounded-full transition-all duration-500"
                style={{ 
                  width: `${((stats.donecount + stats.doingcount * 0.5) / stats.totalactivities) * 100}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-sm text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70">
              <span>{Math.round(((stats.donecount + stats.doingcount * 0.5) / stats.totalactivities) * 100)}% concluído</span>
              <span>{stats.mandatorycount} obrigatórias</span>
            </div>
          </div>
        )}

        {/* Recent Activities */}
        <div className="bg-ada-section-light dark:bg-ada-section-dark rounded-2xl p-6 border border-ada-red/10 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-ada-text-primary-light dark:text-ada-text-primary-dark">
              Atividades Recentes
            </h2>
            <Link href="/selfstudy" className="text-ada-accent-light dark:text-ada-accent-dark hover:text-ada-red transition-colors text-sm font-medium flex items-center gap-1">
              Ver todas
              <ArrowRightIcon />
            </Link>
          </div>
          
          {recentActivities.length === 0 ? (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4 text-ada-text-primary-light/30 dark:text-ada-text-primary-dark/30">
                <BookIcon />
              </div>
              <p className="text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70 mb-4">Nenhuma atividade encontrada</p>
              <Link href="/selfstudy">
                <button className="bg-ada-red text-white px-6 py-3 rounded-xl hover:bg-ada-red/90 transition-all duration-200 font-medium">
                  Importar atividades
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-ada-bg-light/50 dark:bg-ada-bg-dark/50 rounded-xl border border-ada-red/5 hover:border-ada-red/10 transition-all duration-200 hover:shadow-md">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(activity.statusname)}`}></div>
                    <div>
                      <h3 className="font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark">{activity.activityname}</h3>
                      <p className="text-sm text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70">
                        {activity.instructorname} • Semana {activity.weeknumber} • {formatDate(activity.activitydate)}
                      </p>
                      {activity.mandatory && (
                        <span className="inline-flex items-center gap-1 mt-2 px-3 py-1 text-xs bg-ada-red/10 text-ada-red rounded-full font-medium">
                          <StarIcon />
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