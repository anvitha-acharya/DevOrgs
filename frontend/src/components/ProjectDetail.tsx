import React, { useState } from 'react';
import { ArrowLeft, Calendar, User, Plus } from 'lucide-react';

// TypeScript types
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  createdBy: string;
  createdAt: string | Date;
}

import type { Project } from '../types';

type TaskStatus = Task['status'];

interface ProjectDetailProps {
  project: Project | null;
  onBack: () => void;
  onProjectUpdate?: (project: Project) => void;
}

export function ProjectDetail({ project, onBack, onProjectUpdate }: ProjectDetailProps) {
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOver, setDraggedOver] = useState<TaskStatus | null>(null);
  const [currentProject, setCurrentProject] = useState<Project | null>(project);

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task): void => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', (e.target as HTMLElement).outerHTML);
    e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus): void => {
    e.preventDefault(); // Keep this for drag and drop to work
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(status);
  };

  const handleDragLeave = (): void => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: TaskStatus): void => {
    e.preventDefault();
    setDraggedOver(null);
    
    if (draggedTask && draggedTask.status !== newStatus && currentProject) {
      const updatedProject = {
        ...currentProject,
        tasks: currentProject.tasks.map(task => 
          task.id === draggedTask.id 
            ? { ...task, status: newStatus }
            : task
        )
      };
      
      setCurrentProject(updatedProject);
      
      // Notify parent component about the update
      if (onProjectUpdate) {
        onProjectUpdate(updatedProject);
      }
    }
    setDraggedTask(null);
  };

  const getTasksByStatus = (status: TaskStatus): Task[] => {
    if (!currentProject) {
      return []; // Return empty array if project is null
    }
    return currentProject.tasks.filter(task => task.status === status);
  };

  const renderColumn = (title: string, status: TaskStatus, color: string): JSX.Element => {
    const tasks = getTasksByStatus(status);
    const isDraggedOver = draggedOver === status;

    return (
      <div className={`flex-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 transition-all duration-200`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {tasks.length}
          </span>
        </div>

        <div
          className={`min-h-[400px] space-y-3 rounded-lg p-2 transition-all duration-200 ${
            isDraggedOver
              ? darkMode
                ? 'bg-gray-700 border-2 border-blue-500'
                : 'bg-gray-100 border-2 border-blue-400'
              : 'border-2 border-transparent'
          }`}
          onDragOver={(e: React.DragEvent<HTMLDivElement>) => handleDragOver(e, status)}
          onDragLeave={handleDragLeave}
          onDrop={(e: React.DragEvent<HTMLDivElement>) => handleDrop(e, status)}
        >
          {tasks.length === 0 ? (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <p className="text-sm">No tasks in {title.toLowerCase()}</p>
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task)}
                className={`p-4 rounded-lg border transition-all duration-200 cursor-move select-none ${
                  draggedTask?.id === task.id
                    ? 'opacity-50 transform rotate-2'
                    : 'hover:shadow-md hover:scale-105'
                } ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                    : 'bg-white border-gray-200 hover:border-gray-300'
                }`}
              >
                <h4 className={`font-medium mb-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className={`text-sm mb-3 ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-1">
                    <User className={`h-3 w-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                      {task.createdBy}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className={`h-3 w-3 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`} />
                    <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                      {task.createdAt instanceof Date 
                        ? task.createdAt.toLocaleDateString()
                        : new Date(task.createdAt).toLocaleDateString()
                      }
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  // Handle case where project data is not yet loaded
  if (!currentProject) {
    return (
      <div className="flex justify-center items-center h-screen">Loading...</div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {currentProject.title}
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {currentProject.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`px-4 py-2 rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-2 ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Task Board
          </h2>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Drag and drop tasks between columns to update their status
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {renderColumn(
            'To Do',
            'todo',
            darkMode
              ? 'bg-yellow-900 text-yellow-200'
              : 'bg-yellow-100 text-yellow-800'
          )}
          {renderColumn(
            'In Progress',
            'in-progress',
            darkMode
              ? 'bg-blue-900 text-blue-200'
              : 'bg-blue-100 text-blue-800'
          )}
          {renderColumn(
            'Completed',
            'completed',
            darkMode
              ? 'bg-green-900 text-green-200'
              : 'bg-green-100 text-green-800'
          )}
        </div>

        {/* Project Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total Tasks
            </h3>
            <p className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {currentProject.tasks.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              To Do
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {getTasksByStatus('todo').length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              In Progress
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {getTasksByStatus('in-progress').length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Completed
            </h3>
            <p className="text-2xl font-bold text-green-600">
              {getTasksByStatus('completed').length}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}