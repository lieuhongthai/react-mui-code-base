import { useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  ThemeProvider as MuiThemeProvider,
  useColorScheme,
} from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { theme } from './theme';
import { useThemeStore } from '@/stores/themeStore';

interface ThemeProviderProps {
  children: ReactNode;
}

// Internal component to sync MUI color scheme with Zustand store
function ThemeSync() {
  const { mode, setTheme } = useThemeStore();
  const { mode: muiMode, setMode } = useColorScheme();

  // Sync Zustand -> MUI
  useEffect(() => {
    if (muiMode !== mode) {
      setMode(mode);
    }
  }, [mode, muiMode, setMode]);

  // Sync MUI -> Zustand (when changed by MUI)
  useEffect(() => {
    if (muiMode && muiMode !== mode) {
      setTheme(muiMode as 'light' | 'dark');
    }
  }, [muiMode, mode, setTheme]);

  return null;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MuiThemeProvider theme={theme} defaultMode="light">
      <CssBaseline enableColorScheme />
      <ThemeSync />
      {children}
    </MuiThemeProvider>
  );
}
