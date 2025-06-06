'use client';

import { motion } from 'framer-motion';

const TimelineView = ({ activities, statusTypes, updateActivityStatus, formatDate, getStatusColor }) => {
  const groupedByWeek = activities.reduce((acc, activity) => {
    const week = activity.weeknumber;
    if (!acc[week]) acc[week] = [];
    acc[week].push(activity);
    return acc;
  }, {});

  const StarIcon = () => (
    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  return (
    <div className="space-y-12">
      {Object.entries(groupedByWeek)
        .sort(([a], [b]) => parseInt(a) - parseInt(b))
        .map(([week, weekActivities], weekIndex) => (
        <motion.div
          key={week}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: weekIndex * 0.1 }}
          className="relative"
        >
          {/* Week header */}
          <div className="flex items-center mb-8">
            <div className="bg-gradient-to-r from-ada-red to-ada-accent-light text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-xl">
              Semana {week}
            </div>
            <div className="flex-1 h-1 bg-gradient-to-r from-ada-red/50 to-transparent ml-6 rounded-full"></div>
            <div className="text-sm text-ada-text-primary-light/60 dark:text-ada-text-primary-dark/60 ml-4">
              {weekActivities.length} atividade{weekActivities.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          {/* Activities for this week */}
          <div className="relative ml-12">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-ada-red to-ada-accent-light"></div>
            
            <div className="space-y-6">
              {weekActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (weekIndex * 0.1) + (index * 0.05) }}
                  className="relative flex items-start gap-6"
                >
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-6 h-6 rounded-full flex-shrink-0 border-4 border-white dark:border-gray-800 shadow-lg ${getStatusColor(activity.statusname)}`}>
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-current"></div>
                  </div>
                  
                  {/* Activity card */}
                  <div className="flex-1 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-ada-red/10 hover:border-ada-red/30 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-xl text-ada-text-primary-light dark:text-ada-text-primary-dark group-hover:text-ada-red transition-colors mb-2">
                          {activity.activityname}
                        </h3>
                        <p className="text-ada-text-primary-light/70 dark:text-ada-text-primary-dark/70 text-sm">
                          {activity.activitytypename}
                        </p>
                      </div>
                      {activity.mandatory && (
                        <div className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                          <StarIcon />
                          OBRIGATÓRIA
                        </div>
                      )}
                    </div>
                    
                    {/* Activity details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-ada-red rounded-full"></div>
                          <span className="text-sm text-ada-text-primary-light/60 dark:text-ada-text-primary-dark/60">Professor:</span>
                          <span className="font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark">
                            {activity.instructorname}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-ada-accent-light rounded-full"></div>
                          <span className="text-sm text-ada-text-primary-light/60 dark:text-ada-text-primary-dark/60">Data:</span>
                          <span className="font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark">
                            {formatDate(activity.activitydate)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-end">
                        <div className="text-right">
                          <div className="text-sm text-ada-text-primary-light/60 dark:text-ada-text-primary-dark/60 mb-1">
                            Status atual
                          </div>
                          <span className={`inline-block px-4 py-2 text-sm rounded-full font-medium ${getStatusColor(activity.statusname)}`}>
                            {activity.statusname}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-ada-text-primary-light/60 dark:text-ada-text-primary-dark/60">
                          Progresso
                        </span>
                        <span className="text-sm font-medium text-ada-text-primary-light dark:text-ada-text-primary-dark">
                          {activity.statusname === 'feito' ? '100%' :
                           activity.statusname === 'fazendo' ? '50%' : '0%'}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${
                            activity.statusname === 'feito' ? 'bg-gradient-to-r from-green-500 to-emerald-500 w-full' :
                            activity.statusname === 'fazendo' ? 'bg-gradient-to-r from-yellow-500 to-orange-500 w-1/2' :
                            'bg-gradient-to-r from-gray-400 to-gray-500 w-1/4'
                          }`}
                        >
                          <div className="h-full bg-white/20 animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action area */}
                    <div className="flex items-center justify-between pt-4 border-t border-ada-red/10">
                      <div className="text-sm text-ada-text-primary-light/60 dark:text-ada-text-primary-dark/60">
                        Alterar status:
                      </div>
                      <select
                        value={activity.statustypeid}
                        onChange={(e) => updateActivityStatus(activity.id, parseInt(e.target.value))}
                        className="px-4 py-2 bg-white dark:bg-gray-700 border border-ada-red/20 rounded-xl text-sm focus:ring-2 focus:ring-ada-red/50 focus:border-ada-red transition-all min-w-[140px]"
                      >
                        {statusTypes.map(status => (
                          <option key={status.id} value={status.id}>{status.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TimelineView;