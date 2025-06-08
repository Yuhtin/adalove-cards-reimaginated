'use client'

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import WeekSelector from '../components/selfstudy/WeekSelector';
import EmptyWeekSelector from '../components/selfstudy/EmptyWeekSelector';
import SelfStudyHeader from '../components/selfstudy/SelfStudyHeader';
import ViewToggle from '../components/selfstudy/ViewToggle';
import HorizontalFilters from '../components/selfstudy/HorizontalFilters';
import ActivityCard from '../components/selfstudy/ActivityCard';
import ActivityTimeline from '../components/selfstudy/ActivityTimeline';
import ActivityTable from '../components/selfstudy/ActivityTable';
import EmptyState from '../components/selfstudy/EmptyState';
import ActivityDetailModal from '../components/selfstudy/ActivityDetailModal';
import ImportModal from '../components/selfstudy/ImportModal';
import ModernNavbar from '../components/layout/ModernNavbar';
import SettingsModal from '../components/modals/SettingsModal';
import { studentActivities, auth } from '../../lib/api';

const mockActivities = [
  {
    id: 1,
    name: "Introdução ao Machine Learning",
    professor: "Dr. Ana Silva",
    date: "2024-03-15",
    week: 1,
    isRequired: true,
    url: "https://adalove.inteli.edu.br/ml-intro",
    type: "Autoestudo",
    status: "A fazer"
  },
  {
    id: 2,
    name: "Análise de Algoritmos",
    professor: "Prof. Carlos Santos",
    date: "2024-03-16",
    week: 1,
    isRequired: false,
    url: "https://adalove.inteli.edu.br/algorithms",
    type: "Instrução",
    status: "Fazendo"
  },
  {
    id: 3,
    name: "Desenvolvimento Web Avançado",
    professor: "Profa. Maria Costa",
    date: "2024-03-17",
    week: 2,
    isRequired: true,
    url: "https://adalove.inteli.edu.br/web-dev",
    type: "Artefatos",
    status: "Feito"
  }
];

