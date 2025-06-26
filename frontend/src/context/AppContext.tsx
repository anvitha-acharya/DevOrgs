import type React from 'react';
import { createContext, useContext, useReducer, type ReactNode } from 'react'
import type { User, Project, Task, AuthState } from '../types';

interface AppState {
  auth: AuthState;
  projects: Project[];
  darkMode: boolean;
}

type AppAction =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'ADD_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'UPDATE_TASK'; payload: { projectId: string; task: Task } }
  | { type: 'MOVE_TASK'; payload: { projectId: string; taskId: string; newStatus: Task['status'] } }
  | { type: 'TOGGLE_DARK_MODE' };

const initialState: AppState = {
  auth: {
    user: null,
    isAuthenticated: false,
  },
  projects: [],
  darkMode: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        auth: {
          user: action.payload,
          isAuthenticated: true,
        },
      };
    case 'LOGOUT':
      return {
        ...state,
        auth: {
          user: null,
          isAuthenticated: false,
        },
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.id ? action.payload : p
        ),
      };
    case 'ADD_TASK':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? { ...p, tasks: [...p.tasks, action.payload.task] }
            : p
        ),
      };
    case 'UPDATE_TASK':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? {
                ...p,
                tasks: p.tasks.map(t =>
                  t.id === action.payload.task.id ? action.payload.task : t
                ),
              }
            : p
        ),
      };
    case 'MOVE_TASK':
      return {
        ...state,
        projects: state.projects.map(p =>
          p.id === action.payload.projectId
            ? {
                ...p,
                tasks: p.tasks.map(t =>
                  t.id === action.payload.taskId
                    ? { ...t, status: action.payload.newStatus, updatedAt: new Date() }
                    : t
                ),
              }
            : p
        ),
      };
    case 'TOGGLE_DARK_MODE':
      return {
        ...state,
        darkMode: !state.darkMode,
      };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
