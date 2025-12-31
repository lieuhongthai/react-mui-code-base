import { Typography, Box, Paper, Button } from '@mui/material';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import PublicIcon from '@mui/icons-material/Public';
import { Layout } from '@/components/Layout';

export function PublicPage() {
  const { t } = useTranslation();

  return (
    <Layout>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PublicIcon sx={{ fontSize: 40, mr: 2, color: 'primary.main' }} />
          <Typography variant="h3" component="h1">
            {t('pages.public')}
          </Typography>
        </Box>

        <Typography variant="body1" paragraph>
          This is a public page that can be accessed by anyone without authentication.
        </Typography>

        <Typography variant="body1" paragraph>
          Public pages are great for:
        </Typography>

        <Box component="ul" sx={{ mb: 3 }}>
          <li>Landing pages</li>
          <li>Product information</li>
          <li>Contact forms</li>
          <li>Blog posts</li>
          <li>Documentation</li>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button component={Link} to="/" variant="contained">
            {t('pages.home')}
          </Button>
          <Button component={Link} to="/login" variant="outlined">
            {t('common.login')}
          </Button>
        </Box>
      </Paper>
    </Layout>
  );
}
