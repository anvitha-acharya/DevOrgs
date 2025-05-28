import React from 'react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import { useApp } from '../context/AppContext';
import type { Project, Task } from '../types';
import { ArrowLeft, Calendar, User, Plus } from 'lucide-react';

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { state, dispatch } = useApp();

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as Task['status'];

    dispatch({
      type: 'MOVE_TASK',
      payload: {
        projectId: project.id,
        taskId: draggableId,
        newStatus,
      },
    });
  };

  const getTasksByStatus = (status: Task['status']) => {
    return project.tasks.filter(task => task.status === status);
  };

  const renderColumn = (title: string, status: Task['status'], color: string) => {
    const tasks = getTasksByStatus(status);

    return (
      <div className={`flex-1 ${state.darkMode ? 'bg-gray-800' : 'bg-gray-50'} rounded-lg p-4`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`font-semibold ${state.darkMode ? 'text-white' : 'text-gray-900'}`}>
            {title}
          </h3>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {tasks.length}
          </span>
        </div>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`min-h-[400px] space-y-3 ${
                snapshot.isDraggingOver
                  ? state.darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                  : ''
              } rounded-lg p-2 transition-colors duration-200`}
            >
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-4 rounded-lg border transition-all duration-200 ${
                        snapshot.isDragging
                          ? 'shadow-lg rotate-2'
                          : 'hover:shadow-md'
                      } ${
                        state.darkMode
                          ? 'bg-gray-700 border-gray-600 hover:border-gray-500'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <h4 className={`font-medium mb-2 ${
                        state.darkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={`text-sm mb-3 ${
                          state.darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {task.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-1">
                          <User className={`h-3 w-3 ${
                            state.darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                          <span className={state.darkMode ? 'text-gray-500' : 'text-gray-400'}>
                            {task.createdBy}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className={`h-3 w-3 ${
                            state.darkMode ? 'text-gray-500' : 'text-gray-400'
                          }`} />
                          <span className={state.darkMode ? 'text-gray-500' : 'text-gray-400'}>
                            {new Date(task.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      state.darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className={`border-b transition-colors duration-300 ${
        state.darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={onBack}
              className={`p-2 rounded-lg transition-colors duration-200 ${
                state.darkMode
                  ? 'hover:bg-gray-700 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className={`text-2xl font-bold ${
                state.darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                {project.title}
              </h1>
              <p className={`text-sm ${
                state.darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h2 className={`text-xl font-semibold mb-2 ${
            state.darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Task Board
          </h2>
          <p className={state.darkMode ? 'text-gray-400' : 'text-gray-600'}>
            Drag and drop tasks between columns to update their status
          </p>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {renderColumn(
              'To Do',
              'todo',
              state.darkMode
                ? 'bg-yellow-900 text-yellow-200'
                : 'bg-yellow-100 text-yellow-800'
            )}
            {renderColumn(
              'In Progress',
              'in-progress',
              state.darkMode
                ? 'bg-blue-900 text-blue-200'
                : 'bg-blue-100 text-blue-800'
            )}
            {renderColumn(
              'Completed',
              'completed',
              state.darkMode
                ? 'bg-green-900 text-green-200'
                : 'bg-green-100 text-green-800'
            )}
          </div>
        </DragDropContext>

        {/* Project Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-lg ${
            state.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              state.darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              Total Tasks
            </h3>
            <p className={`text-2xl font-bold ${
              state.darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {project.tasks.length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            state.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              state.darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              To Do
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {getTasksByStatus('todo').length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            state.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              state.darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              In Progress
            </h3>
            <p className="text-2xl font-bold text-blue-600">
              {getTasksByStatus('in-progress').length}
            </p>
          </div>
          <div className={`p-4 rounded-lg ${
            state.darkMode ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}>
            <h3 className={`text-sm font-medium ${
              state.darkMode ? 'text-gray-400' : 'text-gray-500'
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
