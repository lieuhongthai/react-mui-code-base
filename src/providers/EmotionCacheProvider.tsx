import { useMemo, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CacheProvider } from '@emotion/react';
import type { EmotionCache } from '@emotion/cache';
import { createEmotionCacheWithInsertionPoint } from '@/config/emotionCache';
import { useCacheStore } from '@/stores/cacheStore';
import {
  setupCacheMonitoring,
  prefetchMUIStyles,
} from '@/utils/cacheUtils';

interface EmotionCacheProviderProps {
  children: ReactNode;
  /**
   * Custom Emotion cache instance
   * If not provided, a default cache will be created
   */
  cache?: EmotionCache;

  /**
   * Nonce for Content Security Policy
   */
  nonce?: string;
}

/**
 * EmotionCacheProvider wraps the app with Emotion's CacheProvider
 * This enables:
 * - Custom CSS injection order
 * - CSP nonce support
 * - SSR optimization
 * - Better cache control
 */
export function EmotionCacheProvider({
  children,
  cache,
  nonce,
}: EmotionCacheProviderProps) {
  const { debugCache, prefetchStyles } = useCacheStore();

  // Create cache with memoization
  const emotionCache = useMemo(() => {
    if (cache) {
      return cache;
    }

    // Create default cache with insertion point
    return createEmotionCacheWithInsertionPoint();
  }, [cache]);

  // Apply nonce if provided and no custom cache
  useMemo(() => {
    if (nonce && !cache) {
      (emotionCache as any).nonce = nonce;
    }
  }, [nonce, cache, emotionCache]);

  // Setup cache monitoring in development
  useEffect(() => {
    if (debugCache) {
      setupCacheMonitoring();
    }
  }, [debugCache]);

  // Prefetch common MUI styles for better performance
  useEffect(() => {
    if (prefetchStyles) {
      // Delay prefetching to not block initial render
      const timer = setTimeout(() => {
        prefetchMUIStyles();
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [prefetchStyles]);

  return <CacheProvider value={emotionCache}>{children}</CacheProvider>;
}
