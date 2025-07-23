import { ENDPOINTS, API_BASE } from '../config';

class ApiService {
  constructor() {
    this.baseUrl = API_BASE;
  }

  async request(endpoint, { method = 'GET', body = null, credentials = false } = {}) {
    const url = endpoint.startsWith('http')
      ? endpoint
      : this.baseUrl + endpoint;

    const config = {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(credentials ? { credentials: 'include' } : {}),
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    let response;
    try {
      response = await fetch(url, config);
    } catch (networkErr) {
      throw { isNetworkError: true, message: networkErr.message };
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
    
    }

    if (!response.ok) {
      const message = data?.error || response.statusText;
      throw { status: response.status, message };
    }

    return data;
  }

  register({ name, email, password }) {
    return this.request(ENDPOINTS.REGISTER, {
      method: 'POST',
      body: { name, email, password },
      credentials: false,
    });
  }

  login({ email, password }) {
    return this.request(ENDPOINTS.LOGIN, {
      method: 'POST',
      body: { email, password },
      credentials: true,
    });
  }

  logout() {
    return this.request(ENDPOINTS.LOGOUT, {
      method: 'POST',
      credentials: true,
    });
  }
}

export const apiService = new ApiService();
