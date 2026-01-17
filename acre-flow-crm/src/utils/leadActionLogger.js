/**
 * Lead Action Logger - Comprehensive logging and debugging for Lead Actions
 * Provides detailed tracking for Forward, Swap, and Switch operations
 */

// Log levels
const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

// Current log level (can be adjusted based on environment)
const CURRENT_LOG_LEVEL = process.env.NODE_ENV === 'development' ? LOG_LEVELS.DEBUG : LOG_LEVELS.INFO;

/**
 * Color-coded console logging
 */
const colors = {
  debug: '#6B7280',    // Gray
  info: '#3B82F6',     // Blue  
  warn: '#F59E0B',     // Yellow
  error: '#EF4444',    // Red
  success: '#10B981'   // Green
};

/**
 * Format timestamp for logging
 */
const formatTimestamp = () => {
  const now = new Date();
  return now.toISOString();
};

/**
 * Core logging function
 */
const log = (level, message, data = null, color = colors.debug) => {
  if (level < CURRENT_LOG_LEVEL) return;

  const timestamp = formatTimestamp();
  const prefix = `%c[${timestamp}] LEAD-ACTION:`;
  
  switch (level) {
    case LOG_LEVELS.DEBUG:
      console.debug(prefix, `color: ${color}`, message, data || '');
      break;
    case LOG_LEVELS.INFO:
      console.info(prefix, `color: ${color}`, message, data || '');
      break;
    case LOG_LEVELS.WARN:
      console.warn(prefix, `color: ${color}`, message, data || '');
      break;
    case LOG_LEVELS.ERROR:
      console.error(prefix, `color: ${color}`, message, data || '');
      break;
  }
};

/**
 * Action-specific logging functions
 */
export const ActionLogger = {
  /**
   * Debug level logging
   */
  debug: (message, data) => {
    log(LOG_LEVELS.DEBUG, message, data, colors.debug);
  },

  /**
   * Info level logging
   */
  info: (message, data) => {
    log(LOG_LEVELS.INFO, message, data, colors.info);
  },

  /**
   * Warning level logging
   */
  warn: (message, data) => {
    log(LOG_LEVELS.WARN, message, data, colors.warn);
  },

  /**
   * Error level logging
   */
  error: (message, data) => {
    log(LOG_LEVELS.ERROR, message, data, colors.error);
  },

  /**
   * Success logging (info level with green color)
   */
  success: (message, data) => {
    log(LOG_LEVELS.INFO, message, data, colors.success);
  }
};

/**
 * Log action initiation
 */
export const logActionStart = (action, lead, user, targetData = null) => {
  ActionLogger.info(`🚀 ${action.toUpperCase()} ACTION STARTED`, {
    action,
    timestamp: new Date().toISOString(),
    user: {
      id: user?.userId,
      role: user?.role,
      name: user?.userName
    },
    lead: {
      id: lead?._id,
      name: lead?.name,
      currentAssignedTo: lead?.assignedTo,
      status: lead?.status,
      assignmentChainLength: lead?.assignmentChain?.length || 0
    },
    targetData
  });
};

/**
 * Log action completion
 */
