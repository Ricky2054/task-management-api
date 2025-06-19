import React from 'react';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, loading, onEditTask, onDeleteTask }) => {
  if (loading) {
    return (
      <div className="text-center py-6">
        <div className="loading" style={{ width: '40px', height: '40px' }}></div>
        <p className="mt-4 text-gray-500">Loading tasks...</p>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card text-center py-6">
        <i className="fas fa-clipboard-list text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tasks found</h3>
        <p className="text-gray-500">
          Get started by creating your first task!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={() => onEditTask(task)}
          onDelete={() => onDeleteTask(task._id)}
        />
      ))}
    </div>
  );
};

export default TaskList; 