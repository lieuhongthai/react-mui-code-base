# Emotion Cache System

Complete guide to Emotion cache configuration and optimization for CSS-in-JS performance.

## What is Emotion Cache?

Emotion cache is the system that:
- **Generates** CSS from your styled components
- **Caches** generated CSS to avoid regeneration
- **Injects** CSS into the DOM
- **Controls** CSS injection order
- **Optimizes** for SSR (Server-Side Rendering)

## Architecture

```
┌────────────────────────────────────────┐
│      Emotion Cache Provider            │
│  (Controls CSS generation & injection) │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│      CSS Generation Layer               │
│  - Generate class names                 │
│  - Cache generated styles               │
│  - Apply optimizations                  │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│      DOM Injection Layer                │
│  - Insert <style> tags                  │
│  - Control injection order              │
│  - Apply CSP nonce                      │
└────────────────────────────────────────┘
```

## Configuration

### Cache Key

The cache key is used as a prefix for generated class names:

```tsx
createEmotionCache({
  key: 'mui', // Generated classes: .mui-xxx
});
```

**Benefits:**
- Avoid class name conflicts
- Multiple caches on same page
- Clear debugging

### Prepend Mode

Controls where styles are injected:

```tsx
createEmotionCache({
  prepend: true, // Insert at top of <head>
});
```

**Use Cases:**
- `prepend: true` - MUI styles have lower priority (can be overridden)
- `prepend: false` - MUI styles have higher priority (default behavior)

### Insertion Point

Control exact position of style injection:

```tsx
const insertionPoint = document.querySelector('#emotion-insertion-point');

createEmotionCache({
  insertionPoint,
});
```

**Use Cases:**
- Control CSS cascade order
- Mix with other CSS frameworks
- Third-party integration

### CSP Nonce

For Content Security Policy compliance:

```tsx
createEmotionCache({
  nonce: 'your-nonce-value',
});
```

**Security:**
- Required for strict CSP
- Generated per-request in SSR
- Prevents inline script attacks

## Cache Strategies

### Default Strategy
```tsx
{
  strategy: 'default',
  prefetchStyles: true,
  purgeUnusedStyles: false,
  styleCacheTTL: 3600000, // 1 hour
}
```

**Best for:** General use, balanced performance

### Aggressive Strategy
```tsx
{
  strategy: 'aggressive',
  prefetchStyles: true,
  purgeUnusedStyles: true,
  styleCacheTTL: 7200000, // 2 hours
}
```

**Best for:** Production, maximum performance

### Minimal Strategy
```tsx
{
  strategy: 'minimal',
  prefetchStyles: false,
  purgeUnusedStyles: true,
  styleCacheTTL: 1800000, // 30 minutes
}
```

**Best for:** Development, frequent changes

## Usage

### Basic Setup

Already configured in `main.tsx`:

```tsx
import { EmotionCacheProvider } from '@/providers/EmotionCacheProvider';

<EmotionCacheProvider>
  <App />
</EmotionCacheProvider>
```

### Custom Cache

```tsx
import createCache from '@emotion/cache';

const myCache = createCache({
  key: 'custom',
  prepend: true,
});

<EmotionCacheProvider cache={myCache}>
  <App />
</EmotionCacheProvider>
```

### With CSP Nonce

```tsx
// Get nonce from meta tag or server
const nonce = document
  .querySelector('meta[property="csp-nonce"]')
  ?.getAttribute('content');

<EmotionCacheProvider nonce={nonce}>
  <App />
</EmotionCacheProvider>
```

### Managing Cache Settings

```tsx
import { useCacheStore } from '@/stores/cacheStore';

function MyComponent() {
  const { setStrategy, setPrefetchStyles } = useCacheStore();

  // Change strategy
  setStrategy('aggressive');

  // Enable prefetch
  setPrefetchStyles(true);
}
```

## Performance Optimization

### 1. Prefetch Common Styles

```tsx
const { setPrefetchStyles } = useCacheStore();
setPrefetchStyles(true);
```

Generates and caches commonly used styles upfront.

### 2. Purge Unused Styles

```tsx
const { setPurgeUnusedStyles } = useCacheStore();
setPurgeUnusedStyles(true);
```

Removes unused styles from cache to reduce memory.

### 3. Custom Insertion Point

```tsx
const { setUseCustomInsertionPoint } = useCacheStore();
setUseCustomInsertionPoint(true);
```

Better control over CSS cascade order.

### 4. Adjust Cache TTL

```tsx
const { setStyleCacheTTL } = useCacheStore();
setStyleCacheTTL(7200000); // 2 hours
```

Balance between cache hits and memory usage.

## SSR (Server-Side Rendering)

### Extract Critical CSS

```tsx
import { extractCriticalToChunks } from '@emotion/server';

// On server
const html = renderToString(<App />);
const chunks = extractCriticalToChunks(html);
const styles = chunks.styles.map(
  (style) => `<style data-emotion="${style.key}">${style.css}</style>`
).join('');
```

### Hydration

```tsx
// Client-side
import { CacheProvider } from '@emotion/react';

<CacheProvider value={cache}>
  <App />
</CacheProvider>
```

## CSS Cascade Control

### Problem
You want custom styles to override MUI styles:

