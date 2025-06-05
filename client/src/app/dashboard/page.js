import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    concluidos: 0,
    pendentes: 0,
    atrasados: 0
  });

  const [recentCards, setRecentCards] = useState([]);

  useEffect(() => {
    // Fetch stats from API
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulated data - replace with actual API calls
      setStats({
        total: 24,
        concluidos: 18,
        pendentes: 4,
        atrasados: 2
      });
      
      setRecentCards([
        {
          id: 1,
          title: "EAP - Estrutura Analítica de Projeto",
          instructor: "Fabiana Martins de Oliveira",
          type: "Autoestudo",
          status: "pending",
          week: "Semana 08"
        },
        {
          id: 2,
          title: "Matriz CSD",
          instructor: "Fabiana Martins de Oliveira", 
          type: "Autoestudo",
          status: "completed",
          week: "Semana 07"
        }
      ]);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  };

  const StatCard = ({ title, value, color, icon }) => (
    <div className="bg-ada-section-dark dark:bg-ada-section-dark rounded-xl p-6 border border-ada-red/10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ada-text-primary-dark/70 text-sm font-medium">{title}</p>
          <p className={`text-3xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg ${color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
          <span className="text-2xl">{icon}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-ada-text-primary-dark dark:text-ada-text-primary-dark">
              Dashboard
            </h1>
            <p className="text-ada-text-primary-dark/70 mt-1">
              Acompanhe seu progresso nos autoestudos
            </p>
          </div>
          <Link href="/autoestudos">
            <button className="bg-ada-red text-white px-6 py-3 rounded-lg hover:bg-ada-red/90 transition-colors font-medium">
              Ver Todos os Autoestudos
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total"
            value={stats.total}
            color="text-ada-accent-dark"
            icon="📚"
          />
          <StatCard
            title="Concluídos"
            value={stats.concluidos}
            color="text-green-400"
            icon="✅"
          />
          <StatCard
            title="Pendentes"
            value={stats.pendentes}
            color="text-yellow-400"
            icon="⏳"
          />
          <StatCard
            title="Atrasados"
            value={stats.atrasados}
            color="text-red-400"
            icon="⚠️"
          />
        </div>

        {/* Recent Activities */}
        <div className="bg-ada-section-dark dark:bg-ada-section-dark rounded-xl p-6 border border-ada-red/10">
          <h2 className="text-xl font-bold text-ada-text-primary-dark dark:text-ada-text-primary-dark mb-6">
            Atividades Recentes
          </h2>
          <div className="space-y-4">
            {recentCards.map(card => (
              <div key={card.id} className="flex items-center justify-between p-4 bg-ada-bg-dark/50 rounded-lg border border-ada-red/5">
                <div className="flex items-center space-x-4">
                  <div className={`w-3 h-3 rounded-full ${
                    card.status === 'completed' ? 'bg-green-400' : 
                    card.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <div>
                    <h3 className="font-medium text-ada-text-primary-dark">{card.title}</h3>
                    <p className="text-sm text-ada-text-primary-dark/70">{card.instructor} • {card.week}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  card.status === 'completed' ? 'bg-green-400/10 text-green-400' :
                  card.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                  'bg-red-400/10 text-red-400'
                }`}>
                  {card.status === 'completed' ? 'Concluído' :
                   card.status === 'pending' ? 'Pendente' : 'Atrasado'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}