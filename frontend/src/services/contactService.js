import { API_BASE } from '../config';

class ContactService {
  constructor() {
    this.baseUrl = API_BASE;
    this.endpoint = '/?controller=contact&action=send';
  }

  async sendContactForm({ name, email, message }) {
    try {
      const response = await this.makeRequest({ name, email, message });
      return await this.handleResponse(response);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async makeRequest(data) {
    return fetch(`${this.baseUrl}${this.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await this.parseErrorResponse(response);
      throw new Error(errorData.error || 'Request failed');
    }

    return response.json();
  }

  async parseErrorResponse(response) {
    try {
      return await response.json();
    } catch {
      return { error: 'Unknown error occurred' };
    }
  }

  handleError(error) {
    if (error instanceof Error) {
      return error;
    }
    
    return new Error('An unexpected error occurred');
  }
}

const contactService = new ContactService();

export const sendContactForm = (formData) => contactService.sendContactForm(formData);
export default contactService;
