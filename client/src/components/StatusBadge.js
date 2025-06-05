export default function StatusBadge({ status }) {
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
}