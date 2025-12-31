import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  ButtonGroup,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  Chip,
  TextField,
} from '@mui/material';
import {
  Speed,
  Storage,
  Delete,
  RestartAlt,
  BugReport,
} from '@mui/icons-material';
import { useCacheStore } from '@/stores/cacheStore';
import type { CacheStrategy } from '@/stores/cacheStore';

export function CacheSettings() {
  const {
    strategy,
    prefetchStyles,
    purgeUnusedStyles,
    styleCacheTTL,
    debugCache,
    useCustomInsertionPoint,
    setStrategy,
    setPrefetchStyles,
    setPurgeUnusedStyles,
    setStyleCacheTTL,
    setDebugCache,
    setUseCustomInsertionPoint,
    resetToDefaults,
    getCacheStats,
  } = useCacheStore();

  const stats = getCacheStats();

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Emotion Cache Settings
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        Emotion cache controls how CSS-in-JS styles are generated, cached, and injected.
        These settings persist across sessions.
      </Alert>

      <Stack spacing={3}>
        {/* Cache Strategy */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Cache Strategy
          </Typography>
          <ButtonGroup fullWidth>
            {(['default', 'aggressive', 'minimal'] as CacheStrategy[]).map((s) => (
              <Button
                key={s}
                variant={strategy === s ? 'contained' : 'outlined'}
                onClick={() => setStrategy(s)}
                sx={{ textTransform: 'capitalize' }}
              >
                {s}
              </Button>
            ))}
          </ButtonGroup>

          <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Typography variant="caption" display="block">
              <strong>Default:</strong> Balanced performance and cache size
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Aggressive:</strong> Maximum caching, best for production
            </Typography>
            <Typography variant="caption" display="block">
              <strong>Minimal:</strong> Less caching, best for development
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Prefetch Styles */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={prefetchStyles}
                onChange={(e) => setPrefetchStyles(e.target.checked)}
              />
            }
            label="Prefetch Styles"
          />
          <Typography variant="caption" display="block" color="text.secondary">
            Pre-generate and cache commonly used styles for faster rendering
          </Typography>
        </Box>

        {/* Purge Unused Styles */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={purgeUnusedStyles}
                onChange={(e) => setPurgeUnusedStyles(e.target.checked)}
              />
            }
            label="Purge Unused Styles"
          />
          <Typography variant="caption" display="block" color="text.secondary">
            Automatically remove unused styles from cache (reduces memory usage)
          </Typography>
        </Box>

        <Divider />

        {/* Custom Insertion Point */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={useCustomInsertionPoint}
                onChange={(e) => setUseCustomInsertionPoint(e.target.checked)}
              />
            }
            label="Use Custom Insertion Point"
          />
          <Typography variant="caption" display="block" color="text.secondary">
            Insert styles at custom location for better control over CSS cascade
          </Typography>
        </Box>

        <Divider />

        {/* Cache TTL */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Style Cache TTL (Time to Live)
          </Typography>
          <TextField
            type="number"
            value={styleCacheTTL / 60000} // Convert to minutes
            onChange={(e) => setStyleCacheTTL(Number(e.target.value) * 60000)}
            label="Minutes"
            size="small"
            inputProps={{ min: 1, max: 1440 }}
          />
          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 1 }}>
            How long to keep styles in cache. Current: {styleCacheTTL / 60000} minutes
          </Typography>
        </Box>

        <Divider />

        {/* Debug Mode */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={debugCache}
                onChange={(e) => setDebugCache(e.target.checked)}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Debug Cache
                <BugReport fontSize="small" />
              </Box>
            }
          />
          <Typography variant="caption" display="block" color="text.secondary">
            Log cache operations to console (development only)
          </Typography>
        </Box>

        <Divider />

        {/* Cache Stats */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Cache Statistics
          </Typography>
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Chip
              icon={<Storage />}
              label={`Size: ${stats.size}`}
              variant="outlined"
            />
            <Chip
              icon={<Speed />}
              label={`Hit Rate: ${stats.hitRate}%`}
              variant="outlined"
              color={stats.hitRate > 80 ? 'success' : 'default'}
            />
            <Chip
              label={`Cached: ${stats.cachedStyles}/${stats.totalStyles}`}
              variant="outlined"
            />
          </Stack>
        </Box>

        <Divider />

        {/* Actions */}
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            color="error"
            onClick={resetToDefaults}
            startIcon={<RestartAlt />}
          >
            Reset to Defaults
          </Button>

          <Button
            variant="outlined"
            color="warning"
            onClick={() => {
              // Clear cache
              if (window.confirm('This will clear all cached styles. Continue?')) {
                // Implementation would go here
                window.location.reload();
              }
            }}
            startIcon={<Delete />}
          >
            Clear Cache
          </Button>
        </Stack>

        {/* Technical Info */}
        <Box
          sx={{
            mt: 3,
            p: 2,
            bgcolor: 'background.default',
            borderRadius: 1,
            fontFamily: 'monospace',
            fontSize: '0.875rem',
          }}
        >
          <Typography variant="caption" display="block" gutterBottom>
            Emotion Cache Configuration:
          </Typography>
          <code>
            Key: mui
            <br />
            Prepend: {useCustomInsertionPoint ? 'true' : 'false'}
            <br />
            Strategy: {strategy}
            <br />
            TTL: {styleCacheTTL / 60000}m
            <br />
            Debug: {debugCache ? 'enabled' : 'disabled'}
          </code>
        </Box>

        {/* CSP Notice */}
        {typeof window !== 'undefined' && (
          <Alert severity="warning">
            <Typography variant="caption">
              <strong>CSP (Content Security Policy):</strong> If you have CSP enabled,
              make sure to set a nonce value for script and style tags. The nonce can be
              configured programmatically via <code>useCacheStore().setNonce()</code>
            </Typography>
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}
