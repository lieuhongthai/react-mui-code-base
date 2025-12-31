import { z } from 'zod';

/**
 * Zod schema for creating a todo
 */
export const createTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters'),
  completed: z.boolean().default(false),
});

/**
 * Zod schema for updating a todo
 */
export const updateTodoSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(200, 'Title must not exceed 200 characters')
    .optional(),
  completed: z.boolean().optional(),
});

/**
 * Type inference from schemas
 */
export type CreateTodoFormData = z.infer<typeof createTodoSchema>;
export type UpdateTodoFormData = z.infer<typeof updateTodoSchema>;
