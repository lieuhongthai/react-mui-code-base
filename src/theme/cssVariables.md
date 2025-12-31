# Using MUI CSS Variables

With the new `colorSchemes` configuration, MUI automatically generates CSS variables for all theme tokens. This allows you to use theme values directly in your CSS/SCSS files.

## Available CSS Variables

All CSS variables are prefixed with `--mui-` by default.

### Colors

#### Primary Color
```css
background-color: var(--mui-palette-primary-main);
background-color: var(--mui-palette-primary-light);
background-color: var(--mui-palette-primary-dark);
color: var(--mui-palette-primary-contrastText);
```

#### Secondary Color
```css
background-color: var(--mui-palette-secondary-main);
background-color: var(--mui-palette-secondary-light);
background-color: var(--mui-palette-secondary-dark);
color: var(--mui-palette-secondary-contrastText);
```

#### Background
```css
background-color: var(--mui-palette-background-default);
background-color: var(--mui-palette-background-paper);
```

#### Text
```css
color: var(--mui-palette-text-primary);
color: var(--mui-palette-text-secondary);
color: var(--mui-palette-text-disabled);
```

### Typography
```css
font-family: var(--mui-typography-fontFamily);
font-weight: var(--mui-typography-h1-fontWeight);
```

### Shape
```css
border-radius: var(--mui-shape-borderRadius);
```

## Usage Examples

### In CSS/SCSS files
```css
.my-custom-component {
  background-color: var(--mui-palette-background-paper);
  color: var(--mui-palette-text-primary);
  border-radius: var(--mui-shape-borderRadius);
  padding: 16px;
}

.my-custom-button {
  background-color: var(--mui-palette-primary-main);
  color: var(--mui-palette-primary-contrastText);

  &:hover {
    background-color: var(--mui-palette-primary-dark);
  }
}
```

### In MUI sx prop
```tsx
<Box
  sx={{
    // MUI automatically resolves theme values
    bgcolor: 'primary.main',
    color: 'primary.contrastText',

    // Or use CSS variables directly
    bgcolor: 'var(--mui-palette-primary-main)',
  }}
>
  Content
</Box>
```

### In styled components
```tsx
import { styled } from '@mui/material/styles';

const CustomBox = styled('div')(({ theme }) => ({
  // Using theme object (recommended)
  backgroundColor: theme.palette.primary.main,

  // Or using CSS variables
  color: 'var(--mui-palette-primary-contrastText)',
}));
```

## Benefits of CSS Variables

1. **Automatic theme switching**: CSS variables update automatically when switching between light/dark modes
2. **Better performance**: No need to re-render components on theme change
3. **CSS-only styling**: Can use theme values in plain CSS files
4. **SSR-friendly**: Works seamlessly with server-side rendering
5. **Type-safe**: Full TypeScript support when using MUI components

## Theme Mode Switching

The theme mode is automatically synced with:
- Zustand store (`useThemeStore`)
- MUI's `useColorScheme` hook
- Browser's `localStorage` for persistence

### Using the theme toggle
```tsx
import { useThemeStore } from '@/stores/themeStore';

function MyComponent() {
  const { mode, toggleTheme } = useThemeStore();

  return (
    <button onClick={toggleTheme}>
      Current mode: {mode}
    </button>
  );
}
```

### Using MUI's useColorScheme
```tsx
import { useColorScheme } from '@mui/material/styles';

function MyComponent() {
  const { mode, setMode } = useColorScheme();

  return (
    <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
      Toggle theme
    </button>
  );
}
```

## Customizing CSS Variable Prefix

You can customize the CSS variable prefix in `theme.ts`:

```typescript
export const theme = extendTheme({
  cssVarPrefix: 'my-app', // Changes prefix to --my-app-*
  // ...
});
```

## Browser DevTools

Inspect CSS variables in browser DevTools:
1. Open DevTools
2. Go to Elements tab
3. Select `:root` or `html` element
4. Check the Styles panel
5. You'll see all `--mui-*` CSS variables with their current values
