import React, { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

/**
 * Reusable Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {Function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (sm, md, lg, xl)
 */
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
}) {
  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Fragment>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={`
              relative w-full ${sizes[size]} bg-white rounded-xl shadow-xl
              transform transition-all
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-secondary-800">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-secondary-400 hover:text-secondary-600 hover:bg-gray-100 transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {children}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

/**
 * Modal Footer component for action buttons
 */
export function ModalFooter({ children, className = '' }) {
  return (
    <div className={`flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
