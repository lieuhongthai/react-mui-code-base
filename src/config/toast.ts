import type { ExternalToast } from 'sonner';

/**
 * Global toast configuration
 * Customize appearance and behavior of all toasts
 */
export const toastConfig = {
  // Position of toasts
  position: 'top-right' as const,

  // Auto-dismiss duration (ms)
  duration: 4000,

  // Rich colors for different toast types
  richColors: true,

  // Show close button
  closeButton: true,

  // Expand toasts by default
  expand: false,

  // Pause on page idle
  pauseWhenPageIsHidden: true,

  // Visual appearance
  style: {
    background: 'var(--mui-palette-background-paper)',
    color: 'var(--mui-palette-text-primary)',
    border: '1px solid var(--mui-palette-divider)',
  },
} as const;

/**
 * Default toast options for different types
 */
export const toastDefaults = {
  success: {
    duration: 3000,
  } as ExternalToast,

  error: {
    duration: 5000,
  } as ExternalToast,

  warning: {
    duration: 4000,
  } as ExternalToast,

  info: {
    duration: 3000,
  } as ExternalToast,

  loading: {
    duration: Infinity, // Don't auto-dismiss loading toasts
  } as ExternalToast,
} as const;

/**
 * Toast messages for common actions
 */
export const toastMessages = {
  // Success messages
  success: {
    create: 'Successfully created!',
    update: 'Successfully updated!',
    delete: 'Successfully deleted!',
    save: 'Successfully saved!',
  },

  // Error messages
  error: {
    create: 'Failed to create',
    update: 'Failed to update',
    delete: 'Failed to delete',
    save: 'Failed to save',
    load: 'Failed to load data',
    network: 'Network error. Please check your connection.',
    unknown: 'An unexpected error occurred',
  },

  // Loading messages
  loading: {
    create: 'Creating...',
    update: 'Updating...',
    delete: 'Deleting...',
    save: 'Saving...',
    load: 'Loading...',
  },
} as const;
