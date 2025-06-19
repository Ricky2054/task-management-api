import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';

const TaskModal = ({ task, onClose, onSubmit }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (taskData) => {
    setLoading(true);
    const result = task 
      ? await onSubmit(task._id, taskData)
      : await onSubmit(taskData);
    
    if (result.success) {
      onClose();
    }
    setLoading(false);
    return result;
  };

  // Close modal when clicking outside
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
            disabled={loading}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <TaskForm
          task={task}
          onSubmit={handleSubmit}
          onCancel={onClose}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default TaskModal; 