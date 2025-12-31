import type { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  title?: string;
  showAppBar?: boolean;
}

export function Layout({
  children,
  maxWidth = 'md',
  title = 'React MUI App',
  showAppBar = true
}: LayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {showAppBar && (
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
            <ThemeToggle />
          </Toolbar>
        </AppBar>
      )}

      <Container
        maxWidth={maxWidth}
        sx={{ flex: 1, py: 4, display: 'flex', flexDirection: 'column' }}
      >
        {children}
      </Container>
    </Box>
  );
}
