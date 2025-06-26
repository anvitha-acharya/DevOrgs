export type UserRole = 'guide' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed';
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  members: string[];
  invitedEmails: string[];
  tasks: Task[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface EmailInvitation {
  id: string;
  email: string;
  projectId: string;
  role: UserRole;
  invitedBy: string;
  createdAt: Date;
  accepted: boolean;
}
