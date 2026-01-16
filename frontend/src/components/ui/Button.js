import React from 'react';

/**
 * Reusable Button component with multiple variants
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant (primary, secondary, danger)
 * @param {string} props.size - Button size (sm, md, lg)
 * @param {boolean} props.isLoading - Loading state
 * @param {boolean} props.disabled - Disabled state
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 */
export function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  // Variant styles
  const variants = {
    primary: 'text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 border border-transparent',
    secondary: 'text-secondary-700 bg-white hover:bg-gray-50 focus:ring-primary-500 border border-gray-300',
    danger: 'text-white bg-red-600 hover:bg-red-700 focus:ring-red-500 border border-transparent',
    ghost: 'text-secondary-600 bg-transparent hover:bg-gray-100 focus:ring-primary-500 border border-transparent',
  };

  // Size styles
  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
