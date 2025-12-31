import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// UI Preferences Types
export type Density = 'comfortable' | 'compact' | 'spacious';
export type ViewMode = 'grid' | 'list' | 'table';
export type SidebarPosition = 'left' | 'right';

export interface UIPreferences {
  // Layout preferences
  sidebarCollapsed: boolean;
  sidebarPosition: SidebarPosition;

  // View preferences
  defaultViewMode: ViewMode;
  density: Density;

  // Font preferences
  fontSize: number; // 14-20px

  // Animation preferences
  reducedMotion: boolean;

  // Recent items
  recentPages: string[];
  maxRecentPages: number;

  // Feature flags
  enableExperimentalFeatures: boolean;

  // Custom settings
  customSettings: Record<string, any>;
}

interface UIStore extends UIPreferences {
  // Sidebar actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarPosition: (position: SidebarPosition) => void;

  // View actions
  setViewMode: (mode: ViewMode) => void;
  setDensity: (density: Density) => void;

  // Font actions
  setFontSize: (size: number) => void;
  increaseFontSize: () => void;
  decreaseFontSize: () => void;

  // Motion actions
  setReducedMotion: (reduced: boolean) => void;

  // Recent pages
  addRecentPage: (path: string) => void;
  clearRecentPages: () => void;

  // Custom settings
  setCustomSetting: (key: string, value: any) => void;
  getCustomSetting: (key: string) => any;

  // Reset
  resetToDefaults: () => void;
}

const defaultPreferences: UIPreferences = {
  sidebarCollapsed: false,
  sidebarPosition: 'left',
  defaultViewMode: 'grid',
  density: 'comfortable',
  fontSize: 16,
  reducedMotion: false,
  recentPages: [],
  maxRecentPages: 10,
  enableExperimentalFeatures: false,
  customSettings: {},
};

export const useUIStore = create<UIStore>()(
  persist(
    (set, get) => ({
      ...defaultPreferences,

      // Sidebar actions
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),

      setSidebarPosition: (position) =>
        set({ sidebarPosition: position }),

      // View actions
      setViewMode: (mode) =>
        set({ defaultViewMode: mode }),

      setDensity: (density) => {
        set({ density });

        // Update CSS Variables for density
        const root = document.documentElement;
        const densityMap = {
          compact: { spacing: '4px', padding: '8px' },
          comfortable: { spacing: '8px', padding: '16px' },
          spacious: { spacing: '12px', padding: '24px' },
        };

        const values = densityMap[density];
        root.style.setProperty('--ui-density-spacing', values.spacing);
        root.style.setProperty('--ui-density-padding', values.padding);
      },

      // Font actions
      setFontSize: (size) => {
        const clampedSize = Math.max(14, Math.min(20, size));
        set({ fontSize: clampedSize });

        // Update CSS Variable
        document.documentElement.style.setProperty(
          '--ui-font-size',
          `${clampedSize}px`
        );
      },

      increaseFontSize: () => {
        const { fontSize } = get();
        get().setFontSize(fontSize + 1);
      },

      decreaseFontSize: () => {
        const { fontSize } = get();
        get().setFontSize(fontSize - 1);
      },

      // Motion actions
      setReducedMotion: (reduced) => {
        set({ reducedMotion: reduced });

        // Update CSS Variable
        document.documentElement.style.setProperty(
          '--ui-transition-duration',
          reduced ? '0ms' : '300ms'
        );
      },

      // Recent pages
      addRecentPage: (path) =>
        set((state) => {
          const filtered = state.recentPages.filter((p) => p !== path);
          const updated = [path, ...filtered].slice(0, state.maxRecentPages);
          return { recentPages: updated };
        }),

      clearRecentPages: () =>
        set({ recentPages: [] }),

      // Custom settings
      setCustomSetting: (key, value) =>
        set((state) => ({
          customSettings: {
            ...state.customSettings,
            [key]: value,
          },
        })),

      getCustomSetting: (key) => {
        return get().customSettings[key];
      },

      // Reset
      resetToDefaults: () => {
        set(defaultPreferences);

        // Reset CSS Variables
        const root = document.documentElement;
        root.style.removeProperty('--ui-density-spacing');
        root.style.removeProperty('--ui-density-padding');
        root.style.removeProperty('--ui-font-size');
        root.style.removeProperty('--ui-transition-duration');
      },
    }),
    {
      name: 'ui-preferences',
      // Only persist these fields
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        sidebarPosition: state.sidebarPosition,
        defaultViewMode: state.defaultViewMode,
        density: state.density,
        fontSize: state.fontSize,
        reducedMotion: state.reducedMotion,
        recentPages: state.recentPages,
        enableExperimentalFeatures: state.enableExperimentalFeatures,
        customSettings: state.customSettings,
      }),
    }
  )
);
