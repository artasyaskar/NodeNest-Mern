import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { projectService } from '../services/apiService';
import { ArrowLeft, Users, Calendar, Tag } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: projectData, isLoading, error } = useQuery(
    ['project', id],
    () => projectService.getProject(id),
    {
      enabled: !!id,
      onError: (error) => {
        console.error('Failed to load project:', error);
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

  if (error || !projectData) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
        <p className="text-gray-600 mb-4">The project you're looking for doesn't exist.</p>
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-primary"
        >
          Back to Projects
        </button>
      </div>
    );
  }

  const { project, tasks } = projectData;

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800';
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

  const getTaskStatusColor = (status) => {
    switch (status) {
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </button>
        </div>
      </div>

      {/* Project Header */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
              <span className={`status-badge ${getStatusColor(project.status)}`}>
                {project.status.replace('_', ' ')}
              </span>
              <span className={`status-badge ${getPriorityColor(project.priority)}`}>
                {project.priority}
              </span>
            </div>
            
            <p className="text-gray-600 mb-6">{project.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Team Members</p>
                  <p className="font-medium">{project.members.length}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Tag className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <p className="font-medium">{project.progress || 0}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags and Technologies */}
        <div className="mt-6 pt-6 border-t">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, index) => (
                    <span key={index} className="status-badge status-todo">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {project.technologies.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span key={index} className="status-badge status-progress">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Team Members</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {project.members.map((member) => (
            <div key={member.user._id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                {member.user.firstName.charAt(0)}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">
                  {member.user.firstName} {member.user.lastName}
                </p>
                <p className="text-sm text-gray-500 capitalize">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tasks */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Tasks ({tasks.length})</h2>
        </div>
        
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No tasks in this project yet.</p>
          ) : (
            tasks.map((task) => (
              <div key={task._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <span className={`status-badge ${getTaskStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-1">{task.description}</p>
                </div>
                
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  {task.assignedTo && (
                    <span>
                      {task.assignedTo.firstName} {task.assignedTo.lastName}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
