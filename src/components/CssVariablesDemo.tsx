import { Box, Typography, Paper, Stack } from '@mui/material';

/**
 * Demo component showing how to use MUI CSS Variables
 * CSS Variables are automatically generated from the theme
 */
export function CssVariablesDemo() {
  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: 'auto', my: 4 }}>
      <Typography variant="h5" gutterBottom>
        CSS Variables Demo
      </Typography>

      <Typography variant="body2" color="text.secondary" paragraph>
        All styles below use CSS Variables that automatically update when switching themes
      </Typography>

      <Stack spacing={2}>
        {/* Using CSS Variables in sx prop */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'var(--mui-palette-primary-main)',
            color: 'var(--mui-palette-primary-contrastText)',
            borderRadius: 'var(--mui-shape-borderRadius)',
          }}
        >
          Using --mui-palette-primary-main
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'var(--mui-palette-secondary-main)',
            color: 'var(--mui-palette-secondary-contrastText)',
            borderRadius: 'var(--mui-shape-borderRadius)',
          }}
        >
          Using --mui-palette-secondary-main
        </Box>

        <Box
          sx={{
            p: 2,
            bgcolor: 'var(--mui-palette-background-paper)',
            color: 'var(--mui-palette-text-primary)',
            border: '1px solid var(--mui-palette-divider)',
            borderRadius: 'var(--mui-shape-borderRadius)',
          }}
        >
          Using --mui-palette-background-paper
        </Box>

        {/* Color chips */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Color Palette:
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {[
              'primary',
              'secondary',
              'error',
              'warning',
              'info',
              'success',
            ].map((color) => (
              <Box
                key={color}
                sx={{
                  width: 80,
                  height: 40,
                  bgcolor: `var(--mui-palette-${color}-main)`,
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: `var(--mui-palette-${color}-contrastText)`,
                  fontSize: '0.75rem',
                  fontWeight: 'bold',
                  textTransform: 'capitalize',
                }}
              >
                {color}
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Typography */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Typography Variables:
          </Typography>
          <Typography
            sx={{
              fontFamily: 'var(--mui-typography-fontFamily)',
              fontSize: 'var(--mui-typography-h6-fontSize)',
              fontWeight: 'var(--mui-typography-h6-fontWeight)',
            }}
          >
            Custom styled with CSS Variables
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          mt: 3,
          p: 2,
          bgcolor: 'var(--mui-palette-background-default)',
          borderRadius: 1,
          fontFamily: 'monospace',
          fontSize: '0.875rem',
        }}
      >
        <Typography variant="caption" display="block" gutterBottom>
          Inspect element to see CSS Variables in DevTools:
        </Typography>
        <code style={{ fontSize: '0.75rem' }}>
          --mui-palette-primary-main
          <br />
          --mui-palette-background-paper
          <br />
          --mui-shape-borderRadius
        </code>
      </Box>
    </Paper>
  );
}
