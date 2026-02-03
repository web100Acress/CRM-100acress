import React from 'react';
import { twMerge } from 'tailwind-merge';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  className,
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500',
    info: 'bg-cyan-600 text-white hover:bg-cyan-700 focus:ring-cyan-500',
    light: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-blue-500',
    dark: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-500',
    link: 'text-blue-600 hover:text-blue-800 focus:ring-blue-500',
    ghost: 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 focus:ring-gray-500'
  };
  
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  
  const iconSizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  
  const classes = twMerge(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );
  
  const iconClasses = twMerge(
    iconSizeClasses[size],
    iconPosition === 'left' ? 'mr-2' : 'ml-2',
    loading && 'animate-spin'
  );
  
  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <span className={iconClasses}>{icon}</span>;
    }
    
    return React.cloneElement(icon, {
      className: twMerge(icon.props?.className, iconClasses)
    });
  };
  
  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
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
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
      )}
      
      {!loading && iconPosition === 'left' && renderIcon()}
      
      {children}
      
      {!loading && iconPosition === 'right' && renderIcon()}
    </button>
  );
};

export default Button;
