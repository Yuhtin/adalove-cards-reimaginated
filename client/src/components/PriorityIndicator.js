export default function PriorityIndicator({ priority }) {
  const colors = {
    high: 'bg-red-400',
    medium: 'bg-yellow-400',
    low: 'bg-green-400'
  };
  
  return <div className={`w-1 h-full ${colors[priority]} rounded-l-lg`}></div>;
}