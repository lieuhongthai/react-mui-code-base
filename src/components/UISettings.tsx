import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  ButtonGroup,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Chip,
  Alert,
} from '@mui/material';
import {
  GridView,
  ViewList,
  TableChart,
  ZoomIn,
  ZoomOut,
  RestartAlt,
} from '@mui/icons-material';
import { useUIStore } from '@/stores/uiStore';
import type { Density } from '@/stores/uiStore';

export function UISettings() {
  const {
    defaultViewMode,
    density,
    fontSize,
    reducedMotion,
    sidebarCollapsed,
    recentPages,
    setViewMode,
    setDensity,
    setFontSize,
    increaseFontSize,
    decreaseFontSize,
    setReducedMotion,
    toggleSidebar,
    clearRecentPages,
    resetToDefaults,
  } = useUIStore();

  return (
    <Paper sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        UI Preferences (Cached)
      </Typography>

      <Alert severity="info" sx={{ mb: 3 }}>
        All preferences are automatically saved to localStorage and persist across sessions.
        CSS Variables are used for instant updates without re-renders.
      </Alert>

      <Stack spacing={3}>
        {/* View Mode */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Default View Mode
          </Typography>
          <ButtonGroup>
            <Button
              variant={defaultViewMode === 'grid' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('grid')}
              startIcon={<GridView />}
            >
              Grid
            </Button>
            <Button
              variant={defaultViewMode === 'list' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('list')}
              startIcon={<ViewList />}
            >
              List
            </Button>
            <Button
              variant={defaultViewMode === 'table' ? 'contained' : 'outlined'}
              onClick={() => setViewMode('table')}
              startIcon={<TableChart />}
            >
              Table
            </Button>
          </ButtonGroup>
        </Box>

        <Divider />

        {/* Density */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Density (affects spacing & padding)
          </Typography>
          <ButtonGroup>
            {(['compact', 'comfortable', 'spacious'] as Density[]).map((d) => (
              <Button
                key={d}
                variant={density === d ? 'contained' : 'outlined'}
                onClick={() => setDensity(d)}
                sx={{ textTransform: 'capitalize' }}
              >
                {d}
              </Button>
            ))}
          </ButtonGroup>

          <Box
            sx={{
              mt: 2,
              p: 'var(--ui-density-padding, 16px)',
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            <Typography variant="body2">
              This box uses <code>var(--ui-density-padding)</code>
            </Typography>
          </Box>
        </Box>

        <Divider />

        {/* Font Size */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Font Size: {fontSize}px
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              size="small"
              variant="outlined"
              onClick={decreaseFontSize}
              disabled={fontSize <= 14}
              startIcon={<ZoomOut />}
            >
              Smaller
            </Button>

            <Slider
              value={fontSize}
              onChange={(_, value) => setFontSize(value as number)}
              min={14}
              max={20}
              step={1}
              marks
              sx={{ flex: 1 }}
            />

            <Button
              size="small"
              variant="outlined"
              onClick={increaseFontSize}
              disabled={fontSize >= 20}
              startIcon={<ZoomIn />}
            >
              Larger
            </Button>
          </Stack>

          <Typography
            sx={{
              mt: 2,
              fontSize: 'var(--ui-font-size, 16px)',
              p: 2,
              bgcolor: 'background.default',
              borderRadius: 1,
            }}
          >
            This text uses <code>var(--ui-font-size)</code> CSS Variable
          </Typography>
        </Box>

        <Divider />

        {/* Motion */}
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={reducedMotion}
                onChange={(e) => setReducedMotion(e.target.checked)}
              />
            }
            label="Reduce Motion (for accessibility)"
          />
          <Typography variant="caption" display="block" color="text.secondary">
            Sets --ui-transition-duration to {reducedMotion ? '0ms' : '300ms'}
          </Typography>
        </Box>

        <Divider />

        {/* Sidebar */}
        <Box>
          <FormControlLabel
            control={
              <Switch checked={sidebarCollapsed} onChange={toggleSidebar} />
            }
            label="Sidebar Collapsed"
          />
        </Box>

        <Divider />

        {/* Recent Pages */}
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Recent Pages ({recentPages.length}/10)
          </Typography>
          {recentPages.length > 0 ? (
            <>
              <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                {recentPages.map((page, index) => (
                  <Chip key={index} label={page} size="small" />
                ))}
              </Stack>
              <Button size="small" variant="outlined" onClick={clearRecentPages}>
                Clear Recent
              </Button>
            </>
          ) : (
            <Typography variant="body2" color="text.secondary">
              No recent pages
            </Typography>
          )}
        </Box>

        <Divider />

        {/* Reset */}
        <Box>
          <Button
            variant="outlined"
            color="error"
            onClick={resetToDefaults}
            startIcon={<RestartAlt />}
          >
            Reset to Defaults
          </Button>
        </Box>

        {/* CSS Variables Info */}
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
            Active CSS Variables:
          </Typography>
          <code>
            --ui-density-spacing: {density === 'compact' ? '4px' : density === 'comfortable' ? '8px' : '12px'}
            <br />
            --ui-density-padding: {density === 'compact' ? '8px' : density === 'comfortable' ? '16px' : '24px'}
            <br />
            --ui-font-size: {fontSize}px
            <br />
            --ui-transition-duration: {reducedMotion ? '0ms' : '300ms'}
          </code>
        </Box>
      </Stack>
    </Paper>
  );
}
