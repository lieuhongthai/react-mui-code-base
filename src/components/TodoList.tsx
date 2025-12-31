import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Paper,
  Typography,
  Box,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as UncheckedIcon,
} from '@mui/icons-material';
import { useNavigate } from '@tanstack/react-router';
import type { Todo } from '@/types/todo';
import { useToggleTodo, useDeleteTodo } from '@/hooks/useTodos';

export interface TodoListProps {
  /**
   * Array of todos to display
   */
  todos: Todo[];

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Error message
   */
  error?: string | null;

  /**
   * Empty state message
   */
  emptyMessage?: string;
}

export function TodoList({
  todos,
  isLoading = false,
  error = null,
  emptyMessage = 'No todos found. Create your first todo!',
}: TodoListProps) {
  const navigate = useNavigate();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [todoToDelete, setTodoToDelete] = useState<number | null>(null);

  const toggleMutation = useToggleTodo();
  const deleteMutation = useDeleteTodo({
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setTodoToDelete(null);
    },
  });

  const handleToggle = (id: number, completed: boolean) => {
    toggleMutation.mutate({ id, completed: !completed });
  };

  const handleEdit = (id: number) => {
    navigate({ to: `/todos/$id/edit`, params: { id: String(id) } });
  };

  const handleDeleteClick = (id: number) => {
    setTodoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (todoToDelete) {
      deleteMutation.mutate(todoToDelete);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setTodoToDelete(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  // Empty state
  if (todos.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          {emptyMessage}
        </Typography>
      </Paper>
    );
  }

  return (
    <>
      <List sx={{ width: '100%' }}>
        {todos.map((todo) => {
          const labelId = `todo-list-label-${todo.id}`;

          return (
            <Paper key={todo.id} sx={{ mb: 1 }}>
              <ListItem
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleEdit(todo.id)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDeleteClick(todo.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
                disablePadding
              >
                <ListItemButton
                  role={undefined}
                  onClick={() => handleToggle(todo.id, todo.completed)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={todo.completed}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ 'aria-labelledby': labelId }}
                      icon={<UncheckedIcon />}
                      checkedIcon={<CheckCircleIcon />}
                      color="success"
                    />
                  </ListItemIcon>
                  <ListItemText
                    id={labelId}
                    primary={
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                        }}
                      >
                        <Typography
                          variant="body1"
                          sx={{
                            textDecoration: todo.completed
                              ? 'line-through'
                              : 'none',
                            color: todo.completed
                              ? 'text.secondary'
                              : 'text.primary',
                          }}
                        >
                          {todo.title}
                        </Typography>
                        {todo.completed && (
                          <Chip
                            label="Completed"
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={`ID: ${todo.id} | User: ${todo.userId}`}
                  />
                </ListItemButton>
              </ListItem>
            </Paper>
          );
        })}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Todo?</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this todo? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={deleteMutation.isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={deleteMutation.isPending}
            startIcon={
              deleteMutation.isPending ? <CircularProgress size={20} /> : <DeleteIcon />
            }
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
