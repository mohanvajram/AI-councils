import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

export const saveApiKeys = (userIdentifier, keys) =>
  api.post('/api/keys', { user_identifier: userIdentifier, ...keys });

export const getApiKeys = (userIdentifier) =>
  api.get(`/api/keys/${userIdentifier}`);

export const runDiscussion = (payload) =>
  api.post('/api/discussions', payload);

export const listSessions = () =>
  api.get('/api/discussions');

export const getSession = (sessionId) =>
  api.get(`/api/discussions/${sessionId}`);

export default api;
