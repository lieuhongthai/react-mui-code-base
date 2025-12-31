import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from '@tanstack/react-router';
import { TodoList } from '@/components/TodoList';
import { useTodos } from '@/hooks/useTodos';
import { useQueryFilters, serializers } from '@/hooks/useQueryFilters';
import {
  todoSearchSchema,
  todoSearchDefaults,
  type TodoSearchFormData,
} from '@/schemas/todoSearchSchema';
import type { TodoFilters } from '@/types/todo';

export function TodosPage() {
  const navigate = useNavigate();

  // Use query filters hook to persist filters in URL
  const { filters, setFilters, resetFilters } = useQueryFilters<TodoFilters>({
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

  // React Hook Form with Zod validation
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TodoSearchFormData>({
    resolver: zodResolver(todoSearchSchema) as any,
    defaultValues: todoSearchDefaults,
  });

  // Initialize form with URL filters on mount
  useEffect(() => {
    reset({
      completed: filters.completed === undefined
        ? ''
        : filters.completed
        ? 'true'
        : 'false',
      userId: filters.userId?.toString() ?? '',
      limit: filters._limit?.toString() ?? '20',
    });
  }, []); // Only on mount

  const { data: todos = [], isLoading, error, refetch } = useTodos(filters);

  // Handle form submission - only apply filters on Search
  const onSubmit = (data: TodoSearchFormData) => {
    setFilters({
      completed:
        data.completed === '' ? undefined : data.completed === 'true',
      userId: data.userId ? parseInt(data.userId) : undefined,
      _limit: data.limit ? parseInt(data.limit) : 20,
    });
  };

  // Handle clear filters
  const handleClearFilters = () => {
    reset(todoSearchDefaults);
    resetFilters();
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

      {/* Search Form with React Hook Form + Zod Validation */}
      <Paper
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ p: 3, mb: 3 }}
      >
        <Typography variant="h6" gutterBottom>
          Search & Filter
        </Typography>

        <Stack spacing={3}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            alignItems="flex-start"
          >
            {/* Status Filter */}
            <Controller
              name="completed"
              control={control}
              render={({ field }) => (
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>Status</InputLabel>
                  <Select {...field} label="Status">
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="true">Completed</MenuItem>
                    <MenuItem value="false">Active</MenuItem>
                  </Select>
                </FormControl>
              )}
            />

            {/* User ID with Validation */}
            <Controller
              name="userId"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.userId}>
                  <TextField
                    {...field}
                    size="small"
                    label="User ID"
                    placeholder="e.g. 1"
                    error={!!errors.userId}
                    helperText={
                      errors.userId?.message ||
                      'Enter a valid number (try typing text to see validation)'
                    }
                    sx={{ width: 200 }}
                  />
                </FormControl>
              )}
            />

            {/* Limit with Validation */}
            <Controller
              name="limit"
              control={control}
              render={({ field }) => (
                <FormControl error={!!errors.limit}>
                  <TextField
                    {...field}
                    size="small"
                    label="Limit"
                    placeholder="1-100"
                    error={!!errors.limit}
                    helperText={errors.limit?.message || 'Max 100'}
                    sx={{ width: 150 }}
                  />
                </FormControl>
              )}
            />
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2}>
            <Button
              type="submit"
              variant="contained"
              startIcon={<SearchIcon />}
              disabled={isLoading}
            >
              Search
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterListOffIcon />}
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </Stack>
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