export const logActionComplete = (action, result, duration = null) => {
  ActionLogger.success(`✅ ${action.toUpperCase()} ACTION COMPLETED`, {
    action,
    result,
    duration: duration ? `${duration}ms` : null,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log action failure
 */
export const logActionError = (action, error, context = {}) => {
  ActionLogger.error(`❌ ${action.toUpperCase()} ACTION FAILED`, {
    action,
    error: {
      message: error.message,
      stack: error.stack,
      name: error.name
    },
    context,
    timestamp: new Date().toISOString()
  });
};

/**
 * Log permission validation
 */
export const logPermissionCheck = (action, lead, user, validation) => {
  const level = validation.canProceed || validation.canForward || validation.canSwap || validation.canSwitch 
    ? 'info' 
    : 'warn';

  ActionLogger[level](`🔍 ${action.toUpperCase()} PERMISSION CHECK`, {
    action,
    user: { id: user?.userId, role: user?.role },
    lead: { id: lead?._id, name: lead?.name, assignedTo: lead?.assignedTo },
    validation,
    permitted: validation.canProceed || validation.canForward || validation.canSwap || validation.canSwitch,
    reason: validation.reason
  });
};

/**
 * Log API request/response
 */
export const logApiCall = async (method, url, requestBody, response) => {
  const startTime = Date.now();
  
  ActionLogger.debug(`📡 API CALL: ${method} ${url}`, {
    method,
    url,
    requestBody,
    timestamp: new Date().toISOString()
  });

  try {
    const responseData = await response.clone().json();
    const duration = Date.now() - startTime;
    
    ActionLogger.debug(`📡 API RESPONSE: ${response.status}`, {
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      responseData,
      timestamp: new Date().toISOString()
    });

    return { responseData, duration };
  } catch (error) {
    const duration = Date.now() - startTime;
    
    ActionLogger.error(`📡 API RESPONSE ERROR`, {
      status: response.status,
      statusText: response.statusText,
      duration: `${duration}ms`,
      error: error.message,
      timestamp: new Date().toISOString()
    });
    
    return { error, duration };
  }
};

/**
 * Log assignment chain changes
 */
export const logAssignmentChainChange = (action, lead, oldChain, newChain) => {
  ActionLogger.info(`🔗 ASSIGNMENT CHAIN UPDATED`, {
    action,
    leadId: lead?._id,
    leadName: lead?.name,
    oldChainLength: oldChain?.length || 0,
    newChainLength: newChain?.length || 0,
    oldChain: oldChain?.map(entry => ({
      user: entry.name,
      role: entry.role,
      status: entry.status,
      assignedAt: entry.assignedAt
    })),
    newChain: newChain?.map(entry => ({
      user: entry.name,
      role: entry.role,
      status: entry.status,
      assignedAt: entry.assignedAt
    })),
    timestamp: new Date().toISOString()
  });
};

/**
 * Performance monitoring
 */
export const PerformanceMonitor = {
  timers: new Map(),

  start: (label) => {
    PerformanceMonitor.timers.set(label, Date.now());
    ActionLogger.debug(`⏱️ Performance timer started: ${label}`);
  },

  end: (label) => {
    const startTime = PerformanceMonitor.timers.get(label);
    if (startTime) {
      const duration = Date.now() - startTime;
      PerformanceMonitor.timers.delete(label);
      
      ActionLogger.debug(`⏱️ Performance timer ended: ${label} (${duration}ms)`);
      return duration;
    }
    return null;
  },

  measureAsync: async (label, asyncFn) => {
    PerformanceMonitor.start(label);
    try {
      const result = await asyncFn();
      const duration = PerformanceMonitor.end(label);
      ActionLogger.debug(`⏱️ Async operation completed: ${label} (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = PerformanceMonitor.end(label);
      ActionLogger.error(`⏱️ Async operation failed: ${label} (${duration}ms)`, error);
      throw error;
    }
  }
};

/**
 * Action audit trail
 */
class ActionAuditTrail {
  constructor() {
    this.trail = [];
    this.maxTrailLength = 100;
  }

  addEntry(action, lead, user, result, error = null) {
    const entry = {
      id: `${action}-${lead?._id}-${Date.now()}`,
      action,
      lead: { id: lead?._id, name: lead?.name },
      user: { id: user?.userId, name: user?.userName, role: user?.role },
      result: error ? null : result,
      error: error?.message,
      timestamp: new Date().toISOString(),
      success: !error
    };

    this.trail.unshift(entry);
    
    // Keep trail size manageable
    if (this.trail.length > this.maxTrailLength) {
      this.trail = this.trail.slice(0, this.maxTrailLength);
    }

    ActionLogger.info(`📝 AUDIT ENTRY ADDED`, entry);
  }

  getTrail(limit = 20) {
    return this.trail.slice(0, limit);
  }

  getTrailForAction(action) {
    return this.trail.filter(entry => entry.action === action);
  }

  getTrailForUser(userId) {
    return this.trail.filter(entry => entry.user.id === userId);
  }

  getTrailForLead(leadId) {
    return this.trail.filter(entry => entry.lead.id === leadId);
  }

  clear() {
    this.trail = [];
    ActionLogger.info('📝 AUDIT TRAIL CLEARED');
  }
}

export const auditTrail = new ActionAuditTrail();

/**
 * Development helper - expose logs to window for debugging
 */
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  window.LeadActionLogger = ActionLogger;
  window.LeadActionAuditTrail = auditTrail;
  window.LeadActionPerformance = PerformanceMonitor;
  
  ActionLogger.info('🔧 Lead Action Logger exposed to window for debugging');
}

export default ActionLogger;
