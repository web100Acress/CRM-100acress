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
    const res = await api100acress.post(`/api/hr/onboarding/${id}/docs-invite`, { uploadLink, content });
    return res; // Return full response so frontend can check for warnings
  },

  recordDocument: async (id, docType, url) => {
    return await api100acress.post(`/career/onboarding/${id}/docs`, { docType, url });
  },

  generateUploadLink: async (onboardingId) => {
    const res = await api100acress.post(`/career/generate-upload-link`, { onboardingId, expiresInHours: 48 });
    // Return both token and uploadLink for flexibility
    return {
      token: res?.data?.data?.token,
      uploadLink: res?.data?.data?.uploadLink,
      expiresAt: res?.data?.data?.expiresAt,
      candidateInfo: res?.data?.data?.candidateInfo
    };
  },

  docsComplete: async (id, body) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/docs-complete`, body);
  },

  docsSubmit: async (id, formData) => {
    // This endpoint is no longer needed - document upload is handled via token-based flow
    // Use generateUploadLink and upload to /career/upload-documents/:token instead
    throw new Error('docsSubmit is deprecated. Use generateUploadLink and token-based upload flow.');
  },

  rejectStage: async (id, stage, reason) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/reject-stage`, { stage, reason });
  },

  reset: async (id, stage, reason) => {
    return await api100acress.post(`/api/hr/onboarding/${id}/reset`, { stage, reason });
  },

  createManual: async (employeeData) => {
    const res = await api100acress.post(`/api/hr/onboarding/create`, employeeData);
    return res?.data?.data;
  },

  deleteOnboarding: async (id) => {
    const res = await api100acress.delete(`/api/hr/onboarding/${id}`);
    return res?.data;
  },
};