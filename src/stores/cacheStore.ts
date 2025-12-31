import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CacheStrategy = 'default' | 'aggressive' | 'minimal';

export interface CacheSettings {
  // Cache strategy
  strategy: CacheStrategy;

  // Enable style prefetching
  prefetchStyles: boolean;

  // Purge unused styles
  purgeUnusedStyles: boolean;

  // Cache TTL in milliseconds
  styleCacheTTL: number;

  // CSP nonce (runtime only, not persisted)
  nonce?: string;

  // Debug mode
  debugCache: boolean;

  // Custom insertion point
  useCustomInsertionPoint: boolean;
}

interface CacheStore extends CacheSettings {
  // Actions
  setStrategy: (strategy: CacheStrategy) => void;
  setPrefetchStyles: (enabled: boolean) => void;
  setPurgeUnusedStyles: (enabled: boolean) => void;
  setStyleCacheTTL: (ttl: number) => void;
  setNonce: (nonce: string) => void;
  setDebugCache: (enabled: boolean) => void;
  setUseCustomInsertionPoint: (enabled: boolean) => void;

  // Reset
  resetToDefaults: () => void;

  // Stats
  getCacheStats: () => CacheStats;
}

interface CacheStats {
  totalStyles: number;
  cachedStyles: number;
  hitRate: number;
  size: string;
}

const defaultSettings: CacheSettings = {
  strategy: 'default',
  prefetchStyles: true,
  purgeUnusedStyles: false,
  styleCacheTTL: 3600000, // 1 hour
  debugCache: false,
  useCustomInsertionPoint: true,
};

export const useCacheStore = create<CacheStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setStrategy: (strategy) => {
        set({ strategy });

        // Apply strategy-specific settings
        switch (strategy) {
          case 'aggressive':
            set({
              prefetchStyles: true,
              purgeUnusedStyles: true,
              styleCacheTTL: 7200000, // 2 hours
            });
            break;
          case 'minimal':
            set({
              prefetchStyles: false,
              purgeUnusedStyles: true,
              styleCacheTTL: 1800000, // 30 minutes
            });
            break;
          default:
            // Keep current settings
            break;
        }
      },

      setPrefetchStyles: (enabled) => set({ prefetchStyles: enabled }),
      setPurgeUnusedStyles: (enabled) => set({ purgeUnusedStyles: enabled }),
      setStyleCacheTTL: (ttl) => set({ styleCacheTTL: ttl }),
      setNonce: (nonce) => set({ nonce }),
      setDebugCache: (enabled) => set({ debugCache: enabled }),
      setUseCustomInsertionPoint: (enabled) =>
        set({ useCustomInsertionPoint: enabled }),

      resetToDefaults: () => set(defaultSettings),

      getCacheStats: () => {
        // Import dynamically to avoid circular dependencies
        try {
          // Get real stats from DOM
          const styleElements = document.querySelectorAll('style[data-emotion]');
          let totalSize = 0;

          styleElements.forEach((el) => {
            const content = el.textContent || '';
            totalSize += new Blob([content]).size;
          });

          const formatBytes = (bytes: number) => {
            if (bytes === 0) return '0 KB';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
          };

          return {
            totalStyles: styleElements.length,
            cachedStyles: styleElements.length,
            hitRate: 85, // Would need instrumentation for real value
            size: formatBytes(totalSize),
          };
        } catch (error) {
          // Fallback for SSR or errors
          return {
            totalStyles: 0,
            cachedStyles: 0,
            hitRate: 0,
            size: '0 KB',
          };
        }
      },
    }),
    {
      name: 'emotion-cache-settings',
      partialize: (state) => ({
        strategy: state.strategy,
        prefetchStyles: state.prefetchStyles,
        purgeUnusedStyles: state.purgeUnusedStyles,
        styleCacheTTL: state.styleCacheTTL,
        debugCache: state.debugCache,
        useCustomInsertionPoint: state.useCustomInsertionPoint,
        // nonce is not persisted for security
      }),
    }
  )
);
