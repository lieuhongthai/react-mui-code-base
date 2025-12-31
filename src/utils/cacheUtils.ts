/**
 * Utilities for working with Emotion cache
 */

/**
 * Get cache statistics from current Emotion cache
 */
export function getCacheStatistics() {
  // Get all style elements created by Emotion
  const styleElements = document.querySelectorAll('style[data-emotion]');

  let totalSize = 0;
  let totalRules = 0;

  styleElements.forEach((el) => {
    const content = el.textContent || '';
    totalSize += new Blob([content]).size;

    // Count CSS rules (rough estimate)
    const rules = content.match(/\{[^}]*\}/g);
    totalRules += rules ? rules.length : 0;
  });

  return {
    totalStyles: styleElements.length,
    cachedStyles: styleElements.length, // Simplified
    totalRules,
    size: formatBytes(totalSize),
    sizeBytes: totalSize,
    hitRate: 0, // Would need instrumentation
  };
}

/**
 * Clear all Emotion cache (removes all generated styles)
 */
export function clearEmotionCache() {
  const styleElements = document.querySelectorAll('style[data-emotion]');
  styleElements.forEach((el) => el.remove());
}

/**
 * Get Emotion cache info for debugging
 */
export function getEmotionCacheInfo() {
  const styleElements = document.querySelectorAll('style[data-emotion]');
  const info: Array<{
    key: string;
    ids: string;
    size: number;
    rules: number;
  }> = [];

  styleElements.forEach((el) => {
    const key = el.getAttribute('data-emotion') || '';
    const ids = el.getAttribute('data-s') || '';
    const content = el.textContent || '';
    const size = new Blob([content]).size;
    const rules = (content.match(/\{[^}]*\}/g) || []).length;

    info.push({ key, ids, size, rules });
  });

  return info;
}

/**
 * Log Emotion cache info to console
 */
export function logEmotionCache() {
  console.group('📦 Emotion Cache Info');

  const stats = getCacheStatistics();
  console.log('Total Style Elements:', stats.totalStyles);
  console.log('Total CSS Rules:', stats.totalRules);
  console.log('Total Size:', stats.size);

  console.log('\nDetailed Info:');
  console.table(getEmotionCacheInfo());

  console.groupEnd();
}

/**
 * Monitor Emotion cache size and warn if too large
 */
export function monitorCacheSize(maxSizeMB = 1) {
  const stats = getCacheStatistics();
  const sizeMB = stats.sizeBytes / (1024 * 1024);

  if (sizeMB > maxSizeMB) {
    console.warn(
      `⚠️ Emotion cache size (${stats.size}) exceeds ${maxSizeMB}MB. ` +
        'Consider enabling purgeUnusedStyles or reducing styleCacheTTL.'
    );
    return true;
  }

  return false;
}

/**
 * Get CSP nonce from meta tag
 */
export function getCSPNonce(): string | null {
  const meta = document.querySelector('meta[property="csp-nonce"]');
  return meta?.getAttribute('content') || null;
}

/**
 * Check if Emotion cache is using CSP nonce
 */
export function hasCSPNonce(): boolean {
  const styleElements = document.querySelectorAll('style[data-emotion]');
  return Array.from(styleElements).some((el) => el.hasAttribute('nonce'));
}

/**
 * Prefetch and cache common MUI component styles
 */
export function prefetchMUIStyles() {
  // Create invisible elements to trigger style generation
  const components = [
    'button',
    'input',
    'div[role="dialog"]',
    'div[role="alert"]',
  ];

  const container = document.createElement('div');
  container.style.cssText = 'position:absolute;left:-9999px;top:-9999px;';

  components.forEach(() => {
    const el = document.createElement('div');
    el.className = 'MuiButton-root MuiButton-contained'; // Common classes
    container.appendChild(el);
  });

  document.body.appendChild(container);

  // Clean up after styles are generated
  requestAnimationFrame(() => {
    container.remove();
  });
}

/**
 * Optimize cache by removing unused styles
 * This is a simple version - production would need more sophistication
 */
export function optimizeCache() {
  const styleElements = document.querySelectorAll('style[data-emotion]');
  let removed = 0;

  styleElements.forEach((el) => {
    const content = el.textContent || '';

    // Remove if very small (likely unused)
    if (content.length < 50) {
      el.remove();
      removed++;
    }
  });

  return {
    removed,
    remaining: styleElements.length - removed,
  };
}

/**
 * Format bytes to human-readable size
 */
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Export cache for debugging/analysis
 */
export function exportCache() {
  const info = getEmotionCacheInfo();
  const stats = getCacheStatistics();

  const exportData = {
    timestamp: new Date().toISOString(),
    stats,
    styles: info,
  };

  // Download as JSON
  const blob = new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `emotion-cache-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Setup cache monitoring in development
 */
export function setupCacheMonitoring() {
  if (import.meta.env.DEV) {
    // Log cache on load
    window.addEventListener('load', () => {
      setTimeout(logEmotionCache, 1000);
    });

    // Monitor size every minute
    setInterval(() => {
      monitorCacheSize();
    }, 60000);

    // Expose utilities to window for debugging
    (window as any).__emotionCache = {
      log: logEmotionCache,
      stats: getCacheStatistics,
      clear: clearEmotionCache,
      export: exportCache,
      optimize: optimizeCache,
    };

    console.log(
      '💡 Emotion cache utils available at window.__emotionCache'
    );
  }
}
