/**
 * Subdomain/URL utilities for multi-tenant store routing
 */

// Base domain for the application
const BASE_DOMAIN = 'hydrolify.vercel.app';
const LOCAL_DOMAINS = ['localhost', '127.0.0.1'];

/**
 * Check if custom domain with wildcard subdomains is configured
 * Set this to true when using a custom domain with wildcard DNS
 */
const USE_SUBDOMAINS = false;

/**
 * Get the current subdomain from the hostname
 * @returns {string|null} The subdomain or null if on main domain
 */
export function getSubdomain() {
  if (!USE_SUBDOMAINS) return null;
  
  const hostname = window.location.hostname;
  
  // Check if we're on localhost (development)
  if (LOCAL_DOMAINS.some(domain => hostname.includes(domain))) {
    // In development, check for subdomain query param or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const subdomainParam = urlParams.get('subdomain');
    if (subdomainParam) {
      return subdomainParam;
    }
    return null;
  }
  
  // Production: Extract subdomain from hostname
  // e.g., "mystore.hydrolify.vercel.app" -> "mystore"
  const parts = hostname.split('.');
  
  // Check if it's a subdomain of our base domain
  if (hostname.endsWith(BASE_DOMAIN) && parts.length > 3) {
    return parts[0];
  }
  
  // For custom domains or direct access
  if (parts.length > 2 && !hostname.endsWith('.vercel.app')) {
    return parts[0];
  }
  
  return null;
}

/**
 * Check if we're on a store subdomain
 * @returns {boolean}
 */
export function isStoreSubdomain() {
  return getSubdomain() !== null;
}

/**
 * Generate the full store URL
 * @param {string} slug - The store's slug/subdomain
 * @returns {string} The full URL
 */
export function getStoreUrl(slug) {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port ? `:${window.location.port}` : '';
  
  // Development mode - always use path-based
  if (LOCAL_DOMAINS.some(domain => hostname.includes(domain))) {
    return `${protocol}//${hostname}${port}/store/${slug}`;
  }
  
  // Production mode
  if (USE_SUBDOMAINS) {
    // Subdomain mode (requires custom domain with wildcard DNS)
    return `${protocol}//${slug}.${BASE_DOMAIN}`;
  } else {
    // Path-based mode (works with Vercel free tier)
    return `${protocol}//${BASE_DOMAIN}/store/${slug}`;
  }
}

/**
 * Get the display URL (for showing to users)
 * @param {string} slug - The store's slug
 * @returns {string} The display URL
 */
export function getDisplayUrl(slug) {
  if (USE_SUBDOMAINS) {
    return `${slug}.hydrolify.vercel.app`;
  }
  return `hydrolify.vercel.app/store/${slug}`;
}

/**
 * Validate subdomain format
 * @param {string} subdomain - The subdomain to validate
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateSubdomain(subdomain) {
  if (!subdomain) {
    return { isValid: false, error: 'Subdomain is required' };
  }
  
  // Convert to lowercase
  const normalized = subdomain.toLowerCase().trim();
  
  // Check length
  if (normalized.length < 3) {
    return { isValid: false, error: 'Subdomain must be at least 3 characters' };
  }
  
  if (normalized.length > 30) {
    return { isValid: false, error: 'Subdomain must be 30 characters or less' };
  }
  
  // Check format (alphanumeric and hyphens only, can't start/end with hyphen)
  const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
  if (!subdomainRegex.test(normalized)) {
    return { 
      isValid: false, 
      error: 'Subdomain can only contain letters, numbers, and hyphens. Cannot start or end with a hyphen.' 
    };
  }
  
  // Reserved subdomains
  const reserved = ['www', 'app', 'api', 'admin', 'dashboard', 'store', 'stores', 'login', 'register', 'help', 'support', 'mail', 'email', 'ftp', 'cdn', 'static', 'assets'];
  if (reserved.includes(normalized)) {
    return { isValid: false, error: 'This subdomain is reserved and cannot be used' };
  }
  
  return { isValid: true, error: null };
}

/**
 * Normalize a string to be used as a subdomain
 * @param {string} str - The string to normalize
 * @returns {string} The normalized subdomain
 */
export function normalizeSubdomain(str) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')  // Replace invalid chars with hyphens
    .replace(/-+/g, '-')          // Replace multiple hyphens with single
    .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
}

export { BASE_DOMAIN };
