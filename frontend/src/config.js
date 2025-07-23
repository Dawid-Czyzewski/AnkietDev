export const API_BASE = 'https://satoshidc.cfolks.pl/api';

export const ENDPOINTS = {
  REGISTER: `${API_BASE}/?controller=register&action=register`,
  LOGIN:    `${API_BASE}/?controller=login&action=login`,
  LOGOUT:   `${API_BASE}/?controller=logout&action=logout`,
};

export const SURVEY_ENDPOINTS = {
  LIST:   `${API_BASE}/?controller=survey&action=list`,
  CREATE: `${API_BASE}/?controller=survey&action=create`,
  UPDATE: `${API_BASE}/?controller=survey&action=update`,
  DELETE: `${API_BASE}/?controller=survey&action=delete`,
  SUBMIT: `${API_BASE}/?controller=survey&action=submit`,
  GET: `${API_BASE}/?controller=survey&action=get`,
};
