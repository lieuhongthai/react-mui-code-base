# UI Caching & Preferences System

A comprehensive UI caching system built on top of MUI v7's CSS Variables, providing persistent user preferences with zero re-renders.

## Architecture

```
┌─────────────────────────────────────────────┐
│           User Preferences                   │
│  (Stored in localStorage via Zustand)       │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│         CSS Variables Layer                  │
│   --ui-density-spacing                       │
│   --ui-density-padding                       │
│   --ui-font-size                            │
│   --ui-transition-duration                  │
└─────────────────┬───────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────┐
│            MUI Components                    │
│  (Use CSS Variables directly)                │
└─────────────────────────────────────────────┘
```

## Features

### 1. Layout Preferences
- **Sidebar State**: Collapsed/Expanded
- **Sidebar Position**: Left/Right
- **Persisted**: Yes

### 2. View Preferences
- **View Mode**: Grid/List/Table
- **Density**: Compact/Comfortable/Spacious
- **Persisted**: Yes
- **CSS Variables**:
  - `--ui-density-spacing`
  - `--ui-density-padding`

### 3. Typography Preferences
- **Font Size**: 14-20px
- **Persisted**: Yes
- **CSS Variable**: `--ui-font-size`

### 4. Accessibility
- **Reduced Motion**: On/Off
- **Auto-detect**: System preference
- **CSS Variable**: `--ui-transition-duration`

### 5. Recent Activity
- **Recent Pages**: Last 10 visited pages
- **Persisted**: Yes
- **Auto-cleanup**: Keeps only latest 10

## Usage

### Basic Setup

```tsx
// main.tsx
import { UIProvider } from '@/providers/UIProvider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <UIProvider>  {/* Add UIProvider here */}
          <RouterProvider router={router} />
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
```

### Using UI Preferences

```tsx
import { useUIStore } from '@/stores/uiStore';

function MyComponent() {
  const {
    density,
    fontSize,
    setDensity,
    setFontSize,
  } = useUIStore();

  return (
    <Box sx={{
      padding: 'var(--ui-density-padding)',
      fontSize: 'var(--ui-font-size)'
    }}>
      Current density: {density}
    </Box>
  );
}
```

### Track Recent Pages

```tsx
import { useRecentPage } from '@/hooks/useUIPreferences';

function ProductPage() {
  // Automatically adds this page to recent pages
  useRecentPage('/products/123');

  return <div>Product Details</div>;
}
```

### Custom Settings

```tsx
import { useUIStore } from '@/stores/uiStore';

function MyComponent() {
  const { setCustomSetting, getCustomSetting } = useUIStore();

  // Save custom preference
  setCustomSetting('tableColumnsOrder', ['name', 'date', 'status']);

  // Retrieve custom preference
  const columnsOrder = getCustomSetting('tableColumnsOrder');
}
```

## CSS Variables Reference

All UI preferences are exposed as CSS Variables:

| Variable | Values | Description |
|----------|--------|-------------|
| `--ui-density-spacing` | 4px, 8px, 12px | Spacing between elements |
| `--ui-density-padding` | 8px, 16px, 24px | Component padding |
| `--ui-font-size` | 14-20px | Base font size |
| `--ui-transition-duration` | 0ms, 300ms | Animation duration |

### Using in CSS/SCSS

```css
.my-component {
  padding: var(--ui-density-padding);
  font-size: var(--ui-font-size);
  transition: all var(--ui-transition-duration);
}

.my-card {
  gap: var(--ui-density-spacing);
}
```

### Using in MUI sx prop

```tsx
<Box
  sx={{
    p: 'var(--ui-density-padding)',
    fontSize: 'var(--ui-font-size)',
    transition: 'all var(--ui-transition-duration)',
  }}
>
  Content
</Box>
```

## Performance Benefits

### Zero Re-renders
When UI preferences change, only CSS Variables update. React components don't re-render:

```tsx
// ❌ Old approach - causes re-render
const { density } = useUIStore();
<Box sx={{ p: density === 'compact' ? 1 : 2 }}>

// ✅ New approach - no re-render
<Box sx={{ p: 'var(--ui-density-padding)' }}>
```

### Instant Updates
CSS Variables update immediately in the browser without JavaScript:

```tsx
// Click handler
setDensity('compact');
// CSS Variables update instantly across ALL components
// No React reconciliation needed
```

### Smaller Bundle Size
CSS Variables reduce JavaScript bundle size:
- No need to pass props through component tree
- No context re-renders
- Fewer style recalculations

## Storage

All preferences are stored in `localStorage` with key `ui-preferences`:

