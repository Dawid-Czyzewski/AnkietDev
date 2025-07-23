const STORAGE_KEY = 'local_surveys';

function loadSurveys() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load local surveys:', e);
    return [];
  }
}

function saveSurveys(surveys) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
  } catch (e) {
    console.error('Failed to save local surveys:', e);
  }
}

export const localSurveyService = {
  getAll: () => {
    return loadSurveys();
  },

  add: (survey) => {
    const surveys = loadSurveys();
    const newSurvey = {
      ...survey,
      id: 'local-' + Date.now(),
      createdDate: new Date().toISOString(),
    };
    surveys.unshift(newSurvey);
    saveSurveys(surveys);
    return newSurvey;
  },

  remove: (id) => {
    const surveys = loadSurveys().filter(s => s.id !== id);
    saveSurveys(surveys);
  },

  getById: (id) => {
    return loadSurveys().find(s => s.id === id);
  },
};