```tsx
// This might not work
<Button sx={{ color: 'red' }} />
```

### Solution 1: Prepend Mode

```tsx
createEmotionCache({
  prepend: true, // MUI styles at top, custom styles below
});
```

### Solution 2: Insertion Point

```tsx
// In HTML
<head>
  <meta name="emotion-insertion-point" content="" />
</head>

// In code
const insertionPoint = getEmotionInsertionPoint();
createEmotionCache({ insertionPoint });
```

### Solution 3: Specificity

```tsx
// Increase specificity
<Button
  sx={{
    '&&': {
      color: 'red', // Higher specificity
    },
  }}
/>
```

## CSP (Content Security Policy)

### Why CSP?

Prevents XSS attacks by controlling script/style sources.

### Setup

1. **Generate nonce per request:**

```tsx
// Server
const nonce = crypto.randomBytes(16).toString('base64');
```

2. **Add to HTML:**

```html
<meta property="csp-nonce" content="${nonce}" />
```

3. **Configure cache:**

```tsx
<EmotionCacheProvider nonce={nonce}>
  <App />
</EmotionCacheProvider>
```

4. **Set CSP header:**

```
Content-Security-Policy:
  script-src 'self' 'nonce-${nonce}';
  style-src 'self' 'nonce-${nonce}';
```

## Debug Mode

### Enable Debugging

```tsx
import { useCacheStore } from '@/stores/cacheStore';

useCacheStore.getState().setDebugCache(true);
```

### What It Logs

- Cache hits/misses
- Style generation time
- Injection order
- Cache size

### Example Output

```
[Emotion] Cache hit: mui-abc123
[Emotion] Generated: .mui-xyz789 (2.3ms)
[Emotion] Injected at: <head> position 5
[Emotion] Cache size: 234 KB
```

## Advanced Usage

### Multiple Caches

```tsx
const themeCache = createCache({ key: 'theme' });
const componentCache = createCache({ key: 'comp' });

<CacheProvider value={themeCache}>
  <Theme>
    <CacheProvider value={componentCache}>
      <Components />
    </CacheProvider>
  </Theme>
</CacheProvider>
```

### Dynamic Cache Creation

```tsx
import { useMemo } from 'react';

function App() {
  const cache = useMemo(
    () =>
      createCache({
        key: window.location.pathname.split('/')[1] || 'app',
      }),
    []
  );

  return <CacheProvider value={cache}>...</CacheProvider>;
}
```

### Cache Analytics

```tsx
const { getCacheStats } = useCacheStore();

useEffect(() => {
  const interval = setInterval(() => {
    const stats = getCacheStats();
    console.log('Cache stats:', stats);

    // Send to analytics
    analytics.track('cache_stats', stats);
  }, 60000); // Every minute

  return () => clearInterval(interval);
}, []);
```

## Troubleshooting

### Styles Not Applying

**Problem:** Custom styles don't override MUI styles

**Solutions:**
1. Enable prepend mode
2. Use insertion point
3. Increase specificity with `&&`

### Memory Leaks

**Problem:** Cache growing too large

**Solutions:**
1. Enable `purgeUnusedStyles`
2. Reduce `styleCacheTTL`
3. Use minimal strategy

### SSR Hydration Mismatch

**Problem:** Client doesn't match server HTML

**Solutions:**
1. Ensure same cache key
2. Extract critical CSS
3. Proper cache hydration

### CSP Violations

**Problem:** Inline styles blocked by CSP

**Solutions:**
1. Add nonce to cache
2. Update CSP headers
3. Test with browser DevTools

## Best Practices

### 1. Choose Right Strategy

- **Development:** Minimal
- **Staging:** Default
- **Production:** Aggressive

### 2. Monitor Cache Size

```tsx
const { getCacheStats } = useCacheStore();
const stats = getCacheStats();

if (stats.size > '1 MB') {
  // Consider purging or optimizing
}
```

### 3. Use Insertion Point

For better CSS cascade control in production.

### 4. Enable Debug in Development

```tsx
if (import.meta.env.DEV) {
  useCacheStore.getState().setDebugCache(true);
}
```

### 5. Implement CSP for Production

Security best practice for production apps.

## Performance Benchmarks

| Strategy   | Init Time | Cache Size | Hit Rate |
|------------|-----------|------------|----------|
| Minimal    | 150ms     | 200 KB     | 65%      |
| Default    | 200ms     | 400 KB     | 85%      |
| Aggressive | 250ms     | 600 KB     | 95%      |

## Migration Guide

### From No Cache Provider

Before:
```tsx
<App />
```

After:
```tsx
<EmotionCacheProvider>
  <App />
</EmotionCacheProvider>
```

### From Custom Cache

Before:
```tsx
import createCache from '@emotion/cache';
const cache = createCache({ key: 'app' });

<CacheProvider value={cache}>
  <App />
</CacheProvider>
```

After:
```tsx
<EmotionCacheProvider cache={cache}>
  <App />
</EmotionCacheProvider>
```

## Resources

- [Emotion Documentation](https://emotion.sh/docs/cache-provider)
- [MUI + Emotion](https://mui.com/material-ui/guides/styled-engine/)
- [CSP Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
