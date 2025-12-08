import React from 'react';
import { useQuery } from 'react-query';
import { projectService, taskService } from '../services/apiService';
import { FolderOpen, CheckSquare, Users, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { data: projects = [] } = useQuery('projects', projectService.getProjects);
  const { data: tasks = [] } = useQuery('tasks', taskService.getTasks);

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    totalTasks: tasks.length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    myTasks: tasks.filter(t => t.assignedTo?._id === localStorage.getItem('userId')).length,
    pendingTasks: tasks.filter(t => t.status === 'todo').length
  };

  const recentProjects = projects.slice(0, 5);
  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's what's happening with your projects.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckSquare className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTasks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">My Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.myTasks}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Projects</h2>
          </div>
          <div className="space-y-3">
            {recentProjects.length === 0 ? (
              <p className="text-gray-500">No projects yet</p>
            ) : (
              recentProjects.map((project) => (
                <div key={project._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{project.name}</h3>
                    <p className="text-sm text-gray-600">{project.members.length} members</p>
                  </div>
                  <span className={`status-badge ${
                    project.status === 'in_progress' ? 'status-progress' :
                    project.status === 'completed' ? 'status-completed' :
                    'status-todo'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Recent Tasks</h2>
          </div>
          <div className="space-y-3">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet</p>
            ) : (
              recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <p className="text-sm text-gray-600">{task.project?.name}</p>
                  </div>
                  <span className={`status-badge ${
                    task.status === 'in_progress' ? 'status-progress' :
                    task.status === 'completed' ? 'status-completed' :
                    task.status === 'review' ? 'status-review' :
                    'status-todo'
                  }`}>
                    {task.status.replace('_', ' ')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
