export const AUTH_ERRORS = {
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 6 characters long',
  MISSING_FIELDS: 'Please fill in all required fields',
  INVALID_CREDENTIALS: 'Invalid login credentials',
};

export const LOCATION_ERRORS = {
  PERMISSION_DENIED: 'Location permission denied',
  UNAVAILABLE: 'Location service unavailable',
  TIMEOUT: 'Location request timed out',
};

export const GROUP_ERRORS = {
  INVALID_NAME: 'Group name is required',
  INVALID_DESCRIPTION: 'Group description is required',
  INVALID_DESTINATION: 'Group destination is required',
  ALREADY_MEMBER: 'You are already a member of this group',
};

export const MAP_CONFIG = {
  DEFAULT_ZOOM: 12,
  DEFAULT_CENTER: { lat: 48.2082, lng: 16.3738 }, // Vienna, Austria
  MARKER_COLORS: {
    DRIVER: '#1E40AF',
    PASSENGER: '#047857',
    DESTINATION: '#B91C1C',
  },
};