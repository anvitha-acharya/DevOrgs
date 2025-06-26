export type UserRole = 'guide' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Task {
  _id: string; // Changed from id to _id to match backend
  name: string; // Changed from title to name to match backend
  description: string;
  status: 'todo' | 'in-progress' | 'done'; // Changed 'completed' to 'done'
  assignedTo?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
export type TaskStatus = Task['status'];


export interface Project {
  _id: string; // Should be _id
  name: string; // Should be name
  description?: string;
  startDate?: Date; // Use Date type if they are dates
  endDate?: Date; // Use Date type if they are dates
  createdBy: string; // Assuming this is the owner's ID
  createdAt: Date;
  updatedAt: Date;
  members: string[]; // Assuming array of user IDs
  invitedEmails: string[];
  tasks: string[] | Task[]; // As we determined the API can return IDs or full tasks
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
