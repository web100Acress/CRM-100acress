import React from 'react';
import { twMerge } from 'tailwind-merge';

const Loader = ({
  size = 'md',
  color = 'blue',
  text,
  className,
  overlay = false,
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };
  
  const colorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    purple: 'text-purple-600',
    gray: 'text-gray-600',
    white: 'text-white'
  };
  
  const loaderClasses = twMerge(
    'animate-spin rounded-full border-2 border-current border-t-transparent',
    sizeClasses[size],
    colorClasses[color],
    className
  );
  
  const containerClasses = twMerge(
    'flex flex-col items-center justify-center',
    overlay && 'fixed inset-0 bg-black bg-opacity-50 z-50',
    className
  );
  
  return (
    <div className={containerClasses} {...props}>
      <div className={loaderClasses}>
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      </div>
      
      {text && (
        <span className={`mt-2 text-sm ${colorClasses[color]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

// Loading variants
export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader size="lg" text={text} />
  </div>
);

export const ButtonLoader = ({ size = 'sm' }) => (
  <Loader size={size} />
);

export const TableLoader = () => (
  <div className="flex items-center justify-center p-8">
    <Loader size="md" text="Loading data..." />
  </div>
);

export const CardLoader = () => (
  <div className="flex items-center justify-center p-8 border border-gray-200 rounded-lg">
    <Loader size="md" text="Loading..." />
  </div>
);

export default Loader;
