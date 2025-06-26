// apiService.js - Fixed version with proper class declaration and export

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  // Set auth token
  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Get auth headers
  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  // Generic fetch wrapper
  async fetchApi(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async signup(userData) {
    const response = await this.fetchApi('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  async login(credentials) {
    const response = await this.fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.token) {
      this.setAuthToken(response.token);
    }
    
    return response;
  }

  logout() {
    this.setAuthToken(null);
  }

  // Project methods
  async getProjects() {
    return await this.fetchApi('/projects');
  }

  async createProject(projectData) {
    return await this.fetchApi('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async getProject(projectId) {
    return await this.fetchApi(`/projects/${projectId}`);
  }

  async updateProject(projectId, projectData) {
    return await this.fetchApi(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  }

  async deleteProject(projectId) {
    return await this.fetchApi(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  }

  // Task methods
  async createTask(projectId, taskData) {
    return await this.fetchApi(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTaskStatus(taskId, status) {
    return await this.fetchApi(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async updateTask(taskId, taskData) {
    return await this.fetchApi(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId) {
    return await this.fetchApi(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  // User profile methods
  async getUserProfile() {
    return await this.fetchApi('/auth/profile');
  }

  async updateUserProfile(userData) {
    return await this.fetchApi('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }
}

// Export a single instance of the service
export default new ApiService();