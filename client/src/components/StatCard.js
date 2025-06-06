import { motion } from 'framer-motion';

const StatCard = ({ title, value, color, icon, description, trend }) => (
  <motion.div 
    whileHover={{ scale: 1.02, y: -5 }}
    whileTap={{ scale: 0.98 }}
    className="group relative glass-card rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
  >
    {/* Floating icon with glassmorphism */}
    <div className="absolute -top-4 -right-4 bg-gradient-to-br from-ada-red/80 to-ada-accent-light/80 backdrop-blur-sm text-white p-3 rounded-full shadow-lg border border-white/20">
      {icon}
    </div>
    
    {/* Content */}
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-ada-text-primary-light/80 dark:text-ada-text-primary-dark/80">
        {title}
      </h3>
      <div className="flex items-end gap-2">
        <span className={`text-3xl font-bold ${color}`}>{value}</span>
        {trend && (
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`text-sm px-3 py-1 rounded-full font-medium backdrop-blur-sm ${
              trend > 0 
                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                : 'bg-red-500/20 text-red-400 border border-red-500/30'
            }`}
          >
            {trend > 0 ? '↗' : '↘'} {Math.abs(trend)}%
          </motion.span>
        )}
      </div>
      <p className="text-sm text-ada-text-primary-light/60 dark:text-ada-text-primary-dark/60">
        {description}
      </p>
    </div>
    
    {/* Hover effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-ada-red/5 to-ada-accent-light/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </motion.div>
);

export default StatCard;