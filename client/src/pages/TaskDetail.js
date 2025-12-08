import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { taskService } from '../services/apiService';
import { ArrowLeft, Calendar, User, Clock, MessageSquare } from 'lucide-react';

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: taskData, isLoading, error } = useQuery(
    ['task', id],
    () => taskService.getTask(id),
    {
      enabled: !!id,
      onError: (error) => {
        console.error('Failed to load task:', error);
      }
    }
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error || !taskData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Task not found</h3>
        <p className="text-gray-600 mb-4">The task you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/tasks')}
          className="btn btn-primary"
        >
          Back to Tasks
        </button>
      </div>
    );
  }

  const { task } = taskData;

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/tasks')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Tasks
          </button>
        </div>
      </div>

      {/* Task Header */}
      <div className="card">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{task.title}</h1>
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
            
            <p className="text-gray-600 text-lg mb-6">{task.description}</p>
          </div>
        </div>

        {/* Task Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Created By</p>
              <p className="font-medium">
                {task.createdBy.firstName} {task.createdBy.lastName}
              </p>
            </div>
          </div>
          
          {task.assignedTo && (
            <div className="flex items-center space-x-3">
              <User className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p className="font-medium">
                  {task.assignedTo.firstName} {task.assignedTo.lastName}
                </p>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          
          {task.dueDate && (
            <div className="flex items-center space-x-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className="font-medium">{new Date(task.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Time Tracking */}
        {(task.estimatedHours || task.actualHours) && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Time Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {task.estimatedHours && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-500">Estimated Hours</p>
                    <p className="font-medium">{task.estimatedHours}h</p>
                  </div>
                </div>
              )}
              
              {task.actualHours && (
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-500">Actual Hours</p>
                    <p className="font-medium">{task.actualHours}h</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag, index) => (
                <span key={index} className="status-badge status-todo">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dependencies */}
      {task.dependencies && task.dependencies.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Dependencies</h2>
          </div>
          
          <div className="space-y-3">
            {task.dependencies.map((dependency) => (
              <div key={dependency._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{dependency.title}</h3>
                  <p className="text-sm text-gray-600">{dependency.description}</p>
                </div>
                <span className={`status-badge ${getStatusColor(dependency.status)}`}>
                  {dependency.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title flex items-center">
            <MessageSquare className="w-5 h-5 mr-2" />
            Comments ({task.comments.length})
          </h2>
        </div>
        
        <div className="space-y-4">
          {task.comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No comments yet.</p>
          ) : (
            task.comments.map((comment) => (
              <div key={comment._id} className="flex space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {comment.user.firstName.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {comment.user.firstName} {comment.user.lastName}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
