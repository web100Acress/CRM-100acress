import api100acress from "../../../../admin/config/api100acressClient";

export const onboardingService = {
  fetchList: async () => {
    const res = await api100acress.get(`/api/hr/onboarding`);
    return res?.data?.data || [];
  },

  advance: async (id) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/advance`);
  },

  setJoining: async (id, joiningDate) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/joining`, { joiningDate });
  },

  inviteStage: async (id, payload) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/invite`, payload);
  },

  completeStage: async (id, stage, feedback) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/complete-stage`, { stage, feedback });
  },

  sendDocsInvite: async (id, uploadLink, content) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/docs-invite`, { uploadLink, content });
  },

  recordDocument: async (id, docType, url) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/docs`, { docType, url });
  },

  generateUploadLink: async (onboardingId) => {
    const res = await api100acress.post(`/api/hr-onboarding/internal/generate-link/${onboardingId}`, { expiresInHours: 48 });
    return res?.data?.link;
  },

  docsComplete: async (id, body) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/docs-complete`, body);
  },

  docsSubmit: async (id, formData) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/docs-submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  rejectStage: async (id, stage, reason) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/reject-stage`, { stage, reason });
  },

  reset: async (id, stage, reason) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/reset`, { stage, reason });
  },
};