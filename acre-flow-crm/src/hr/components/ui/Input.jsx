import React, { forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';

const Input = forwardRef(({
  type = 'text',
  label,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  icon,
  iconPosition = 'left',
  className,
  containerClassName,
  ...props
}, ref) => {
  const baseClasses = 'block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed';
  
  const errorClasses = error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : '';
  
  const iconPaddingClasses = {
    left: icon ? 'pl-10' : '',
    right: icon ? 'pr-10' : ''
  };
  
  const classes = twMerge(
    baseClasses,
    errorClasses,
    iconPaddingClasses[iconPosition],
    className
  );
  
  const containerClasses = twMerge('relative', containerClassName);
  
  const iconClasses = twMerge(
    'absolute top-1/2 transform -translate-y-1/2 text-gray-400',
    iconPosition === 'left' ? 'left-3' : 'right-3',
    disabled && 'text-gray-300'
  );
  
  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <span className={iconClasses}>{icon}</span>;
    }
    
    return React.cloneElement(icon, {
      className: twMerge(icon.props?.className, 'w-5 h-5')
    });
  };
  
  return (
    <div className={containerClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && renderIcon()}
        
        <input
          type={type}
          ref={ref}
          placeholder={placeholder}
          disabled={disabled}
          className={classes}
          {...props}
        />
      </div>
      
      {(error || helperText) && (
        <p className={`mt-1 text-sm ${error ? 'text-red-600' : 'text-gray-500'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
