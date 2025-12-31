import { useEffect } from 'react';
import { useUIStore } from '@/stores/uiStore';

/**
 * Hook to apply UI preferences as CSS Variables
 * This ensures preferences are applied on mount and when changed
 */
export function useUIPreferences() {
  const { density, fontSize, reducedMotion } = useUIStore();

  // Apply CSS Variables on mount and when preferences change
  useEffect(() => {
    const root = document.documentElement;

    // Density
    const densityMap = {
      compact: { spacing: '4px', padding: '8px' },
      comfortable: { spacing: '8px', padding: '16px' },
      spacious: { spacing: '12px', padding: '24px' },
    };

    const densityValues = densityMap[density];
    root.style.setProperty('--ui-density-spacing', densityValues.spacing);
    root.style.setProperty('--ui-density-padding', densityValues.padding);

    // Font size
    root.style.setProperty('--ui-font-size', `${fontSize}px`);

    // Motion
    root.style.setProperty(
      '--ui-transition-duration',
      reducedMotion ? '0ms' : '300ms'
    );
  }, [density, fontSize, reducedMotion]);

  return useUIStore();
}

/**
 * Hook to track and cache recent page visits
 */
export function useRecentPage(path: string) {
  const { addRecentPage } = useUIStore();

  useEffect(() => {
    addRecentPage(path);
  }, [path, addRecentPage]);
}
