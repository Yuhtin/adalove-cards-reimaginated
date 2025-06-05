export default function StatCard({ title, value, color, icon }) {
  return (
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
}