export default function SelfStudyPage() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [showWeekSelector, setShowWeekSelector] = useState(true);
  const [viewMode, setViewMode] = useState('cards');
  const [filters, setFilters] = useState({
    search: '',
    status: 'Todos',
    type: 'Todos',
    week: '',
    required: 'Todos'
  });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [username, setUsername] = useState('Usuário');

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

    const fetchActivities = async () => {
      try {
        setLoading(true);
        const response = await studentActivities.getAll();

        // Transform backend data to frontend format
        const transformedActivities = response.map(activity => ({
          id: activity.id,
          name: activity.activityname || activity.activityName,
          professor: activity.instructorname || activity.instructorName || 'Professor não informado',
          date: activity.activitydate || activity.activityDate,
          week: activity.weeknumber || activity.weekNumber,
          isRequired: activity.mandatory,
          url: activity.basicactivityurl || activity.basicActivityURL,
          type: activity.activitytypename || activity.activityTypeName,
          status: activity.statusname || activity.statusName
        }));

        setActivities(transformedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
        setError('Erro ao carregar atividades');
        setActivities(mockActivities); // Fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [router]);

  const activitiesByWeek = useMemo(() => {
    return activities.reduce((acc, activity) => {
      if (!acc[activity.week]) {
        acc[activity.week] = { total: 0, completed: 0 };
      }
      acc[activity.week].total++;
      if (activity.status === 'Feito') {
        acc[activity.week].completed++;
      }
      return acc;
    }, {});
  }, [activities]);

  const filteredActivities = useMemo(() => {
    return activities.filter(activity => {
      const matchesWeek = selectedWeek ? activity.week === selectedWeek : true;
      const matchesSearch = activity.name.toLowerCase().includes(filters.search.toLowerCase());
      const matchesStatus = filters.status === 'Todos' || activity.status === filters.status;
      const matchesType = filters.type === 'Todos' || activity.type === filters.type;
      const matchesRequired = filters.required === 'Todos' || 
        (filters.required === 'Sim' && activity.isRequired) || 
        (filters.required === 'Não' && !activity.isRequired);

      return matchesWeek && matchesSearch && matchesStatus && matchesType && matchesRequired;
    });
  }, [activities, selectedWeek, filters]);

  const handleWeekSelect = (week) => {
    setSelectedWeek(week);
    setShowWeekSelector(false);
  };

  const handleBackToWeeks = () => {
    setSelectedWeek(null);
    setShowWeekSelector(true);
    setFilters(prev => ({ ...prev, search: '', status: 'Todos', type: 'Todos', week: '', required: 'Todos' }));
  };

  const handleStatusChange = async (activityId, newStatus) => {
    try {
      // Map frontend status to backend statusTypeId
      const statusMap = {
        'A fazer': 1,
        'Fazendo': 2,
        'Feito': 3
      };

      const statusTypeId = statusMap[newStatus];

      if (!statusTypeId) {
        console.error('Invalid status:', newStatus);
        return;
      }

      await studentActivities.updateStatus(activityId, statusTypeId);

      // Update local state
      setActivities(prev => prev.map(activity =>
        activity.id === activityId
          ? { ...activity, status: newStatus }
          : activity
      ));
    } catch (error) {
      console.error('Error updating activity status:', error);
      // Could show a toast notification here
    }
  };

  const handleActivityClick = (activity) => {
    setSelectedActivity(activity);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: 'Todos', type: 'Todos', week: '', required: 'Todos' });
  };

  const handleImportSuccess = () => {
    // Refresh activities after successful import
    const fetchActivities = async () => {
      try {
        const response = await studentActivities.getAll();
        const transformedActivities = response.map(activity => ({
          id: activity.id,
          name: activity.activityname || activity.activityName,
          professor: activity.instructorname || activity.instructorName || 'Professor não informado',
          date: activity.activitydate || activity.activityDate,
          week: activity.weeknumber || activity.weekNumber,
          isRequired: activity.mandatory,
          url: activity.basicactivityurl || activity.basicActivityURL,
          type: activity.activitytypename || activity.activityTypeName,
          status: activity.statusname || activity.statusName
        }));
        setActivities(transformedActivities);
      } catch (error) {
        console.error('Error refreshing activities:', error);
      }
    };
    
    fetchActivities();
    setShowImportModal(false);
  };

  const handlePageChange = (page) => {
    if (page === 'dashboard') {
      router.push('/dashboard');
    } else if (page === 'selfstudy') {
      router.push('/selfstudy');
    }
  };

  const handleSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleUserUpdate = (updatedUser) => {
    setUsername(updatedUser.username);
    // Update localStorage
    const currentUser = auth.getCurrentUser();
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify({
        ...currentUser,
        ...updatedUser
      }));
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const renderActivitiesView = () => {
    if (filteredActivities.length === 0) {
      return <EmptyState onImportClick={() => setShowImportModal(true)} />;
    }

    switch (viewMode) {
      case 'timeline':
        return (
          <ActivityTimeline
            activities={filteredActivities}
            onStatusChange={handleStatusChange}
            onActivityClick={handleActivityClick}
          />
        );
      case 'table':
        return (
          <ActivityTable
            activities={filteredActivities}
            onStatusChange={handleStatusChange}
            onActivityClick={handleActivityClick}
          />
        );
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredActivities.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onStatusChange={handleStatusChange}
                onActivityClick={handleActivityClick}
                index={index}
              />
            ))}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <ModernNavbar
          currentPage="selfstudy"
          onPageChange={handlePageChange}
          username={username}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <SelfStudyHeader
            showWeekSelector={true}
            selectedWeek={selectedWeek}
            onBackToWeeks={handleBackToWeeks}
          />
          <div className="text-center py-12">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-6 h-6 border-2 border-ada-red/30 border-t-ada-red rounded-full animate-spin"></div>
              <span className="text-lg text-slate-400">Carregando atividades...</span>
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
          currentPage="selfstudy"
          onPageChange={handlePageChange}
          username={username}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <SelfStudyHeader
            showWeekSelector={true}
            selectedWeek={selectedWeek}
            onBackToWeeks={handleBackToWeeks}
          />
          <div className="text-center py-12">
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

  if (showWeekSelector) {
    const hasWeeks = Object.keys(activitiesByWeek).length > 0;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <ModernNavbar
          currentPage="selfstudy"
          onPageChange={handlePageChange}
          username={username}
          onSettingsClick={handleSettingsClick}
          onLogout={handleLogout}
        />
        <div className="container mx-auto px-4 py-8 space-y-8">
          <SelfStudyHeader
            showWeekSelector={true}
            selectedWeek={selectedWeek}
            onBackToWeeks={handleBackToWeeks}
          />

          {hasWeeks ? (
            <WeekSelector
              onWeekSelect={handleWeekSelect}
              activitiesByWeek={activitiesByWeek}
            />
          ) : (
            <EmptyWeekSelector
              onImportClick={() => setShowImportModal(true)}
            />
          )}
        </div>

        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          username={username}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <ModernNavbar
        currentPage="selfstudy"
        onPageChange={handlePageChange}
        username={username}
        onSettingsClick={handleSettingsClick}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <SelfStudyHeader
          showWeekSelector={false}
          selectedWeek={selectedWeek}
          onBackToWeeks={handleBackToWeeks}
        />

        <div className="space-y-6">
          {/* View Toggle */}
          <div className="flex justify-center">
            <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          </div>

          {/* Horizontal Filters */}
          <HorizontalFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onImportClick={() => setShowImportModal(true)}
          />

          {/* Activities Content */}
          {renderActivitiesView()}
        </div>

        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
        />

        <ImportModal
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
          onImportSuccess={handleImportSuccess}
        />

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          username={username}
          onUserUpdate={handleUserUpdate}
        />
      </div>
    </div>
  );
}
