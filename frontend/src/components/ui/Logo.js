import React from 'react';
import { companyBranding } from '../../data/mockData';

/**
 * Company Logo component - displays the StoreCraft brand
 * @param {Object} props - Component props
 * @param {string} props.size - Logo size (sm, md, lg, xl)
 * @param {boolean} props.showText - Whether to show company name
 * @param {boolean} props.showTagline - Whether to show tagline
 * @param {string} props.variant - Color variant (light, dark)
 */
export function Logo({
  size = 'md',
  showText = true,
  showTagline = false,
  variant = 'dark',
  className = '',
}) {
  const sizes = {
    sm: { icon: 'w-8 h-8', text: 'text-lg', tagline: 'text-xs' },
    md: { icon: 'w-10 h-10', text: 'text-xl', tagline: 'text-sm' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', tagline: 'text-sm' },
    xl: { icon: 'w-16 h-16', text: 'text-3xl', tagline: 'text-base' },
  };

  const colors = {
    dark: {
      text: 'text-secondary-800',
      tagline: 'text-secondary-500',
    },
    light: {
      text: 'text-white',
      tagline: 'text-white/80',
    },
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo Icon */}
      <div
        className={`
          flex items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-700
          shadow-lg ${sizes[size].icon}
        `}
      >
        {/* Custom SC Logo */}
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-3/5 h-3/5"
        >
          {/* Shopping bag shape */}
          <path
            d="M8 12C8 10.8954 8.89543 10 10 10H30C31.1046 10 32 10.8954 32 12V32C32 33.1046 31.1046 34 30 34H10C8.89543 34 8 33.1046 8 32V12Z"
            fill="white"
            fillOpacity="0.9"
          />
          {/* Handle */}
          <path
            d="M14 10V8C14 5.79086 15.7909 4 18 4H22C24.2091 4 26 5.79086 26 8V10"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* S letter */}
          <path
            d="M16 18C16 16.8954 16.8954 16 18 16H22C23.1046 16 24 16.8954 24 18C24 19.1046 23.1046 20 22 20H18C16.8954 20 16 20.8954 16 22C16 23.1046 16.8954 24 18 24H22C23.1046 24 24 24.8954 24 26"
            stroke="#2563eb"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Company Name & Tagline */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight ${sizes[size].text} ${colors[variant].text}`}>
            {companyBranding.name}
          </span>
          {showTagline && (
            <span className={`${sizes[size].tagline} ${colors[variant].tagline}`}>
              {companyBranding.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Company Header component for auth pages
 */
export function AuthHeader({ title, subtitle }) {
  return (
    <div className="text-center">
      <div className="flex justify-center mb-6">
        <Logo size="lg" showText={false} />
      </div>
      <h1 className="text-3xl font-bold text-secondary-800 mb-2">
        {companyBranding.name}
      </h1>
      <p className="text-primary-600 font-medium mb-6">
        {companyBranding.tagline}
      </p>
      {title && (
        <h2 className="text-xl font-semibold text-secondary-700 mb-1">
          {title}
        </h2>
      )}
      {subtitle && (
        <p className="text-secondary-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}

/**
 * Powered by footer for the platform
 */
export function PoweredBy({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-2 text-sm text-secondary-400 ${className}`}>
      <span>Powered by</span>
      <Logo size="sm" variant="dark" />
    </div>
  );
}

export default Logo;
