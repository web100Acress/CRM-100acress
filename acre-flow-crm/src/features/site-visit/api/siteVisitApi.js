import { API_ENDPOINTS } from '@/config/apiConfig';
import { SITE_VISIT_STATUS, VISIT_TYPE, INTEREST_LEVEL } from '@/models/siteVisitModel';

// Site Visit API Service
class SiteVisitApiService {
  // Get all site visits with filters
  static async getSiteVisits(filters = {}) {
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.keys(filters).forEach(key => {
      if (filters[key] !== undefined && filters[key] !== '') {
        queryParams.append(key, filters[key]);
      }
    });

    const response = await fetch(`${API_ENDPOINTS.SITE_VISITS}?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get site visit by ID
  static async getSiteVisitById(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_BY_ID(id), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Create new site visit
  static async createSiteVisit(visitData) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_CREATE, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Update site visit
  static async updateSiteVisit(id, visitData) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_UPDATE(id), {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Delete site visit
  static async deleteSiteVisit(id) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_DELETE(id), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get site visits by lead ID
  static async getSiteVisitsByLead(leadId) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_BY_LEAD(leadId), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get site visits by agent ID
  static async getSiteVisitsByAgent(agentId) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_BY_AGENT(agentId), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get today's site visits
  static async getTodaySiteVisits() {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_TODAY, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get upcoming site visits
  static async getUpcomingSiteVisits() {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_UPCOMING, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Submit feedback for site visit
  static async submitFeedback(id, feedbackData) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_FEEDBACK(id), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Mark site visit as completed
  static async completeSiteVisit(id, completionData = {}) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_COMPLETE(id), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Cancel site visit
  static async cancelSiteVisit(id, cancellationData = {}) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_CANCEL(id), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cancellationData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Reschedule site visit
  static async rescheduleSiteVisit(id, rescheduleData) {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_RESCHEDULE(id), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rescheduleData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Get dashboard metrics
  static async getDashboardMetrics() {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_DASHBOARD, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Send reminders
  static async sendReminders() {
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.SITE_VISITS_REMINDERS, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

export default SiteVisitApiService;
