import { Book, CheckCircle, Clock, ClipboardList } from 'lucide-react';
import StatsCard from '../components/dashboard/StatsCard';
import ProgressBar from '../components/dashboard/ProgressBar';
import RecentActivities from '../components/dashboard/RecentActivities';


const Dashboard = ({ username }) => {
  const stats = {
    total: 24,
    completed: 8,
    inProgress: 5,
    pending: 11
  };

  const recentActivities = [
    {
      id: 1,
      name: "Implementação de API REST",
      professor: "Prof. João Silva",
      date: "15/12/2024",
      status: "doing"
    },
    {
      id: 2,
      name: "Análise de Algoritmos",
      professor: "Prof. Maria Santos",
      date: "14/12/2024",
      status: "done"
    },
    {
      id: 3,
      name: "Design de Interface",
      professor: "Prof. Carlos Lima",
      date: "13/12/2024",
      status: "todo"
    },
    {
      id: 4,
      name: "Banco de Dados NoSQL",
      professor: "Prof. Ana Costa",
      date: "12/12/2024",
      status: "done"
    }
  ];

  return (
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
  );
};

export default Dashboard;