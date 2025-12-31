import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import { useNavigate } from '@tanstack/react-router';
import { TodoForm } from '@/components/TodoForm';
import { useCreateTodo } from '@/hooks/useTodos';
import type { CreateTodoFormData } from '@/schemas/todoSchema';

export function TodoCreatePage() {
  const navigate = useNavigate();
  const createMutation = useCreateTodo({
    onSuccess: () => {
      // Navigate back to todos list on success
      navigate({ to: '/todos' });
    },
  });

  const handleSubmit = async (data: CreateTodoFormData) => {
    await createMutation.mutateAsync({
      title: data.title,
      completed: data.completed,
    });
  };

  const handleCancel = () => {
    navigate({ to: '/todos' });
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600} gutterBottom>
          Create New Todo
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Add a new todo to your list
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 3 }}>
        This demo uses JSONPlaceholder API. The todo will be created but won't persist on the server.
      </Alert>

      {/* Error Alert */}
      {createMutation.isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to create todo: {createMutation.error.message}
        </Alert>
      )}

      {/* Success Alert */}
      {createMutation.isSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Todo created successfully! Redirecting...
        </Alert>
      )}

      {/* Form */}
      <Paper sx={{ p: 3 }}>
        <TodoForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={createMutation.isPending}
          mode="create"
        />
      </Paper>
    </Container>
  );
}
