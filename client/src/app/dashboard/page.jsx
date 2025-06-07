'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book, CheckCircle, Clock, ClipboardList } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressBar from '../components/dashboard/ProgressBar';
import RecentActivities from '../components/dashboard/RecentActivities';
import ModernNavbar from '../components/layout/ModernNavbar';
import SettingsModal from '../components/modals/SettingsModal';
import { studentActivities, auth } from '../../lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('Usuário');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Check authentication
    if (!auth.isAuthenticated()) {
      router.push('/login');
      return;
    }

    // Get user info
    const user = auth.getCurrentUser();
    if (user) {
      setUsername(user.username);
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch stats and recent activities in parallel
        const [statsResponse, activitiesResponse] = await Promise.all([
          studentActivities.getStats(),
          studentActivities.getAll({ limit: 4, sortBy: 'date', sortOrder: 'desc' })
        ]);

        setStats(statsResponse);
        
        // Transform activities to match expected format
        const transformedActivities = activitiesResponse.map(activity => ({
          id: activity.id,
          name: activity.activityname || activity.activityName,
          professor: activity.instructorname || activity.instructorName,
          date: new Date(activity.activitydate || activity.activityDate).toLocaleDateString('pt-BR'),
          status: (activity.statusname || activity.statusName).toLowerCase()
        }));
        
        setRecentActivities(transformedActivities);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Erro ao carregar dados do dashboard');
        
        // Fallback to mock data if API fails
        setStats({ total: 0, completed: 0, inProgress: 0, pending: 0 });
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handlePageChange = (page) => {
    if (page === 'selfstudy') {
      router.push('/selfstudy');
    } else if (page === 'dashboard') {
      router.push('/dashboard');
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <ModernNavbar
          currentPage="dashboard"
          onPageChange={handlePageChange}
          username={username}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              Olá, <span className="gradient-text">{username}</span>! 👋
            </h1>
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-ada-red/30 border-t-ada-red rounded-full animate-spin"></div>
              <span className="text-lg text-slate-400">Carregando seus dados...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <ModernNavbar
          currentPage="dashboard"
          onPageChange={handlePageChange}
          username={username}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              Olá, <span className="gradient-text">{username}</span>! 👋
            </h1>
            <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-6 max-w-md mx-auto">
              <p className="text-red-300 font-medium">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-red-500/30 hover:bg-red-500/40 rounded-xl text-red-200 font-medium transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Animated background elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-ada-red/20 to-ada-accent/10 rounded-full blur-3xl animate-float opacity-40"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-ada-accent/15 to-ada-red/10 rounded-full blur-3xl animate-float opacity-30" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-ada-red/10 rounded-full blur-2xl animate-pulse opacity-20"></div>
      </div>

      <ModernNavbar
        currentPage="dashboard"
        onPageChange={handlePageChange}
        username={username}
        onSettingsClick={handleSettingsClick}
        onLogout={handleLogout}
      />
      
      <main className="relative px-4">
        <div className="container mx-auto px-4 py-8 space-y-8">
          {/* Header with greeting */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold">
              Olá, <span className="gradient-text">{username}</span>! 👋
            </h1>
            <p className="text-lg text-muted-foreground">
              Bem-vindo ao seu painel de autoestudos. Aqui você tem uma visão geral do seu progresso.
            </p>
          </div>

          {/* Floating background elements */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-ada-red/5 rounded-full floating-element" />
            <div className="absolute top-3/4 right-1/4 w-24 h-24 bg-ada-accent/5 rounded-full floating-element" />
            <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-purple-500/5 rounded-full floating-element" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Total de Atividades"
              value={stats.total}
              icon={Book}
              color="red"
              delay={0}
            />
            <StatsCard
              title="Concluídas"
              value={stats.completed}
              icon={CheckCircle}
              color="green"
              delay={100}
            />
            <StatsCard
              title="Em Andamento"
              value={stats.inProgress}
              icon={Clock}
              color="yellow"
              delay={200}
            />
            <StatsCard
              title="Pendentes"
              value={stats.pending}
              icon={ClipboardList}
              color="gray"
              delay={300}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ProgressBar
              completed={stats.completed}
              inProgress={stats.inProgress}
              total={stats.total}
            />
            <RecentActivities activities={recentActivities} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-white/10 py-8 mt-16 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 font-medium">
            AdaLove 2 - Instituto de Tecnologia e Liderança (Inteli) © 2024
          </p>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        username={username}
      />
    </div>
  );
}
