import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useNavigate } from '@tanstack/react-router';
import { TodoList } from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';
import { useQueryFilters, serializers } from '@/hooks/useQueryFilters';
import type { TodoFilters } from '@/types/todo';

export function TodosPage() {
  const navigate = useNavigate();

  // Use query filters hook to persist filters in URL
  const { filters, setFilter, resetFilters } = useQueryFilters<TodoFilters>({
    defaultValues: {
      completed: undefined,
      userId: undefined,
      _limit: 20,
    },
    serializers: {
      completed: serializers.optionalBoolean(),
      userId: serializers.optionalNumber(),
      _limit: {
        serialize: (value) => String(value ?? 20),
        deserialize: (value) => {
          const num = parseInt(value, 10);
          return isNaN(num) ? 20 : num;
        },
        defaultValue: 20,
      },
    },
  });

  const { data: todos = [], isLoading, error, refetch } = useTodos(filters);

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
              startIcon={<FilterListOffIcon />}
              onClick={resetFilters}
              size="small"
            >
              Clear Filters
            </Button>
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
              value={
                filters.completed === undefined
                  ? ''
                  : filters.completed
                  ? 'true'
                  : 'false'
              }
              label="Status"
              onChange={(e) => {
                const value = e.target.value as 'true' | 'false' | '';
                setFilter(
                  'completed',
                  value === '' ? undefined : value === 'true'
                );
              }}
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
              setFilter(
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
              setFilter(
                '_limit',
                e.target.value ? parseInt(e.target.value) : 20
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
