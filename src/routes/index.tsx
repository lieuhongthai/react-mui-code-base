import { createFileRoute, Link } from '@tanstack/react-router';
import { Container, Typography, Box, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          {t('common.welcome')}
        </Typography>

        {isAuthenticated && user && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Hello, {user.name}!
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Roles: {user.roles.join(', ')}
            </Typography>
          </Box>
        )}

        <Stack spacing={2} direction="row" sx={{ mt: 3 }}>
          <Button
            component={Link}
            to="/public"
            variant="contained"
            color="primary"
          >
            {t('pages.public')}
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/private"
                variant="contained"
                color="secondary"
              >
                {t('pages.private')}
              </Button>
              <Button onClick={logout} variant="outlined" color="error">
                {t('common.logout')}
              </Button>
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              color="primary"
            >
              {t('common.login')}
            </Button>
          )}
        </Stack>
      </Box>
    </Container>
  );
}
