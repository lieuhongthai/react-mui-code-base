import { Typography, Box, Paper, Button, Chip, Stack } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import LockIcon from '@mui/icons-material/Lock';
import { useAuth } from '@/hooks/useAuth';
import { Layout } from '@/components/Layout';

export function PrivatePage() {
  const { t } = useTranslation();
  const { user, hasRole, hasAnyRole } = useAuth();

  return (
    <Layout>
      <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <LockIcon sx={{ fontSize: 40, mr: 2, color: 'secondary.main' }} />
            <Typography variant="h3" component="h1">
              {t('pages.private')}
            </Typography>
          </Box>

          <Typography variant="body1" paragraph>
            This is a private page that requires authentication to access.
            Only authenticated users can see this content.
          </Typography>

          {user && (
            <Box sx={{ my: 3 }}>
              <Typography variant="h6" gutterBottom>
                User Information:
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Name:</strong> {user.name}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>Email:</strong> {user.email}
              </Typography>
              <Typography variant="body2" paragraph>
                <strong>User ID:</strong> {user.id}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>
                  <strong>Roles:</strong>
                </Typography>
                <Stack direction="row" spacing={1}>
                  {user.roles.map((role) => (
                    <Chip key={role} label={role} color="primary" size="small" />
                  ))}
                </Stack>
              </Box>

              <Box sx={{ my: 3, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Role-based Access Examples:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Has 'admin' role: {hasRole('admin') ? '✅ Yes' : '❌ No'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Has 'user' role: {hasRole('user') ? '✅ Yes' : '❌ No'}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Has any of ['admin', 'moderator']: {hasAnyRole(['admin', 'moderator']) ? '✅ Yes' : '❌ No'}
                </Typography>
              </Box>
            </Box>
          )}

          <Typography variant="body1" paragraph>
            Private pages can include:
          </Typography>

          <Box component="ul" sx={{ mb: 3 }}>
            <li>User dashboards</li>
            <li>Account settings</li>
            <li>Personal data</li>
            <li>Admin panels</li>
            <li>Protected resources</li>
          </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button component={Link} to="/" variant="contained">
              {t('pages.home')}
            </Button>
            <Button component={Link} to="/public" variant="outlined">
              {t('pages.public')}
            </Button>
          </Box>
      </Paper>
    </Layout>
  );
}
