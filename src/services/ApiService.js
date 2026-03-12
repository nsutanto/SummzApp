import auth from '@react-native-firebase/auth';

const BASE_URL = 'https://summz-backend-api-rejjms7xxq-uc.a.run.app';

const getAuthHeaders = async () => {
  const currentUser = auth().currentUser;
  if (!currentUser) {
    return { 'Content-Type': 'application/json' };
  }
  const token = await currentUser.getIdToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

const request = async (method, path, body) => {
  const url = `${BASE_URL}${path}`;
  const headers = await getAuthHeaders();
  const options = { method, headers };
  if (body !== undefined) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(url, options);
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.error || 'Request failed');
  }
  return json.data;
};

const buildQuery = (params) => {
  if (!params) return '';
  const qs = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');
  return qs ? `?${qs}` : '';
};

export const ApiService = {
  // BOOKS (public)
  getCategories: () => request('GET', '/categories'),
  getBooks: (params) => request('GET', `/books${buildQuery(params)}`),
  getBook: (bookId) => request('GET', `/books/${bookId}`),
  getBookSummaries: (bookId) => request('GET', `/books/${bookId}/summaries`),
  getSummaryChapter: (bookId, chapterId) => request('GET', `/books/${bookId}/summaries/${chapterId}`),

  // AUTH (protected)
  syncUser: (email, displayName) => request('POST', '/auth/sync', { email, displayName }),

  // LIBRARY (protected)
  getLibrary: () => request('GET', '/user/library'),
  addToLibrary: (bookId) => request('POST', '/user/library', { bookId }),
  removeFromLibrary: (bookId) => request('DELETE', `/user/library/${bookId}`),

  // PROGRESS (protected)
  getProgress: (bookId) => request('GET', `/user/progress/${bookId}`),
  updateProgress: (payload) => request('POST', '/user/progress', payload),
};
