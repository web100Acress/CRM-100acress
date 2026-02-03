export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  HR_EXECUTIVE: 'hr_executive',
  DEPARTMENT_HEAD: 'department_head',
  TEAM_LEAD: 'team_lead',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
};

export const ROLE_DISPLAY_NAMES = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.HR_MANAGER]: 'HR Manager',
  [ROLES.HR_EXECUTIVE]: 'HR Executive',
  [ROLES.DEPARTMENT_HEAD]: 'Department Head',
  [ROLES.TEAM_LEAD]: 'Team Lead',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.EMPLOYEE]: 'Employee'
};

export default {
  ROLES,
  ROLE_DISPLAY_NAMES
};
