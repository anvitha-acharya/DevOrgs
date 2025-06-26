import { Project, Task } from '../types';
import axios from 'axios'; // If you need axios types within the declaration

interface CreateProjectData {
 _id?: string; // Allow _id for updates/creation if needed
  name: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  collaboratorEmail?: string;
  owner: string; // Assuming owner ID is a string
}

interface LoginResponse {
  token: string;
  // Add other properties from login response if any
}

interface SignupResponse {
  token: string;
  // Add other properties from signup response if any
}



declare module './apiService' {
  class ApiService { // Renamed class from ApiService to Service
    setAuthToken(token: string | null): void;
    getAuthHeaders(): { 'Content-Type': string; Authorization?: string };
    request<T>(method: string, endpoint: string, data?: any): Promise<T>;
    signup(userData: any): Promise<SignupResponse>; // Refine userData type
    login(credentials: any): Promise<LoginResponse>; // Refine credentials type
    logout(): void;
    getProjects(): Promise<Project[]>; // Assuming getProjects returns an array
    createProject(projectData: CreateProjectData): Promise<Project>;
    getProject(projectId: string): Promise<Project>;
    updateProject(projectId: string, projectData: Partial<Project>): Promise<Project>; // Use Partial for updates
    deleteProject(projectId: string): Promise<{ message: string }>; // Assuming a message on successful deletion
    createTask(projectId: string, taskData: Partial<Task>): Promise<Task>; // Refine taskData type, use Partial
    updateTaskStatus(taskId: string, status: Task['status']): Promise<Task>;
    updateTask(taskId: string, taskData: Partial<Task>): Promise<Task>; // Use Partial for updates
    deleteTask(taskId: string): Promise<{ message: string }>; // Assuming a message on successful deletion
    getUserProfile(): Promise<any>; // Define a UserProfile interface
    updateUserProfile(userData: any): Promise<any>; // Refine userData and return types
 }

  declare const apiServiceInstance: ApiService;
  export default apiServiceInstance;
}