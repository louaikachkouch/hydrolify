import React from 'react';

/**
 * Reusable Card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Enable hover effect
 * @param {Object} props.padding - Custom padding
 */
export function Card({
  children,
  className = '',
  hoverable = false,
  noPadding = false,
  ...props
}) {
  return (
    <div
      className={`
        bg-white rounded-xl shadow-card border border-gray-100
        ${hoverable ? 'hover:shadow-card-hover transition-shadow duration-200' : ''}
        ${noPadding ? '' : 'p-6'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Card Header component
 */
export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  );
}

/**
 * Card Title component
 */
export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-lg font-semibold text-secondary-800 ${className}`}>
      {children}
    </h3>
  );
}

/**
 * Card Description component
 */
export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-secondary-500 mt-1 ${className}`}>
      {children}
    </p>
  );
}

/**
 * Card Content component
 */
export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

/**
 * Card Footer component
 */
export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-4 pt-4 border-t border-gray-100 ${className}`}>
      {children}
    </div>
  );
}
