import { useNavigate, useSearch } from '@tanstack/react-router';
import { useCallback, useMemo } from 'react';

/**
 * Type for filter serializers
 */
export interface FilterSerializer<T> {
  /**
   * Serialize filter value to string for URL
   */
  serialize: (value: T) => string;

  /**
   * Deserialize string from URL to filter value
   */
  deserialize: (value: string) => T;

  /**
   * Default value for the filter
   */
  defaultValue: T;
}

/**
 * Configuration for query filters
 */
export interface QueryFiltersConfig<T extends Record<string, any>> {
  /**
   * Serializers for each filter field
   */
  serializers: {
    [K in keyof T]?: FilterSerializer<T[K]>;
  };

  /**
   * Default values for filters
   */
  defaultValues: T;
}

/**
 * Return type for useQueryFilters hook
 */
export interface UseQueryFiltersReturn<T extends Record<string, any>> {
  /**
   * Current filter values
   */
  filters: T;

  /**
   * Update a single filter
   */
  setFilter: <K extends keyof T>(key: K, value: T[K]) => void;

  /**
   * Update multiple filters at once
   */
  setFilters: (updates: Partial<T>) => void;

  /**
   * Reset all filters to default values
   */
  resetFilters: () => void;

  /**
   * Clear a specific filter (set to default)
   */
  clearFilter: <K extends keyof T>(key: K) => void;
}

/**
 * Built-in serializers for common types
 */
export const serializers = {
  /**
   * String serializer (pass through)
   */
  string: <T extends string>(defaultValue: T): FilterSerializer<T> => ({
    serialize: (value) => value,
    deserialize: (value) => value as T,
    defaultValue,
  }),

  /**
   * Number serializer
   */
  number: <T extends number>(defaultValue: T): FilterSerializer<T> => ({
    serialize: (value) => String(value),
    deserialize: (value) => {
      const num = parseInt(value, 10);
      return (isNaN(num) ? defaultValue : num) as T;
    },
    defaultValue,
  }),

  /**
   * Boolean serializer
   */
  boolean: (defaultValue: boolean): FilterSerializer<boolean> => ({
    serialize: (value) => String(value),
    deserialize: (value) => value === 'true',
    defaultValue,
  }),

  /**
   * Optional string serializer
   */
  optionalString: (): FilterSerializer<string | undefined> => ({
    serialize: (value) => value || '',
    deserialize: (value) => (value === '' ? undefined : value),
    defaultValue: undefined,
  }),

  /**
   * Optional number serializer
   */
  optionalNumber: (): FilterSerializer<number | undefined> => ({
    serialize: (value) => (value !== undefined ? String(value) : ''),
    deserialize: (value) => {
      if (value === '') return undefined;
      const num = parseInt(value, 10);
      return isNaN(num) ? undefined : num;
    },
    defaultValue: undefined,
  }),

  /**
   * Optional boolean serializer (true/false/undefined)
   */
  optionalBoolean: (): FilterSerializer<boolean | undefined> => ({
    serialize: (value) => (value !== undefined ? String(value) : ''),
    deserialize: (value) => {
      if (value === '') return undefined;
      return value === 'true';
    },
    defaultValue: undefined,
  }),

  /**
   * Enum serializer
   */
  enum: <T extends string>(
    defaultValue: T,
    validValues: readonly T[]
  ): FilterSerializer<T> => ({
    serialize: (value) => value,
    deserialize: (value) => {
      return validValues.includes(value as T) ? (value as T) : defaultValue;
    },
    defaultValue,
  }),
};

/**
 * Custom hook to manage filters in URL query parameters
 *
 * This hook persists filter state in the URL, allowing:
 * - Page reload to preserve filters
 * - Browser back/forward navigation
 * - Shareable links with filters
 * - Bookmarking filtered states
 *
 * @example
 * ```typescript
 * const { filters, setFilter, resetFilters } = useQueryFilters({
 *   defaultValues: {
 *     status: 'all',
 *     userId: undefined,
 *     limit: 20,
 *   },
 *   serializers: {
 *     status: serializers.enum('all', ['all', 'active', 'completed']),
 *     userId: serializers.optionalNumber(),
 *     limit: serializers.number(20),
 *   },
 * });
 *
 * // Update filter
 * setFilter('status', 'active');
 *
 * // Reset all filters
 * resetFilters();
 * ```
 */
export function useQueryFilters<T extends Record<string, any>>(
  config: QueryFiltersConfig<T>
): UseQueryFiltersReturn<T> {
  const navigate = useNavigate();
  const searchParams = useSearch({ strict: false }) as Record<string, string>;

  // Parse filters from URL
  const filters = useMemo(() => {
    const result = { ...config.defaultValues };

    for (const key in config.serializers) {
      const serializer = config.serializers[key];
      const urlValue = searchParams[key];

      if (serializer && urlValue !== undefined) {
        result[key] = serializer.deserialize(urlValue);
      }
    }

    return result;
  }, [searchParams, config.defaultValues, config.serializers]);

  // Update URL with new filters
  const updateUrl = useCallback(
    (newFilters: Partial<T>) => {
      const search: Record<string, string> = {};

      // Merge current filters with updates
      const mergedFilters = { ...filters, ...newFilters };

      // Serialize each filter to URL params
      for (const key in config.serializers) {
        const serializer = config.serializers[key];
        const value = mergedFilters[key];

        if (serializer && value !== serializer.defaultValue) {
          search[key] = serializer.serialize(value);
        }
      }

      // Navigate with new search params
      navigate({
        search: search as any,
        replace: true, // Replace current history entry
      });
    },
    [navigate, filters, config.serializers]
  );

  // Set a single filter
  const setFilter = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      updateUrl({ [key]: value } as any);
    },
    [updateUrl]
  );

  // Set multiple filters
  const setFilters = useCallback(
    (updates: Partial<T>) => {
      updateUrl(updates);
    },
    [updateUrl]
  );

  // Reset all filters to defaults
  const resetFilters = useCallback(() => {
    navigate({
      search: {} as any,
      replace: true,
    });
  }, [navigate]);

  // Clear a specific filter
  const clearFilter = useCallback(
    <K extends keyof T>(key: K) => {
      setFilter(key, config.defaultValues[key]);
    },
    [setFilter, config.defaultValues]
  );

  return {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    clearFilter,
  };
}
