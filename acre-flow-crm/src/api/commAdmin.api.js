import { http } from './http.js';
import { ENDPOINTS } from './endpoints.js';

export const fetchCommFeatureFlags = async () => {
  const response = await http.get(ENDPOINTS.COMM_ADMIN.FEATURE_FLAGS);
  return response;
};

export const updateCommFeatureFlags = async (patch = {}) => {
  const response = await http.put(ENDPOINTS.COMM_ADMIN.FEATURE_FLAGS, patch);
  return response;
};

export const fetchProviders = async () => {
  const response = await http.get(ENDPOINTS.COMM_ADMIN.PROVIDERS);
  return response;
};

export const upsertProvider = async (payload = {}) => {
  const response = await http.put(ENDPOINTS.COMM_ADMIN.PROVIDERS, payload);
  return response;
};

export const commAdminApi = {
  fetchFeatureFlags: fetchCommFeatureFlags,
  updateFeatureFlags: updateCommFeatureFlags,
  fetchProviders,
  upsertProvider,
};
