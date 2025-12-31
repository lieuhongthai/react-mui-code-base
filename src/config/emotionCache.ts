import createCache from '@emotion/cache';

/**
 * Create Emotion cache with custom configuration
 * This allows us to control:
 * - CSS injection order
 * - Cache key/prefix
 * - Nonce for CSP
 * - SSR optimization
 */

export interface CreateEmotionCacheOptions {
  /**
   * Key to use for the cache
   * This will be used as prefix for generated class names
   * @default 'css'
   */
  key?: string;

  /**
   * Nonce value for Content Security Policy
   * Required if you have CSP with script-src directive
   */
  nonce?: string;

  /**
   * Prepend styles instead of append
   * Useful for SSR or when you want MUI styles to have lower priority
   * @default false
   */
  prepend?: boolean;

  /**
   * Custom container for injecting styles
   */
  container?: HTMLElement;

  /**
   * Whether to insert styles at the top of the head
   * @default true
   */
  insertionPoint?: HTMLElement | null;
}

/**
 * Default Emotion cache configuration
 */
export function createEmotionCache(options: CreateEmotionCacheOptions = {}) {
  const {
    key = 'mui',
    nonce,
    prepend = false,
    container,
    insertionPoint,
  } = options;

  const cacheOptions: any = {
    key,
    prepend,
  };

  // Add nonce for CSP if provided
  if (nonce) {
    cacheOptions.nonce = nonce;
  }

  // Custom container
  if (container) {
    cacheOptions.container = container;
  }

  // Insertion point for controlling style order
  if (insertionPoint !== undefined) {
    cacheOptions.insertionPoint = insertionPoint;
  }

  return createCache(cacheOptions);
}

/**
 * Client-side emotion cache
 * This is the default cache used in the browser
 */
export const clientSideEmotionCache = createEmotionCache({
  key: 'mui',
  prepend: true, // Ensures MUI styles have lower priority than custom styles
});

/**
 * Get or create a meta tag for insertion point
 * This helps control the order of style injection
 */
export function getEmotionInsertionPoint(): HTMLMetaElement {
  let insertionPoint = document.querySelector<HTMLMetaElement>(
    'meta[name="emotion-insertion-point"]'
  );

  if (!insertionPoint) {
    insertionPoint = document.createElement('meta');
    insertionPoint.setAttribute('name', 'emotion-insertion-point');
    insertionPoint.setAttribute('content', '');
    document.head.insertBefore(insertionPoint, document.head.firstChild);
  }

  return insertionPoint;
}

/**
 * Create emotion cache with insertion point
 * Use this if you need precise control over style order
 */
export function createEmotionCacheWithInsertionPoint() {
  return createEmotionCache({
    key: 'mui',
    insertionPoint: getEmotionInsertionPoint(),
    prepend: true,
  });
}

/**
 * Extract critical CSS for SSR
 * This function extracts the CSS generated during SSR
 */
export function extractCriticalCss(html: string, _cache: any) {
  // This is typically used on the server
  // The actual implementation depends on your SSR setup
  return {
    html,
    css: '', // Extract from cache
    ids: [], // Style IDs
  };
}
