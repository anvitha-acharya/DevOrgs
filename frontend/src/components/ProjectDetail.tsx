import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Plus } from 'lucide-react';
import apiService from '../services/apiService'; // Import the default exported instance
import { Project, Task, TaskStatus } from '../types'; // Import types from types.ts

export function ProjectDetail() {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);
  const [draggedOver, setDraggedOver] = useState<Task['status'] | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (projectId) {
          setLoading(true); // Set loading before fetching
          const data = await apiService.getProject(projectId); // Use the instance method
          setProject(data as Project); // Add this assertion temporarily
        }
      } catch (err) {
        setError('Failed to fetch project');
        console.error(err);
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchProject();
  }, [projectId]); // Dependency array includes projectId

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: Task): void => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // It's generally not recommended to set dataTransfer with complex HTML.
    // A better approach is to transfer the task ID or a string representation.
    e.dataTransfer.setData('text/plain', task._id);
    // Consider a custom drag image if needed, but default is often fine.
    // e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: TaskStatus): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDraggedOver(status);
  };

  const handleDragLeave = (): void => {
    setDraggedOver(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: Task['status']): void => {
    e.preventDefault();
    setDraggedOver(null);

    const taskId = e.dataTransfer.getData('text/plain'); // Get task ID from dataTransfer

    if (project && taskId) {
      const draggedTask = (project.tasks as (string | Task)[]).find(task => typeof task !== 'string' && task._id === taskId);

      // Check if the found item is actually a Task object before accessing properties
      if (typeof draggedTask !== 'object' || draggedTask === null || !('status' in draggedTask)) {
        console.error('Dragged task is not a valid Task object');
        return; // Exit if not a valid Task object
      }
      if (draggedTask.status !== newStatus) {
        // Optimistically update the UI
        setProject(prev => {
          if (!prev) return null;
          return {
            ...prev,
            tasks: (prev.tasks as Task[]).map(task => // Added assertion here as we expect Task[] after fetch
              task._id === taskId
                ? { ...task, status: newStatus }
                : task
            )
          };
        });

        // TODO: Call backend API to update task status
        // updateTaskStatus(taskId, newStatus); // You'll need to implement updateTaskStatus in apiService
      }
    }
    setDraggedTask(null);
  };


  const getTasksByStatus = (status: TaskStatus): Task[] => {
    if (!project) return [];
    // Check if tasks are populated (Task[]) or just IDs (string[])
    if (Array.isArray(project.tasks) && project.tasks.length > 0 && typeof project.tasks[0] === 'object') {
      return (project.tasks as Task[]).filter(task => task.status === status);
    }
    // If tasks are just IDs or empty, return an empty array (cannot filter by status)
    return [];
  };

  const renderColumn = (title: string, status: TaskStatus, color: string): JSX.Element => {
    const tasks = getTasksByStatus(status);
    const isDraggedOver = draggedOver === status;

    return (
      <div
        key={status} // Add a key to the column div
        className={`flex-1 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4 transition-all duration-200`}
      >
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
          {tasks.map((task) => (
            <div
              key={task._id} // Use _id as key
              draggable
              onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, task)}
              className={`p-4 rounded-lg border transition-all duration-200 cursor-move select-none ${
                draggedTask?._id === task._id // Use _id for comparison
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
                {task.name} {/* Use task.name */}
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
                    {task.assignedTo || 'Unassigned'} {/* Use task.assignedTo */}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className={`h-3 w-3 ${
                    darkMode ? 'text-gray-500' : 'text-gray-400'
                  }`} />
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
           {/* Add a placeholder for empty columns to make them drop targets */}
           {tasks.length === 0 && (
            <div className="h-full min-h-[100px]"></div>
           )}
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading project...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found.</div>;
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
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-400'
                    : 'hover:bg-gray-100 text-gray-600'
                }`}
                onClick={() => window.history.back()} // Go back
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {project.name} {/* Use project.name */}
                </h1>
                <p className={`text-sm ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {project.description}
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
            'done', // Use 'done' to match backend
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
            </h3> {/* Changed to Total Tasks */}
            <p className={`text-2xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {project.tasks.length}
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
              {getTasksByStatus('done').length} {/* Use 'done' */}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
