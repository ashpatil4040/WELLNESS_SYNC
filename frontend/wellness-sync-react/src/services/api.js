// API service for Wellness Sync Backend
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('wellness_token');
  }

  // Test connectivity to backend
  async testConnection() {
    try {
      console.log('Testing connection to backend...');
      const response = await fetch('http://localhost:5000/health');
      console.log('Health check response status:', response.status);
      const data = await response.json();
      console.log('Health check data:', data);
      return data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  }

  // Helper method to set auth headers
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }
    return headers;
  }

  // Helper method to handle responses
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }

  // Authentication APIs
  async login(email, password) {
    console.log('API: Making login request to:', `${API_BASE_URL}/auth/login`);
    console.log('API: Login data:', { email, password: '***' });
    
    try {
      console.log('API: About to make fetch request...');
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      console.log('API: Fetch completed, response received');
      
      console.log('API: Login response status:', response.status);
      const result = await this.handleResponse(response);
      console.log('API: Login result:', result);
      
      // Handle backend response structure
      const token = result.data?.token || result.token;
      const user = result.data?.user || result.user;
      
      if (token) {
        this.token = token;
        localStorage.setItem('wellness_token', token);
      }
      
      return { token, user };
    } catch (error) {
      console.error('API: Login error details:', {
        message: error.message,
        type: error.name,
        stack: error.stack
      });
      if (error.message.includes('Failed to fetch')) {
        console.error('API: Network error - backend may be down or CORS issue');
      }
      throw error;
    }
  }

  async register(name, email, password) {
    console.log('API: Making register request to:', `${API_BASE_URL}/auth/register`);
    console.log('API: Register data:', { name, email, password: '***' });
    
    try {
      console.log('API: About to make fetch request...');
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      console.log('API: Fetch completed, response received');
      
      console.log('API: Register response status:', response.status);
      const result = await this.handleResponse(response);
      console.log('API: Register result:', result);
      
      // Handle backend response structure
      const token = result.data?.token || result.token;
      const user = result.data?.user || result.user;
      
      if (token) {
        this.token = token;
        localStorage.setItem('wellness_token', token);
      }
      
      return { token, user };
    } catch (error) {
      console.error('API: Register error details:', {
        message: error.message,
        type: error.name,
        stack: error.stack
      });
      if (error.message.includes('Failed to fetch')) {
        console.error('API: Network error - backend may be down or CORS issue');
      }
      throw error;
    }
  }

  async logout() {
    this.token = null;
    localStorage.removeItem('wellness_token');
    // Optionally call backend logout endpoint
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
    } catch (error) {
      console.warn('Logout request failed:', error);
    }
  }

  // User APIs
  async getCurrentUser() {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse(response);
    
    // Handle backend response structure
    return result.data?.user || result.user || result;
  }

  async updateUserProfile(userData) {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(userData),
    });
    return this.handleResponse(response);
  }

  // Habits APIs
  async getHabits() {
    console.log('API: Getting habits...');
    const response = await fetch(`${API_BASE_URL}/habits`, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse(response);
    console.log('API: Habits response:', result);
    const habits = result.data?.habits || [];
    console.log('API: Extracted habits:', habits);
    return habits;
  }

  async createHabit(habitData) {
    const response = await fetch(`${API_BASE_URL}/habits`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(habitData),
    });
    const result = await this.handleResponse(response);
    return result.data?.habit || result.data;
  }

  async updateHabit(habitId, habitData) {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(habitData),
    });
    return this.handleResponse(response);
  }

  async deleteHabit(habitId) {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async updateHabitProgress(habitId, completed) {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}/progress`, {
      method: 'PATCH',
      headers: this.getHeaders(),
      body: JSON.stringify({ completed }),
    });
    return this.handleResponse(response);
  }

  async completeHabit(habitId) {
    const response = await fetch(`${API_BASE_URL}/habits/${habitId}/complete`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Mood APIs
  async getMoodEntries(limit = 30) {
    console.log('API: Getting mood entries...');
    const response = await fetch(`${API_BASE_URL}/mood?limit=${limit}`, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse(response);
    console.log('API: Mood response:', result);
    const entries = result.data?.moodEntries || result.data?.entries || [];
    console.log('API: Extracted mood entries:', entries);
    return entries;
  }

  async createMoodEntry(moodData) {
    const response = await fetch(`${API_BASE_URL}/mood`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(moodData),
    });
    return this.handleResponse(response);
  }

  async updateMoodEntry(moodId, moodData) {
    const response = await fetch(`${API_BASE_URL}/mood/${moodId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(moodData),
    });
    return this.handleResponse(response);
  }

  async deleteMoodEntry(moodId) {
    const response = await fetch(`${API_BASE_URL}/mood/${moodId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Journal APIs
  async getJournalEntries(limit = 20) {
    console.log('API: Getting journal entries...');
    const response = await fetch(`${API_BASE_URL}/journal?limit=${limit}`, {
      headers: this.getHeaders(),
    });
    const result = await this.handleResponse(response);
    console.log('API: Journal response:', result);
    const entries = result.data?.journalEntries || result.data?.entries || [];
    console.log('API: Extracted journal entries:', entries);
    return entries;
  }

  async createJournalEntry(journalData) {
    const response = await fetch(`${API_BASE_URL}/journal`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(journalData),
    });
    return this.handleResponse(response);
  }

  async updateJournalEntry(journalId, journalData) {
    const response = await fetch(`${API_BASE_URL}/journal/${journalId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(journalData),
    });
    return this.handleResponse(response);
  }

  async deleteJournalEntry(journalId) {
    const response = await fetch(`${API_BASE_URL}/journal/${journalId}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Analytics APIs
  async getAnalytics(period = '7d') {
    const response = await fetch(`${API_BASE_URL}/analytics?period=${period}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getHabitAnalytics(habitId, period = '30d') {
    const response = await fetch(`${API_BASE_URL}/analytics/habits/${habitId}?period=${period}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getMoodAnalytics(period = '30d') {
    const response = await fetch(`${API_BASE_URL}/analytics/mood?period=${period}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async getInsights() {
    const response = await fetch(`${API_BASE_URL}/analytics/insights`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/../health`);
    return this.handleResponse(response);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;
