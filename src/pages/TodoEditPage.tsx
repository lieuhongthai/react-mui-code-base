import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import { useNavigate, useParams } from '@tanstack/react-router';
import { TodoForm } from '@/components/TodoForm';
import { useTodo, useUpdateTodo } from '@/hooks/useTodos';
import type { CreateTodoFormData } from '@/schemas/todoSchema';

export function TodoEditPage() {
  const navigate = useNavigate();
  const { id } = useParams({ from: '/todos/$id/edit' });
  const todoId = parseInt(id);

  const { data: todo, isLoading, error } = useTodo(todoId);
  const updateMutation = useUpdateTodo({
    onSuccess: () => {
      // Navigate back to todos list on success
      navigate({ to: '/todos' });
    },
  });

  const handleSubmit = async (data: CreateTodoFormData) => {
    await updateMutation.mutateAsync({
      id: todoId,
      data: {
        title: data.title,
        completed: data.completed,
      },
    });
  };

  const handleCancel = () => {
    navigate({ to: '/todos' });
  };

  // Loading state
  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Skeleton variant="text" width={300} height={50} />
          <Skeleton variant="text" width={200} />
        </Box>
        <Paper sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Skeleton variant="rectangular" height={56} />
            <Skeleton variant="rectangular" height={40} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Skeleton variant="rectangular" width={100} height={40} />
              <Skeleton variant="rectangular" width={100} height={40} />
            </Box>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Error state
  if (error || !todo) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          Failed to load todo: {error?.message || 'Todo not found'}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Edit Todo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update todo details (ID: {todo.id})
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        This demo uses JSONPlaceholder API. Changes are simulated and won't persist on the server.
      </Alert>

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <TodoForm
          defaultValues={{
            title: todo.title,
            completed: todo.completed,
          }}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateMutation.isPending}
          mode="edit"
        />
      </Paper>
    </Container>
  );
}
