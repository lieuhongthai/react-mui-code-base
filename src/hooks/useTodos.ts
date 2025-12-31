import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from '@tanstack/react-query';
import {
  getTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
} from '@/api/todos';
import type {
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
  TodoFilters,
} from '@/types/todo';
import { toast } from '@/utils/toast';

/**
 * Query keys for todos
 */
export const todoKeys = {
  all: ['todos'] as const,
  lists: () => [...todoKeys.all, 'list'] as const,
  list: (filters?: TodoFilters) => [...todoKeys.lists(), filters] as const,
  details: () => [...todoKeys.all, 'detail'] as const,
  detail: (id: number) => [...todoKeys.details(), id] as const,
};

/**
 * Hook to fetch all todos
 */
export function useTodos(
  filters?: TodoFilters,
  options?: Omit<UseQueryOptions<Todo[]>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: todoKeys.list(filters),
    queryFn: () => getTodos(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
}

/**
 * Hook to fetch a single todo
 */
export function useTodo(
  id: number,
  options?: Omit<UseQueryOptions<Todo>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: todoKeys.detail(id),
    queryFn: () => getTodoById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
}

/**
 * Hook to create a new todo
 */
export function useCreateTodo(
  options?: UseMutationOptions<Todo, Error, CreateTodoDto>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTodo,
    onSuccess: (data, ...args) => {
      // Show success toast
      toast.created('Todo');

      // Invalidate and refetch todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      // Show error toast
      toast.createError(error);

      // Call user's onError if provided
      options?.onError?.(error, ...args);
    },
    ...options,
  });
}

/**
 * Hook to update a todo
 */
export function useUpdateTodo(
  options?: UseMutationOptions<Todo, Error, { id: number; data: UpdateTodoDto }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => updateTodo(id, data),
    onSuccess: (data, ...args) => {
      // Show success toast
      toast.updated('Todo');

      // Invalidate specific todo and list
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, ...args);
    },
    onError: (error, ...args) => {
      // Show error toast
      toast.updateError(error);

      // Call user's onError if provided
      options?.onError?.(error, ...args);
    },
    ...options,
  });
}

/**
 * Hook to delete a todo
 */
export function useDeleteTodo(
  options?: UseMutationOptions<void, Error, number>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTodo,
    onSuccess: (...args) => {
      // Show success toast
      toast.deleted('Todo');

      // Invalidate todos list
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(...args);
    },
    onError: (error, ...args) => {
      // Show error toast
      toast.deleteError(error);

      // Call user's onError if provided
      options?.onError?.(error, ...args);
    },
    ...options,
  });
}

/**
 * Hook to toggle todo completion
 */
export function useToggleTodo(
  options?: UseMutationOptions<Todo, Error, { id: number; completed: boolean }>
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }) => toggleTodo(id, completed),
    onSuccess: (data, { id }, ...args) => {
      // Show success toast
      toast.success(
        data.completed ? 'Todo marked as completed' : 'Todo marked as active'
      );

      // Invalidate and refetch after successful mutation
      queryClient.invalidateQueries({ queryKey: todoKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: todoKeys.lists() });

      // Call user's onSuccess if provided
      options?.onSuccess?.(data, { id, completed: data.completed }, ...args);
    },
    onError: (error, ...args) => {
      // Show error toast
      toast.error('Failed to update todo status');

      // Call user's onError if provided
      options?.onError?.(error, ...args);
    },
    ...options,
  });
}
