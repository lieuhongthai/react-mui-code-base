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
  const { mode } = useThemeStore();
  const { setMode } = useColorScheme();

  // Sync Zustand -> MUI (one-way sync to avoid infinite loop)
  useEffect(() => {
    setMode(mode);
  }, [mode, setMode]);

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
