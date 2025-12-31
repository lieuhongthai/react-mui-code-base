import type { ReactNode } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import HomeIcon from '@mui/icons-material/Home';
import TodoIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import { Link } from '@tanstack/react-router';
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
          <Toolbar sx={{ justifyContent: 'space-between', gap: 2 }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexGrow: 1, ml: 4 }}>
              <Button
                component={Link}
                to="/"
                startIcon={<HomeIcon />}
                color="inherit"
                size="small"
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/todos"
                startIcon={<TodoIcon />}
                color="inherit"
                size="small"
              >
                Todos
              </Button>
              <Button
                component={Link}
                to="/public"
                startIcon={<PublicIcon />}
                color="inherit"
                size="small"
              >
                Public
              </Button>
              <Button
                component={Link}
                to="/private"
                startIcon={<LockIcon />}
                color="inherit"
                size="small"
              >
                Private
              </Button>
            </Stack>

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
