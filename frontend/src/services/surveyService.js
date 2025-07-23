import { apiService } from './apiService';
import { SURVEY_ENDPOINTS } from '../config';

class SurveyService {
  async list() {
    const data = await apiService.request(SURVEY_ENDPOINTS.LIST, {
      method: 'GET',
      credentials: true,
    });
    return Array.isArray(data) ? data : data.surveys ?? [];
  }

  async create(payload) {
    return apiService.request(SURVEY_ENDPOINTS.CREATE, {
      method: 'POST',
      body: payload,
      credentials: true,
    });
  }

  async get(id) {
    return apiService.request(
      `${SURVEY_ENDPOINTS.GET}`,
      {
        method: 'POST',
         body: { id },
        credentials: true,
      }
    );
  }

  async update(payload) {
    return apiService.request(SURVEY_ENDPOINTS.UPDATE, {
      method: 'POST',
      body: payload,
      credentials: true,
    });
  }

  async submit(payload) {
    return apiService.request(SURVEY_ENDPOINTS.SUBMIT, {
      method: 'POST',
      body: payload,
      credentials: true,
    });
  }

  async delete(id) {
    return apiService.request(SURVEY_ENDPOINTS.DELETE, {
      method: 'POST',
      body: { id },
      credentials: true,
    });
  }
}

export const surveyService = new SurveyService();
