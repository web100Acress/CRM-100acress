import React from 'react';
import { twMerge } from 'tailwind-merge';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionText,
  onAction,
  size = 'md',
  className,
  ...props
}) => {
  const sizeClasses = {
    sm: 'p-4',
    md: 'p-8',
    lg: 'p-12'
  };
  
  const iconSizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };
  
  const titleSizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl'
  };
  
  const descriptionSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };
  
  const containerClasses = twMerge(
    'flex flex-col items-center justify-center text-center',
    sizeClasses[size],
    className
  );
  
  const iconClasses = twMerge(
    'text-gray-400 mb-4',
    iconSizeClasses[size]
  );
  
  const titleClasses = twMerge(
    'font-medium text-gray-900 mb-2',
    titleSizeClasses[size]
  );
  
  const descriptionClasses = twMerge(
    'text-gray-500 mb-6 max-w-sm',
    descriptionSizeClasses[size]
  );
  
  const renderIcon = () => {
    if (!icon) {
      // Default empty state icon
      return (
        <svg
          className={iconClasses}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      );
    }
    
    if (typeof icon === 'string') {
      return <span className={iconClasses}>{icon}</span>;
    }
    
    return React.cloneElement(icon, {
      className: twMerge(icon.props?.className, iconClasses)
    });
  };
  
  return (
    <div className={containerClasses} {...props}>
      {renderIcon()}
      
      <h3 className={titleClasses}>{title}</h3>
      
      <p className={descriptionClasses}>{description}</p>
      
      {action && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {actionText || action}
        </button>
      )}
    </div>
  );
};

// Predefined empty states
export const NoData = ({ onRefresh, ...props }) => (
  <EmptyState
    title="No data available"
    description="There are no items to display at the moment."
    action={onRefresh}
    actionText="Refresh"
    {...props}
  />
);

export const NoResults = ({ onClearFilters, ...props }) => (
  <EmptyState
    title="No results found"
    description="Try adjusting your search or filter criteria."
    action={onClearFilters}
    actionText="Clear filters"
    {...props}
  />
);

export const NoEmployees = ({ onAddEmployee, ...props }) => (
  <EmptyState
    title="No employees found"
    description="Get started by adding your first employee to the system."
    action={onAddEmployee}
    actionText="Add Employee"
    {...props}
  />
);

export const NoAttendance = ({ onMarkAttendance, ...props }) => (
  <EmptyState
    title="No attendance records"
    description="Start marking attendance for your employees."
    action={onMarkAttendance}
    actionText="Mark Attendance"
    {...props}
  />
);

export const NoLeaveRequests = ({ onRequestLeave, ...props }) => (
  <EmptyState
    title="No leave requests"
    description="No leave requests have been submitted yet."
    action={onRequestLeave}
    actionText="Request Leave"
    {...props}
  />
);

export const NoPayrollRecords = ({ onGeneratePayroll, ...props }) => (
  <EmptyState
    title="No payroll records"
    description="Generate payroll for your employees."
    action={onGeneratePayroll}
    actionText="Generate Payroll"
    {...props}
  />
);

export const NoJobPostings = ({ onCreateJob, ...props }) => (
  <EmptyState
    title="No job postings"
    description="Create your first job posting to start recruiting."
    action={onCreateJob}
    actionText="Create Job Posting"
    {...props}
  />
);

export const NoCandidates = ({ onPostJob, ...props }) => (
  <EmptyState
    title="No candidates found"
    description="Post a job to attract candidates."
    action={onPostJob}
    actionText="Post Job"
    {...props}
  />
);

export const NoPerformanceReviews = ({ onCreateReview, ...props }) => (
  <EmptyState
    title="No performance reviews"
    description="Start conducting performance reviews for your team."
    action={onCreateReview}
    actionText="Create Review"
    {...props}
  />
);

export const ErrorState = ({ error, onRetry, ...props }) => (
  <EmptyState
    icon={
      <svg
        className="w-12 h-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    }
    title="Something went wrong"
    description={error || "An error occurred while loading the data."}
    action={onRetry}
    actionText="Try again"
    {...props}
  />
);

export const NetworkError = ({ onRetry, ...props }) => (
  <EmptyState
    icon={
      <svg
        className="w-12 h-12 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
        />
      </svg>
    }
    title="Network error"
    description="Unable to connect to the server. Please check your internet connection."
    action={onRetry}
    actionText="Retry"
    {...props}
  />
);

export default EmptyState;
