import React from 'react';

/**
 * Reusable Input component with label and error handling
 * @param {Object} props - Component props
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {string} props.type - Input type
 * @param {string} props.id - Input ID
 * @param {string} props.className - Additional CSS classes
 */
export function Input({
  label,
  error,
  type = 'text',
  id,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={`
          block w-full rounded-lg shadow-sm text-sm
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
          placeholder-gray-400
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

/**
 * Reusable Select component
 */
export function Select({
  label,
  error,
  id,
  options = [],
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <select
        id={id}
        className={`
          block w-full rounded-lg shadow-sm text-sm
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

/**
 * Reusable Textarea component
 */
export function Textarea({
  label,
  error,
  id,
  rows = 3,
  className = '',
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-secondary-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={rows}
        className={`
          block w-full rounded-lg shadow-sm text-sm
          ${error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'
          }
          placeholder-gray-400
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
