import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskModal from './components/TaskModal';
import TaskStats from './components/TaskStats';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: ''
  });
  const [stats, setStats] = useState(null);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.search) params.append('search', filters.search);
      
      const response = await axios.get(`${API_BASE_URL}/tasks?${params}`);
      setTasks(response.data.data || []);
      setError('');
    } catch (err) {
      setError('Failed to fetch tasks. Please check if the server is running.');
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch task statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/tasks/stats`);
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/tasks`, taskData);
      setTasks([response.data.data, ...tasks]);
      setShowModal(false);
      fetchStats(); // Refresh stats
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.join(', ') || 
                          err.response?.data?.message || 
                          'Failed to create task';
      return { success: false, error: errorMessage };
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/tasks/${taskId}`, taskData);
      setTasks(tasks.map(task => 
        task._id === taskId ? response.data.data : task
      ));
      setShowModal(false);
      setEditingTask(null);
      fetchStats(); // Refresh stats
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.errors?.join(', ') || 
                          err.response?.data?.message || 
                          'Failed to update task';
      return { success: false, error: errorMessage };
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/tasks/${taskId}`);
      setTasks(tasks.filter(task => task._id !== taskId));
      fetchStats(); // Refresh stats
    } catch (err) {
      setError('Failed to delete task');
      console.error('Error deleting task:', err);
    }
  };

  // Handle edit task
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  // Handle new task
  const handleNewTask = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  // Handle filter change
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: '',
      priority: '',
      search: ''
    });
  };

  // Fetch tasks when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  // Fetch initial data
  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, []);

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="container">
          <h1>
            <i className="fas fa-tasks"></i> Task Management
          </h1>
          <p>Organize and manage your tasks efficiently</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6">
        {/* Statistics */}
        {stats && <TaskStats stats={stats} />}

        {/* Controls */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <button 
              onClick={handleNewTask}
              className="btn btn-primary"
            >
              <i className="fas fa-plus"></i>
              Add New Task
            </button>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Filter by Status</label>
              <select 
                className="form-select"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Filter by Priority</label>
              <select 
                className="form-select"
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Search Tasks</label>
              <input 
                type="text"
                className="form-input"
                placeholder="Search by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>

          {/* Clear filters button */}
          {(filters.status || filters.priority || filters.search) && (
            <div className="mt-4">
              <button 
                onClick={clearFilters}
                className="btn btn-secondary"
              >
                <i className="fas fa-times"></i>
                Clear Filters
              </button>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="card mb-6" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="flex items-center gap-2">
              <i className="fas fa-exclamation-circle" style={{ color: '#ef4444' }}></i>
              <span className="error">{error}</span>
            </div>
          </div>
        )}

        {/* Task List */}
        <TaskList 
          tasks={tasks}
          loading={loading}
          onEditTask={handleEditTask}
          onDeleteTask={deleteTask}
        />

        {/* Task Modal */}
        {showModal && (
          <TaskModal
            task={editingTask}
            onClose={() => {
              setShowModal(false);
              setEditingTask(null);
            }}
            onSubmit={editingTask ? updateTask : createTask}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="py-6" style={{ borderTop: '1px solid #e5e7eb', marginTop: '2rem' }}>
        <div className="container text-center text-gray-500">
          <p>Task Management API - Built with React and Node.js</p>
        </div>
      </footer>
    </div>
  );
}

export default App; 