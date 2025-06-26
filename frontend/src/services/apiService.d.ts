interface Task {
  _id: string;
  name: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  assignedTo?: string;
  createdAt: string;
  project: string; // Assuming project ID is a string
}

interface Project {
  _id: string;
  name: string;
  description?: string;
  startDate?: string; // Assuming dates are strings in API response
  endDate?: string;
  collaboratorEmail?: string;
  owner: string; // Assuming owner ID is a string
  tasks: string[] | Task[]; // Tasks might be just IDs or full Task objects
  createdAt: string;
}

interface CreateProjectData {
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
  class ApiService {
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

  const apiServiceInstance: ApiService;
  export default apiServiceInstance;
}