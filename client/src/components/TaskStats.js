import React from 'react';

const TaskStats = ({ stats }) => {
  if (!stats) return null;

  const { statusStats, priorityStats, totalTasks } = stats;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock';
      case 'in-progress':
        return 'fas fa-spinner';
      case 'completed':
        return 'fas fa-check-circle';
      case 'cancelled':
        return 'fas fa-times-circle';
      default:
        return 'fas fa-circle';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'low':
        return 'fas fa-arrow-down';
      case 'medium':
        return 'fas fa-minus';
      case 'high':
        return 'fas fa-arrow-up';
      case 'urgent':
        return 'fas fa-exclamation';
      default:
        return 'fas fa-minus';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'in-progress':
        return '#3b82f6';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low':
        return '#6b7280';
      case 'medium':
        return '#f59e0b';
      case 'high':
        return '#f97316';
      case 'urgent':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold mb-4">
        <i className="fas fa-chart-bar mr-2"></i>
        Task Statistics
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Tasks */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">Total Tasks</h3>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="text-3xl text-blue-500">
              <i className="fas fa-tasks"></i>
            </div>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-3">By Status</h3>
          <div className="space-y-2">
            {statusStats.map((stat) => (
              <div key={stat._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i 
                    className={getStatusIcon(stat._id)} 
                    style={{ color: getStatusColor(stat._id), width: '16px' }}
                  ></i>
                  <span className="text-sm text-gray-700 capitalize">
                    {stat._id.replace('-', ' ')}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-600 mb-3">By Priority</h3>
          <div className="space-y-2">
            {priorityStats.map((stat) => (
              <div key={stat._id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <i 
                    className={getPriorityIcon(stat._id)} 
                    style={{ color: getPriorityColor(stat._id), width: '16px' }}
                  ></i>
                  <span className="text-sm text-gray-700 capitalize">
                    {stat._id}
                  </span>
                </div>
                <span className="font-medium text-gray-900">{stat.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar for Completion */}
      {statusStats.length > 0 && (
        <div className="card mt-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">Completion Progress</h3>
          <div className="w-full bg-gray-200 rounded-full h-3">
            {(() => {
              const completed = statusStats.find(s => s._id === 'completed')?.count || 0;
              const percentage = totalTasks > 0 ? (completed / totalTasks) * 100 : 0;
              
              return (
                <div 
                  className="bg-green-500 h-3 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              );
            })()}
          </div>
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>
              {statusStats.find(s => s._id === 'completed')?.count || 0} completed
            </span>
            <span>
              {totalTasks > 0 ? Math.round((statusStats.find(s => s._id === 'completed')?.count || 0) / totalTasks * 100) : 0}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats; 