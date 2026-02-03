export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated',
  PROBATION: 'probation'
};

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  HALF_DAY: 'half_day',
  ON_LEAVE: 'on_leave'
};

export const LEAVE_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled'
};

export const LEAVE_TYPES = {
  SICK_LEAVE: 'sick_leave',
  CASUAL_LEAVE: 'casual_leave',
  ANNUAL_LEAVE: 'annual_leave',
  MATERNITY_LEAVE: 'maternity_leave',
  PATERNITY_LEAVE: 'paternity_leave',
  UNPAID_LEAVE: 'unpaid_leave'
};

export const PAYROLL_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PROCESSED: 'processed',
  PAID: 'paid',
  FAILED: 'failed'
};

export const RECRUITMENT_STATUS = {
  OPEN: 'open',
  CLOSED: 'closed',
  ON_HOLD: 'on_hold',
  CANCELLED: 'cancelled'
};

export const CANDIDATE_STATUS = {
  APPLIED: 'applied',
  SCREENING: 'screening',
  SHORTLISTED: 'shortlisted',
  INTERVIEW_SCHEDULED: 'interview_scheduled',
  INTERVIEWED: 'interviewed',
  OFFERED: 'offered',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  HIRED: 'hired'
};

export const PERFORMANCE_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  APPROVED: 'approved',
  REJECTED: 'rejected'
};

export const STATUS_COLORS = {
  [EMPLOYEE_STATUS.ACTIVE]: 'bg-green-100 text-green-800',
  [EMPLOYEE_STATUS.INACTIVE]: 'bg-gray-100 text-gray-800',
  [EMPLOYEE_STATUS.ON_LEAVE]: 'bg-yellow-100 text-yellow-800',
  [EMPLOYEE_STATUS.TERMINATED]: 'bg-red-100 text-red-800',
  [EMPLOYEE_STATUS.PROBATION]: 'bg-blue-100 text-blue-800',
  
  [ATTENDANCE_STATUS.PRESENT]: 'bg-green-100 text-green-800',
  [ATTENDANCE_STATUS.ABSENT]: 'bg-red-100 text-red-800',
  [ATTENDANCE_STATUS.LATE]: 'bg-yellow-100 text-yellow-800',
  [ATTENDANCE_STATUS.HALF_DAY]: 'bg-orange-100 text-orange-800',
  [ATTENDANCE_STATUS.ON_LEAVE]: 'bg-blue-100 text-blue-800',
  
  [LEAVE_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [LEAVE_STATUS.APPROVED]: 'bg-green-100 text-green-800',
  [LEAVE_STATUS.REJECTED]: 'bg-red-100 text-red-800',
  [LEAVE_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800',
  
  [PAYROLL_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [PAYROLL_STATUS.APPROVED]: 'bg-blue-100 text-blue-800',
  [PAYROLL_STATUS.PROCESSED]: 'bg-purple-100 text-purple-800',
  [PAYROLL_STATUS.PAID]: 'bg-green-100 text-green-800',
  [PAYROLL_STATUS.FAILED]: 'bg-red-100 text-red-800'
};

export default {
  EMPLOYEE_STATUS,
  ATTENDANCE_STATUS,
  LEAVE_STATUS,
  LEAVE_TYPES,
  PAYROLL_STATUS,
  RECRUITMENT_STATUS,
  CANDIDATE_STATUS,
  PERFORMANCE_STATUS,
  STATUS_COLORS
};
