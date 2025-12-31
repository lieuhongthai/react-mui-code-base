import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  createTodoSchema,
  type CreateTodoFormData,
} from '@/schemas/todoSchema';

export interface TodoFormProps {
  /**
   * Default values for the form
   */
  defaultValues?: Partial<CreateTodoFormData>;

  /**
   * Form submit handler
   */
  onSubmit: (data: CreateTodoFormData) => void | Promise<void>;

  /**
   * Cancel button handler
   */
  onCancel?: () => void;

  /**
   * Loading state
   */
  isLoading?: boolean;

  /**
   * Submit button text
   */
  submitText?: string;

  /**
   * Form mode (create or edit)
   */
  mode?: 'create' | 'edit';
}

export function TodoForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading = false,
  submitText,
  mode = 'create',
}: TodoFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTodoFormData>({
    resolver: zodResolver(createTodoSchema) as any,
    defaultValues: {
      title: defaultValues?.title || '',
      completed: defaultValues?.completed || false,
    },
  });

  const loading = isLoading || isSubmitting;
  const buttonText = submitText || (mode === 'create' ? 'Create Todo' : 'Update Todo');

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ width: '100%' }}
    >
      <Stack spacing={3}>
        {/* Title Field */}
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Todo Title"
              placeholder="Enter todo title..."
              error={!!errors.title}
              helperText={errors.title?.message}
              disabled={loading}
              fullWidth
              autoFocus
              required
            />
          )}
        />

        {/* Completed Checkbox */}
        <Controller
          name="completed"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  disabled={loading}
                />
              }
              label="Mark as completed"
            />
          )}
        />

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
              disabled={loading}
              startIcon={<CancelIcon />}
            >
              Cancel
            </Button>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} /> : <SaveIcon />
            }
          >
            {buttonText}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
