// Site Visit Data Models and Constants

export const SITE_VISIT_STATUS = {
  PLANNED: 'Planned',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  NO_SHOW: 'No-Show'
};

export const VISIT_TYPE = {
  ONSITE: 'Onsite',
  VIRTUAL: 'Virtual'
};

export const INTEREST_LEVEL = {
  HOT: 'Hot',
  WARM: 'Warm',
  COLD: 'Cold'
};

export const SITE_VISIT_PERMISSIONS = {
  BOSS: 'all', // All visits
  HOD: 'team', // Team visits
  TEAM_LEADER: 'assigned_team', // Assigned team visits
  BD: 'own', // Only own visits
  EMPLOYEE: 'own' // Only own visits
};

// Site Visit Schema (for reference)
export const SITE_VISIT_SCHEMA = {
  _id: 'string',
  leadId: 'string',
  projectId: 'string',
  unitId: 'string', // optional
  
  scheduledDate: 'Date',
  scheduledTime: 'string',
  visitType: ['Onsite', 'Virtual'],
  
  assignedAgentId: 'string',
  assignedBy: 'string', // HOD / TL
  
  status: ['Planned', 'Completed', 'Cancelled', 'No-Show'],
  
  clientConfirmation: 'boolean',
  agentConfirmation: 'boolean',
  
  feedback: {
    interestLevel: ['Hot', 'Warm', 'Cold'],
    budgetMatch: 'boolean',
    remarks: 'string',
    preferredUnit: 'string',
    objectionReason: 'string'
  },
  
  nextAction: {
    followUpDate: 'Date',
    followUpNote: 'string'
  },
  
  createdAt: 'Date',
  updatedAt: 'Date',
  
  // Audit fields
  createdBy: 'string',
  updatedBy: 'string',
  
  // Additional fields for tracking
  rescheduleCount: 'number',
  lastReminderSent: 'Date',
  clientNotified: 'boolean',
  agentNotified: 'boolean',
  
  // Location details for onsite visits
  location: {
    address: 'string',
    coordinates: {
      lat: 'number',
      lng: 'number'
    },
    googleMapsLink: 'string'
  },
  
  // Virtual visit details
  virtualMeeting: {
    platform: 'string', // Zoom, Google Meet, etc.
    meetingLink: 'string',
    meetingId: 'string',
    password: 'string'
  }
};

// Lead Status Update Rules based on Site Visit
export const LEAD_STATUS_RULES = {
  'Site Visit Scheduled': 'Site Visit Planned',
  'Visit Completed': 'Site Visit Done',
  'Hot Feedback': 'Negotiation',
  'No-show (2 times)': 'Lead Cold'
};

// Reminder Timeline
export const REMINDER_TIMELINE = {
  T_24_HOURS: '24 hours before',
  T_2_HOURS: '2 hours before',
  T_1_HOUR_AFTER: '1 hour after',
  FEEDBACK_REMINDER: 'Feedback reminder'
};

// Dashboard Metrics
export const DASHBOARD_METRICS = {
  VISITS_SCHEDULED: 'visitsScheduled',
  COMPLETED_PERCENTAGE: 'completedPercentage',
  NO_SHOW_PERCENTAGE: 'noShowPercentage',
  VISIT_TO_BOOKING_PERCENTAGE: 'visitToBookingPercentage',
  AGENT_PERFORMANCE: 'agentPerformance'
};

// Validation Rules
export const VALIDATION_RULES = {
  scheduledDate: {
    required: true,
    futureDate: true
  },
  scheduledTime: {
    required: true,
    businessHours: true // 9 AM - 7 PM
  },
  assignedAgentId: {
    required: true
  },
  feedback: {
    requiredWhen: ['Completed'],
    fields: {
      interestLevel: { required: true },
      budgetMatch: { required: true },
      remarks: { required: false }
    }
  }
};

// Status Transition Rules
export const STATUS_TRANSITIONS = {
  [SITE_VISIT_STATUS.PLANNED]: [
    SITE_VISIT_STATUS.COMPLETED,
    SITE_VISIT_STATUS.CANCELLED,
    SITE_VISIT_STATUS.NO_SHOW
  ],
  [SITE_VISIT_STATUS.COMPLETED]: [], // No further transitions
  [SITE_VISIT_STATUS.CANCELLED]: [], // No further transitions
  [SITE_VISIT_STATUS.NO_SHOW]: [
    SITE_VISIT_STATUS.PLANNED // Can be rescheduled
  ]
};

export default {
  SITE_VISIT_STATUS,
  VISIT_TYPE,
  INTEREST_LEVEL,
  SITE_VISIT_PERMISSIONS,
  SITE_VISIT_SCHEMA,
  LEAD_STATUS_RULES,
  REMINDER_TIMELINE,
  DASHBOARD_METRICS,
  VALIDATION_RULES,
  STATUS_TRANSITIONS
};