```json
{
  "state": {
    "sidebarCollapsed": false,
    "sidebarPosition": "left",
    "defaultViewMode": "grid",
    "density": "comfortable",
    "fontSize": 16,
    "reducedMotion": false,
    "recentPages": ["/products", "/dashboard"],
    "customSettings": {}
  },
  "version": 0
}
```

## Examples

### Density Example

```tsx
function DensityDemo() {
  const { density, setDensity } = useUIStore();

  return (
    <Stack spacing="var(--ui-density-spacing)">
      <Button onClick={() => setDensity('compact')}>
        Compact
      </Button>
      <Button onClick={() => setDensity('comfortable')}>
        Comfortable
      </Button>
      <Button onClick={() => setDensity('spacious')}>
        Spacious
      </Button>
    </Stack>
  );
}
```

### Font Size Example

```tsx
function FontSizeControls() {
  const { fontSize, increaseFontSize, decreaseFontSize } = useUIStore();

  return (
    <Box>
      <Button onClick={decreaseFontSize}>A-</Button>
      <Typography sx={{ fontSize: 'var(--ui-font-size)' }}>
        Current size: {fontSize}px
      </Typography>
      <Button onClick={increaseFontSize}>A+</Button>
    </Box>
  );
}
```

### Recent Pages Example

```tsx
function RecentPagesList() {
  const { recentPages, clearRecentPages } = useUIStore();

  return (
    <Box>
      <Typography variant="h6">Recent Pages</Typography>
      {recentPages.map((page) => (
        <Chip key={page} label={page} />
      ))}
      <Button onClick={clearRecentPages}>Clear</Button>
    </Box>
  );
}
```

## Best Practices

### 1. Use CSS Variables for Dynamic Styles
```tsx
// ✅ Good
<Box sx={{ p: 'var(--ui-density-padding)' }} />

// ❌ Avoid
const { density } = useUIStore();
<Box sx={{ p: density === 'compact' ? 1 : 2 }} />
```

### 2. Initialize Early
```tsx
// Place UIProvider high in the tree
<ThemeProvider>
  <UIProvider>
    <App />
  </UIProvider>
</ThemeProvider>
```

### 3. Use Custom Settings for Complex State
```tsx
// Store complex UI state
setCustomSetting('dashboardLayout', {
  widgets: ['chart1', 'table2'],
  positions: { chart1: { x: 0, y: 0 } }
});
```

### 4. Clean Up Recent Items
```tsx
// Periodically clean up
useEffect(() => {
  const cleanup = setInterval(() => {
    // Keep only items from last 7 days
  }, 24 * 60 * 60 * 1000);

  return () => clearInterval(cleanup);
}, []);
```

## Accessibility

### Reduced Motion Support

The system automatically detects system preference:

```tsx
// Automatically applied on load
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;
```

Users can override:

```tsx
<Switch
  checked={reducedMotion}
  onChange={(e) => setReducedMotion(e.target.checked)}
/>
```

## Migration from Old Code

### Before (Props-based)
```tsx
function Layout({ density }: { density: Density }) {
  return (
    <Box sx={{
      p: density === 'compact' ? 1 : 2
    }}>
      {/* Re-renders when density changes */}
    </Box>
  );
}
```

### After (CSS Variables)
```tsx
function Layout() {
  return (
    <Box sx={{
      p: 'var(--ui-density-padding)'
    }}>
      {/* No re-renders! */}
    </Box>
  );
}
```

## Troubleshooting

### CSS Variables not applying?

1. Check UIProvider is mounted:
```tsx
<UIProvider>
  <App />
</UIProvider>
```

2. Check console for CSS Variable values:
```js
getComputedStyle(document.documentElement)
  .getPropertyValue('--ui-density-padding')
```

3. Verify localStorage has data:
```js
localStorage.getItem('ui-preferences')
```

### Preferences not persisting?

Check Zustand persist middleware is working:
```tsx
// Should see persist rehydration
console.log('Rehydrated:', useUIStore.getState());
```

## Advanced Usage

### Creating Custom CSS Variables

```tsx
// In your component
useEffect(() => {
  document.documentElement.style.setProperty(
    '--custom-var',
    'value'
  );
}, []);
```

### Syncing with Backend

```tsx
const { customSettings, setCustomSetting } = useUIStore();

// Load from backend
useEffect(() => {
  api.getUserPreferences().then((prefs) => {
    Object.entries(prefs).forEach(([key, value]) => {
      setCustomSetting(key, value);
    });
  });
}, []);

// Save to backend
useEffect(() => {
  api.saveUserPreferences(customSettings);
}, [customSettings]);
```

## Future Enhancements

- [ ] Multi-device sync via backend
- [ ] Preset themes (Professional, Colorful, High Contrast)
- [ ] Per-page preferences
- [ ] A/B testing integration
- [ ] Analytics tracking for popular preferences
