import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';

const Modal = ({
  isOpen = false,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  overlayClassName,
  contentClassName,
  ...props
}) => {
  useEffect(() => {
    if (closeOnEscape && isOpen) {
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, closeOnEscape]);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  const sizeClasses = {
    xs: 'max-w-sm',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full mx-4'
  };
  
  const overlayClasses = twMerge(
    'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
    overlayClassName
  );
  
  const contentClasses = twMerge(
    'bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden',
    sizeClasses[size],
    contentClassName
  );
  
  const handleBackdropClick = (e) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  const modalContent = (
    <div className={overlayClasses} onClick={handleBackdropClick}>
      <div className={contentClassName} {...props}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            {title && (
              <h2 className="text-xl font-semibold text-gray-900">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
  
  return createPortal(modalContent, document.body);
};

// Modal Components
export const ModalHeader = ({ children, className, ...props }) => (
  <div className={twMerge('p-6 border-b border-gray-200', className)} {...props}>
    {children}
  </div>
);

export const ModalBody = ({ children, className, ...props }) => (
  <div className={twMerge('p-6 overflow-y-auto', className)} {...props}>
    {children}
  </div>
);

export const ModalFooter = ({ children, className, ...props }) => (
  <div className={twMerge('p-6 border-t border-gray-200 bg-gray-50', className)} {...props}>
    {children}
  </div>
);

export const ModalTitle = ({ children, className, ...props }) => (
  <h2 className={twMerge('text-xl font-semibold text-gray-900', className)} {...props}>
    {children}
  </h2>
);

export const ModalDescription = ({ children, className, ...props }) => (
  <p className={twMerge('text-sm text-gray-600 mt-1', className)} {...props}>
    {children}
  </p>
);

export default Modal;
