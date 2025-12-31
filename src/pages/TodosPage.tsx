import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import { TodoList } from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';
import type { TodoFilters } from '@/types/todo';

export function TodosPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<TodoFilters>({
    _limit: 20,
  });

  const { data: todos = [], isLoading, error, refetch } = useTodos(filters);

  const handleFilterChange = (key: keyof TodoFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === '' ? undefined : value,
    }));
  };

  const handleCreateClick = () => {
    navigate({ to: '/todos/create' });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" component="h1" fontWeight={600}>
            Todo List
          </Typography>
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={() => refetch()}
              disabled={isLoading}
            >
              Refresh
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreateClick}
            >
              Create Todo
            </Button>
          </Stack>
        </Stack>

        <Typography variant="body1" color="text.secondary">
          Manage your todos with full CRUD operations
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Filters
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={filters.completed ?? ''}
              label="Status"
              onChange={(e) =>
                handleFilterChange('completed', e.target.value)
              }
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="true">Completed</MenuItem>
              <MenuItem value="false">Active</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="User ID"
            type="number"
            value={filters.userId ?? ''}
            onChange={(e) =>
              handleFilterChange(
                'userId',
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            sx={{ width: 150 }}
          />

          <TextField
            size="small"
            label="Limit"
            type="number"
            value={filters._limit ?? 20}
            onChange={(e) =>
              handleFilterChange(
                '_limit',
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
            sx={{ width: 150 }}
          />
        </Stack>
      </Paper>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        This demo uses JSONPlaceholder API. Changes are simulated and won't persist.
      </Alert>

      {/* Todo List */}
      <TodoList
        todos={todos}
        isLoading={isLoading}
        error={error?.message}
      />
    </Container>
  );
}
