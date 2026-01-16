import React from 'react';

/**
 * Reusable Badge component for status indicators
 * @param {Object} props - Component props
 * @param {string} props.variant - Badge variant
 * @param {React.ReactNode} props.children - Badge content
 */
export function Badge({ variant = 'default', children, className = '' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${variants[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

/**
 * Get badge variant based on status
 * @param {string} status - Status string
 * @returns {string} Badge variant
 */
export function getStatusVariant(status) {
  const statusMap = {
    // Order statuses
    pending: 'warning',
    processing: 'info',
    shipped: 'primary',
    delivered: 'success',
    cancelled: 'danger',
    // Payment statuses
    paid: 'success',
    unpaid: 'danger',
    refunded: 'warning',
    // Product statuses
    active: 'success',
    draft: 'default',
    archived: 'danger',
  };

  return statusMap[status?.toLowerCase()] || 'default';
}
