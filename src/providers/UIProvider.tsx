import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useUIPreferences } from '@/hooks/useUIPreferences';

interface UIProviderProps {
  children: ReactNode;
}

/**
 * UIProvider initializes UI preferences and applies CSS Variables
 * Place this high in the component tree, inside ThemeProvider
 */
export function UIProvider({ children }: UIProviderProps) {
  // This hook applies all UI preferences as CSS Variables
  useUIPreferences();

  // Detect system preference for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList) => {
      // Only auto-apply if user hasn't manually set it
      const stored = localStorage.getItem('ui-preferences');
      if (!stored || !stored.includes('reducedMotion')) {
        document.documentElement.style.setProperty(
          '--ui-transition-duration',
          e.matches ? '0ms' : '300ms'
        );
      }
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return <>{children}</>;
}
