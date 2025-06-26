import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

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

  // Generic axios wrapper
 async request(method, endpoint, data = null) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      method,
      url,
      headers: this.getAuthHeaders(),
      data: data ? data : undefined,
    };
    try {
      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response ? error.response.data : error.message);
      throw error.response ? error.response.data : new Error(error.message);
    }
  }

  // Auth methods
  async signup(userData) {
    const response = await this.request('POST', '/auth/signup', userData);
    if (response.token) {
      this.setAuthToken(response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await this.request('POST', '/auth/login', credentials);
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
    return await this.request('GET', '/projects');
  }

  async createProject(projectData) {
    return await this.request('POST', '/projects', projectData);
  }

  async getProject(projectId) {
    return await this.request('GET', `/projects/${projectId}`);
  }

  async updateProject(projectId, projectData) {
    return await this.request('PUT', `/projects/${projectId}`, projectData);
  }

  async deleteProject(projectId) {
 return await this.request('DELETE', `/projects/${projectId}`);
  }

  // Task methods
  async createTask(projectId, taskData) {
 return await this.request('POST', `/projects/${projectId}/tasks`, taskData);
  }

  async updateTaskStatus(taskId, status) {
 return await this.request('PUT', `/tasks/${taskId}/status`, { status });
  }

  async updateTask(taskId, taskData) {
 return await this.request('PUT', `/tasks/${taskId}`, taskData);
  }

  async deleteTask(taskId) {
 return await this.request('DELETE', `/tasks/${taskId}`);
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