import React from 'react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && task.status !== 'completed';
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-lg text-gray-800 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex gap-2 ml-2">
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Edit task"
          >
            <i className="fas fa-edit"></i>
          </button>
          <button
            onClick={onDelete}
            className="text-red-600 hover:text-red-800 transition-colors"
            title="Delete task"
          >
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {task.description}
      </p>

      {/* Status and Priority */}
      <div className="flex items-center gap-2 mb-4">
        <span className={`badge status-${task.status}`}>
          <i className={getStatusIcon(task.status)}></i>
          {task.status.replace('-', ' ')}
        </span>
        <span className={`badge priority-${task.priority}`}>
          <i className={getPriorityIcon(task.priority)}></i>
          {task.priority}
        </span>
      </div>

      {/* Due Date */}
      {task.dueDate && (
        <div className={`text-sm mb-3 ${isOverdue(task.dueDate) ? 'text-red-600' : 'text-gray-500'}`}>
          <i className="fas fa-calendar-alt mr-2"></i>
          Due: {formatDate(task.dueDate)}
          {isOverdue(task.dueDate) && (
            <span className="ml-2 text-red-600 font-semibold">
              (Overdue)
            </span>
          )}
        </div>
      )}

      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {task.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>
            <i className="fas fa-plus mr-1"></i>
            Created {new Date(task.createdAt).toLocaleDateString()}
          </span>
          {task.updatedAt !== task.createdAt && (
            <span>
              <i className="fas fa-edit mr-1"></i>
              Updated {new Date(task.updatedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 