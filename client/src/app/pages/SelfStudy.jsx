import { useState, useMemo } from 'react';
import WeekSelector from '@/components/selfstudy/WeekSelector';
import SelfStudyHeader from '@/components/selfstudy/SelfStudyHeader';
import ViewToggle from '@/components/selfstudy/ViewToggle';
import FilterCard from '@/components/selfstudy/FilterCard';
import ActivityCard from '@/components/selfstudy/ActivityCard';
import ActivityTimeline from '@/components/selfstudy/ActivityTimeline';
import ActivityTable from '@/components/selfstudy/ActivityTable';
import EmptyState from '@/components/selfstudy/EmptyState';
import ActivityDetailModal from '@/components/selfstudy/ActivityDetailModal';
import ImportModal from '@/components/selfstudy/ImportModal';

const mockActivities = [
  {
    id: 1,
    name: "Introdução ao Machine Learning",
    professor: "Dr. Ana Silva",
    date: "2024-03-15",
    week: 1,
    isRequired: true,
    url: "https://adalove.inteli.edu.br/ml-intro",
    type: "Auto Estudo",
    status: "A Fazer"
  },
  {
    id: 2,
    name: "Análise de Algoritmos",
    professor: "Prof. Carlos Santos",
    date: "2024-03-16",
    week: 1,
    isRequired: false,
    url: "https://adalove.inteli.edu.br/algorithms",
    type: "Avaliação e Pesquisa",
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
    type: "Desenvolvimento de Projetos",
    status: "Feito"
  }
];

const SelfStudy = () => {
  const [activities] = useState(mockActivities);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [showWeekSelector, setShowWeekSelector] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'table'>('cards');
  const [filters, setFilters] = useState({
    search: '',
    status: 'Todos',
    type: 'Todos',
    week: '',
    required: 'Todos'
  });
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);

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

  const handleStatusChange = (activityId, newStatus) => {
    console.log(`Updating activity ${activityId} to status: ${newStatus}`);
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

  if (showWeekSelector) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <SelfStudyHeader
          showWeekSelector={true}
          selectedWeek={selectedWeek}
          onBackToWeeks={handleBackToWeeks}
        />
        
        <WeekSelector
          onWeekSelect={handleWeekSelect}
          activitiesByWeek={activitiesByWeek}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <SelfStudyHeader
        showWeekSelector={false}
        selectedWeek={selectedWeek}
        onBackToWeeks={handleBackToWeeks}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-1/4">
          <FilterCard
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            onImportClick={() => setShowImportModal(true)}
          />
        </div>

        <div className="lg:w-3/4 space-y-6">
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
          {renderActivitiesView()}
        </div>
      </div>

      <ActivityDetailModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={() => setSelectedActivity(null)}
      />

      <ImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
      />
    </div>
  );
};

export default SelfStudy;