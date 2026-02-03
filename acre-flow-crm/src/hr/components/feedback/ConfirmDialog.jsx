import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import Modal from '../ui/Modal';

const ConfirmDialog = ({
  isOpen = false,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default',
  loading = false,
  className,
  ...props
}) => {
  const [internalLoading, setInternalLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Confirm action failed:', error);
    } finally {
      setInternalLoading(false);
    }
  };

  const getTypeClasses = () => {
    switch (type) {
      case 'danger':
        return {
          icon: 'text-red-600',
          iconBg: 'bg-red-100',
          button: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'warning':
        return {
          icon: 'text-yellow-600',
          iconBg: 'bg-yellow-100',
          button: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      case 'info':
        return {
          icon: 'text-blue-600',
          iconBg: 'bg-blue-100',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
      case 'success':
        return {
          icon: 'text-green-600',
          iconBg: 'bg-green-100',
          button: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
        };
      default:
        return {
          icon: 'text-gray-600',
          iconBg: 'bg-gray-100',
          button: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
    }
  };

  const typeClasses = getTypeClasses();

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'success':
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      showCloseButton={false}
      closeOnBackdropClick={false}
      closeOnEscape={false}
      className={className}
      {...props}
    >
      <div className="sm:flex sm:items-start">
        <div className={twMerge('mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full', typeClasses.iconBg)}>
          <div className={typeClasses.icon}>
            {getIcon()}
          </div>
        </div>
        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          onClick={handleConfirm}
          disabled={loading || internalLoading}
          className={twMerge(
            'w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm',
            typeClasses.button,
            (loading || internalLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {loading || internalLoading ? (
            <div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V8C8 8 8 0 16 8s0 8 8 8z"></path>
              </svg>
              Processing...
            </div>
          ) : (
            confirmText
          )}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={loading || internalLoading}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {cancelText}
        </button>
      </div>
    </Modal>
  );
};

// Hook for confirm dialog
export const useConfirmDialog = () => {
  const [dialog, setDialog] = useState({
    isOpen: false,
    config: {}
  });

  const confirm = (config) => {
    return new Promise((resolve) => {
      setDialog({
        isOpen: true,
        config: {
          ...config,
          onConfirm: () => {
            config.onConfirm?.();
            resolve(true);
          },
          onClose: () => {
            config.onClose?.();
            setDialog({ isOpen: false, config: {} });
            resolve(false);
          }
        }
      });
    });
  };

  const ConfirmDialogComponent = () => (
    <ConfirmDialog
      {...dialog.config}
      isOpen={dialog.isOpen}
      onClose={() => {
        dialog.config.onClose?.();
        setDialog({ isOpen: false, config: {} });
      }}
    />
  );

  return { confirm, ConfirmDialogComponent };
};

// Predefined confirm dialogs
export const DeleteConfirm = ({ isOpen, onClose, onConfirm, itemName = 'item' }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    type="danger"
    title="Delete Item"
    message={`Are you sure you want to delete this ${itemName}? This action cannot be undone.`}
    confirmText="Delete"
    cancelText="Cancel"
  />
);

export const ArchiveConfirm = ({ isOpen, onClose, onConfirm, itemName = 'item' }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    type="warning"
    title="Archive Item"
    message={`Are you sure you want to archive this ${itemName}? You can restore it later.`}
    confirmText="Archive"
    cancelText="Cancel"
  />
);

export const ActivateConfirm = ({ isOpen, onClose, onConfirm, itemName = 'item' }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    type="success"
    title="Activate Item"
    message={`Are you sure you want to activate this ${itemName}?`}
    confirmText="Activate"
    cancelText="Cancel"
  />
);

export const DeactivateConfirm = ({ isOpen, onClose, onConfirm, itemName = 'item' }) => (
  <ConfirmDialog
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    type="warning"
    title="Deactivate Item"
    message={`Are you sure you want to deactivate this ${itemName}?`}
    confirmText="Deactivate"
    cancelText="Cancel"
  />
);

export default ConfirmDialog;
