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
      {/* Logo Image */}
      <img
        src="/logo.png"
        alt={companyBranding.name}
        className={`${sizes[size].icon} object-contain`}
      />

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
