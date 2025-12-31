import axios from 'axios';
import type {
  Todo,
  CreateTodoDto,
  UpdateTodoDto,
  TodoFilters,
} from '@/types/todo';

/**
 * Base URL for JSONPlaceholder API
 * This is a free fake API for testing and prototyping
 */
const BASE_URL = 'https://jsonplaceholder.typicode.com';

/**
 * Todos API client
 */
const todosApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get all todos with optional filters
 */
export async function getTodos(filters?: TodoFilters): Promise<Todo[]> {
  const response = await todosApi.get<Todo[]>('/todos', {
    params: filters,
  });
  return response.data;
}

/**
 * Get a single todo by ID
 */
export async function getTodoById(id: number): Promise<Todo> {
  const response = await todosApi.get<Todo>(`/todos/${id}`);
  return response.data;
}

/**
 * Create a new todo
 */
export async function createTodo(data: CreateTodoDto): Promise<Todo> {
  const response = await todosApi.post<Todo>('/todos', {
    ...data,
    userId: data.userId || 1, // Default user ID
    completed: data.completed || false,
  });
  return response.data;
}

/**
 * Update an existing todo
 */
export async function updateTodo(
  id: number,
  data: UpdateTodoDto
): Promise<Todo> {
  const response = await todosApi.patch<Todo>(`/todos/${id}`, data);
  return response.data;
}

/**
 * Delete a todo
 */
export async function deleteTodo(id: number): Promise<void> {
  await todosApi.delete(`/todos/${id}`);
}

/**
 * Toggle todo completion status
 */
export async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  return updateTodo(id, { completed });
}
