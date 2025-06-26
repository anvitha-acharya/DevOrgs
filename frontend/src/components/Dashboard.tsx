import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Project, Task } from '../types';
import { Plus, LogOut, Target, Calendar, Users, CheckCircle2, Clock, AlertCircle, Moon, Sun } from 'lucide-react';
import { ProjectDetail } from './ProjectDetail';
import { NewProjectModal } from './NewProjectModal';
import { NewTaskModal } from './NewTaskModal';

export function Dashboard() {
  const { state, dispatch } = useApp();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState<string | null>(null);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleDarkMode = () => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  };

  const getTaskStats = (project: Project) => {
    const total = project.tasks.length;
    const completed = project.tasks.filter(t => t.status === 'completed').length;
    const inProgress = project.tasks.filter(t => t.status === 'in-progress').length;
    const todo = project.tasks.filter(t => t.status === 'todo').length;

    return { total, completed, inProgress, todo };
  };

  // Handle project updates from ProjectDetail
  const handleProjectUpdate = (project: Project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
    // Update the selected project to reflect changes
    setSelectedProject(project);
  };

  if (selectedProject) {
    return (
      <ProjectDetail
        project={selectedProject}
        onBack={() => setSelectedProject(null)}
        onProjectUpdate={handleProjectUpdate}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Target className={`h-8 w-8 ${state.darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
              <div>
                <h1 className={`text-2xl font-bold ${
                  state.darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  DevOrgs
                </h1>
                <p className={`text-sm ${
                  state.darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Welcome back, {state.auth.user?.name}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                state.auth.user?.role === 'guide'
                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                {state.auth.user?.role === 'guide' ? 'Guide' : 'Student'}
              </div>

              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  state.darkMode
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {state.darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              <button
                onClick={handleLogout}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  state.darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className={`text-3xl font-bold ${
              state.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Dashboard
            </h2>
            <p className={`mt-2 ${
              state.darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {state.auth.user?.role === 'guide'
                ? 'Manage your projects and track student progress'
                : 'View your assigned projects and manage tasks'
              }
            </p>
          </div>

          {state.auth.user?.role === 'guide' && (
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              <Plus className="h-5 w-5" />
              <span>New Project</span>
            </button>
          )}
        </div>

        {/* Projects Grid */}
        {state.projects.length === 0 ? (
          <div className={`text-center py-16 ${
            state.darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            <Target className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
            <p>
              {state.auth.user?.role === 'guide'
                ? 'Create your first project to get started'
                : 'Your guide will assign projects to you'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {state.projects.map((project) => {
              const stats = getTaskStats(project);
              const progressPercentage = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

              return (
                <div
                  key={project.id}
                  className={`rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md cursor-pointer ${
                    state.darkMode
                      ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-xl font-semibold ${
                        state.darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <Calendar className={`h-4 w-4 ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <p className={`text-sm mb-4 line-clamp-2 ${
                      state.darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {project.description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-sm font-medium ${
                          state.darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Progress
                        </span>
                        <span className={`text-sm ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {stats.completed}/{stats.total} tasks
                        </span>
                      </div>
                      <div className={`w-full bg-gray-200 rounded-full h-2 ${
                        state.darkMode ? 'bg-gray-700' : 'bg-gray-200'
                      }`}>
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Task Stats */}
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-1">
                          <AlertCircle className="h-4 w-4 text-yellow-500" />
                          <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {stats.todo}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {stats.inProgress}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>
                            {stats.completed}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className={`h-4 w-4 ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-sm ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {project.members.length}
                        </span>
                      </div>
                    </div>

                    {/* New Task Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowNewTaskModal(project.id);
                      }}
                      className={`w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        state.darkMode
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <Plus className="h-4 w-4" />
                      <span>New Task</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Modals */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onSubmit={(projectData) => {
            const newProject: Project = {
              id: Date.now().toString(),
              title: projectData.title,
              description: projectData.description,
              startDate: projectData.startDate,
              endDate: projectData.endDate,
              createdBy: state.auth.user?.id || '',
              createdAt: new Date(),
              updatedAt: new Date(),
              members: [state.auth.user?.id || ''],
              invitedEmails: projectData.invitedEmails,
              tasks: [], // Start with empty tasks array - no dummy data
            };
            dispatch({ type: 'ADD_PROJECT', payload: newProject });
            setShowNewProjectModal(false);
          }}
        />
      )}

      {showNewTaskModal && (
        <NewTaskModal
          projectId={showNewTaskModal}
          onClose={() => setShowNewTaskModal(null)}
          onSubmit={(taskData) => {
            const newTask: Task = {
              id: Date.now().toString(),
              ...taskData,
              status: 'todo',
              createdBy: state.auth.user?.id || '',
              createdAt: new Date(),
              updatedAt: new Date(),
            };
            dispatch({
              type: 'ADD_TASK',
              payload: { projectId: showNewTaskModal, task: newTask }
            });
            setShowNewTaskModal(null);
          }}
        />
      )}
    </div>
  );
}