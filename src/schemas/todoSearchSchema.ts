import { z } from 'zod';

/**
 * Zod schema for Todo search/filter form
 */
export const todoSearchSchema = z.object({
  /**
   * Filter by completion status
   */
  completed: z.enum(['', 'true', 'false']).default(''),

  /**
   * Filter by user ID (must be a valid number)
   * Validates that input is a number, not text
   */
  userId: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true; // Empty is valid
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0; // Must be a positive number
      },
      {
        message: 'User ID must be a valid positive number',
      }
    ),

  /**
   * Limit number of results
   */
  limit: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val.trim() === '') return true;
        const num = parseInt(val, 10);
        return !isNaN(num) && num > 0 && num <= 100;
      },
      {
        message: 'Limit must be a number between 1 and 100',
      }
    ),
});

/**
 * Type inference from schema
 */
export type TodoSearchFormData = z.infer<typeof todoSearchSchema>;

/**
 * Default values for the search form
 */
export const todoSearchDefaults: TodoSearchFormData = {
  completed: '',
  userId: '',
  limit: '20',
};
