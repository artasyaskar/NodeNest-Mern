import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { Link } from 'react-router-dom';
import { taskService } from '../services/apiService';
import { Plus, Filter, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    project: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading, error } = useQuery(
    ['tasks', filters],
    () => taskService.getTasks(filters),
    {
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to load tasks');
      }
    }
  );

  const createTaskMutation = useMutation(taskService.createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create task');
    }
  });

  const handleCreateTask = () => {
    const title = prompt('Enter task title:');
    const description = prompt('Enter task description:');
    
    if (title && description) {
      createTaskMutation.mutate({
        title,
        description,
        priority: 'medium',
        type: 'feature'
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'critical': return 'bg-purple-100 text-purple-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'bug': return 'bg-red-100 text-red-800';
      case 'feature': return 'bg-blue-100 text-blue-800';
      case 'refactor': return 'bg-purple-100 text-purple-800';
      case 'documentation': return 'bg-green-100 text-green-800';
      case 'testing': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
          <p className="mt-2 text-gray-600">Manage and track your tasks across all projects.</p>
        </div>
        <button
          onClick={handleCreateTask}
          className="btn btn-primary flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </button>
      </div>

      {/* Filters and Search */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="form-input"
            >
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="completed">Completed</option>
            </select>
            
            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="form-input"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Link
            key={task._id}
            to={`/tasks/${task._id}`}
            className="card hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{task.title}</h3>
                  <span className={`status-badge ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ')}
                  </span>
                  <span className={`status-badge ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                  <span className={`status-badge ${getTypeColor(task.type)}`}>
                    {task.type}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>Project: {task.project?.name}</span>
                  {task.assignedTo && (
                    <span>Assigned to: {task.assignedTo.firstName} {task.assignedTo.lastName}</span>
                  )}
                  {task.dueDate && (
                    <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <CheckSquare className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || filters.status || filters.priority 
              ? 'Try adjusting your filters or search terms.' 
              : 'Get started by creating your first task.'}
          </p>
          <button
            onClick={handleCreateTask}
            className="btn btn-primary"
          >
            Create Task
          </button>
        </div>
      )}
    </div>
  );
};

export default Tasks;
