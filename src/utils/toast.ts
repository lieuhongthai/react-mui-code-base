import { toast as sonnerToast } from 'sonner';
import { toastDefaults, toastMessages } from '@/config/toast';
import type { ExternalToast } from 'sonner';

/**
 * Enhanced toast utilities with default configurations
 * Wraps Sonner's toast API with sensible defaults
 */

/**
 * Show a success toast
 */
export function toastSuccess(
  message: string,
  options?: ExternalToast
) {
  return sonnerToast.success(message, {
    ...toastDefaults.success,
    ...options,
  });
}

/**
 * Show an error toast
 */
export function toastError(
  message: string,
  options?: ExternalToast
) {
  return sonnerToast.error(message, {
    ...toastDefaults.error,
    ...options,
  });
}

/**
 * Show a warning toast
 */
export function toastWarning(
  message: string,
  options?: ExternalToast
) {
  return sonnerToast.warning(message, {
    ...toastDefaults.warning,
    ...options,
  });
}

/**
 * Show an info toast
 */
export function toastInfo(
  message: string,
  options?: ExternalToast
) {
  return sonnerToast.info(message, {
    ...toastDefaults.info,
    ...options,
  });
}

/**
 * Show a loading toast
 */
export function toastLoading(
  message: string,
  options?: ExternalToast
) {
  return sonnerToast.loading(message, {
    ...toastDefaults.loading,
    ...options,
  });
}

/**
 * Show a promise toast with loading, success, and error states
 */
export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: string | ((data: T) => string);
    error: string | ((error: any) => string);
  }
) {
  return sonnerToast.promise(promise, messages);
}

/**
 * Dismiss a specific toast or all toasts
 */
export function toastDismiss(toastId?: string | number) {
  sonnerToast.dismiss(toastId);
}

/**
 * Shorthand helpers for common actions
 */
export const toast = {
  // Basic types
  success: toastSuccess,
  error: toastError,
  warning: toastWarning,
  info: toastInfo,
  loading: toastLoading,
  promise: toastPromise,
  dismiss: toastDismiss,

  // Common action messages
  created: (itemName?: string, options?: ExternalToast) =>
    toastSuccess(
      itemName
        ? `${itemName} ${toastMessages.success.create.toLowerCase()}`
        : toastMessages.success.create,
      options
    ),

  updated: (itemName?: string, options?: ExternalToast) =>
    toastSuccess(
      itemName
        ? `${itemName} ${toastMessages.success.update.toLowerCase()}`
        : toastMessages.success.update,
      options
    ),

  deleted: (itemName?: string, options?: ExternalToast) =>
    toastSuccess(
      itemName
        ? `${itemName} ${toastMessages.success.delete.toLowerCase()}`
        : toastMessages.success.delete,
      options
    ),

  saved: (options?: ExternalToast) => toastSuccess(toastMessages.success.save, options),

  // Common errors
  createError: (error?: Error, options?: ExternalToast) =>
    toastError(error?.message || toastMessages.error.create, options),

  updateError: (error?: Error, options?: ExternalToast) =>
    toastError(error?.message || toastMessages.error.update, options),

  deleteError: (error?: Error, options?: ExternalToast) =>
    toastError(error?.message || toastMessages.error.delete, options),

  networkError: (options?: ExternalToast) =>
    toastError(toastMessages.error.network, options),

  unknownError: (error?: Error, options?: ExternalToast) =>
    toastError(error?.message || toastMessages.error.unknown, options),
};

/**
 * Export the original toast for advanced usage
 */
export { sonnerToast as rawToast };
